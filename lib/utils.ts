import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import Cryptr from 'cryptr';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a random Ethereum wallet address


// Encrypt private key
export function encryptPrivateKey(privateKey: string): string {
  const cryptr = new Cryptr(process.env.ENCRYPTION_KEY || '');

  const encryptedString = cryptr.encrypt(privateKey);
  return encryptedString;
  
}

// Decrypt private key with backward compatibility
export function decryptPrivateKey(encryptedPrivateKey: string): string {
  console.log("decrypting private key");
  const cryptr = new Cryptr(process.env.ENCRYPTION_KEY || '');
  console.log("decrypted private key");
  const decryptedString = cryptr.decrypt(encryptedPrivateKey);
  console.log("decrypted private key", decryptedString);
  return decryptedString;
 
}
