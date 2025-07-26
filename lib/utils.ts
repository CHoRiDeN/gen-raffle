import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a random Ethereum wallet address


// Encrypt private key
export function encryptPrivateKey(privateKey: string, encryptionKey: string): { encrypted: string; iv: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey.slice(0, 32)), iv);
  
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex')
  };
}

// Decrypt private key
export function decryptPrivateKey(encryptedPrivateKey: string, iv: string, encryptionKey: string): string {
  console.log("ENCRYPTION KEY: ", encryptionKey);
  console.log("IV: ", iv);
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey.slice(0, 32)), Buffer.from(iv, 'hex'));
  
  let decrypted = decipher.update(encryptedPrivateKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
