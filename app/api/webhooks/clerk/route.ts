import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { encryptPrivateKey } from '@/lib/utils';
import { generatePrivateKey, createAccount } from 'genlayer-js';


export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(process.env.WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  // Handle the webhook
  switch (eventType) {
    case 'user.created':
      try {
        const user = evt.data;
        
        // Generate wallet address and private key
        const privateKey = generatePrivateKey();
        const encrypted = encryptPrivateKey(privateKey);
        const account = createAccount(privateKey);

        // Create user in database
        const dbUser = await prisma.user.create({
          data: {
            clerk_id: user.id,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Anonymous',
            email: user.email_addresses?.[0]?.email_address || '',
            wallet_address: account.address,
            encrypted_private_key: encrypted,
            iv: 'no iv'
          },
        });
        
        console.log('User created in database:', dbUser);
        return NextResponse.json({ success: true, user: dbUser });
      } catch (error) {
        console.error('Error creating user in database:', error);
        return NextResponse.json(
          { error: 'Failed to create user in database' },
          { status: 500 }
        );
      }
      

      
    case 'user.deleted':
      try {
        const user = evt.data;
        
        // Delete user from database
        await prisma.user.delete({
          where: { clerk_id: user.id },
        });
        
        console.log('User deleted from database:', user.id);
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('Error deleting user from database:', error);
        return NextResponse.json(
          { error: 'Failed to delete user from database' },
          { status: 500 }
        );
      }
      
    default:
      console.log(`Unhandled event type: ${eventType}`);
      return NextResponse.json({ success: true });
  }
} 

