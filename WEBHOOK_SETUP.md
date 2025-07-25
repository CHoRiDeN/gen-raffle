# Clerk Webhook Setup Guide

This guide will help you set up the Clerk webhook to automatically create users in your database when they sign up.

## Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/genlayer_raffle"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Encryption (32 characters recommended)
ENCRYPTION_KEY=your_32_character_encryption_key_here
```

## Clerk Dashboard Setup

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Webhooks** in the sidebar
3. Click **Add Endpoint**
4. Set the following:
   - **Endpoint URL**: `https://your-domain.com/api/webhooks/clerk`
   - **Version**: `v1`
   - **Events**: Select these events:
     - `user.created`
     - `user.updated`
     - `user.deleted`
5. Click **Add Endpoint**
6. Copy the **Signing Secret** and add it to your `CLERK_WEBHOOK_SECRET` environment variable

## Webhook Endpoint

The webhook endpoint is located at `app/api/webhooks/clerk/route.ts` and handles:

- **user.created**: Creates a new user in the database with a generated wallet address
- **user.updated**: Updates user information in the database
- **user.deleted**: Removes the user from the database

## Features

- **Automatic Wallet Generation**: Each new user gets a unique Ethereum wallet address
- **Encrypted Private Keys**: Private keys are encrypted and stored securely
- **Webhook Verification**: Uses Svix to verify webhook signatures
- **Error Handling**: Comprehensive error handling and logging

## Testing

To test the webhook locally:

1. Use a tool like [ngrok](https://ngrok.com/) to expose your local server
2. Update the webhook URL in Clerk dashboard to your ngrok URL
3. Create a new user in your app
4. Check the console logs for webhook events

## Security Notes

- Always use a strong `ENCRYPTION_KEY` in production
- Keep your `CLERK_WEBHOOK_SECRET` secure
- The webhook verifies signatures to prevent unauthorized requests
- Private keys are encrypted before storage 