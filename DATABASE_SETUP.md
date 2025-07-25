# Database Setup Guide

This project uses PostgreSQL with Prisma ORM for database management.

## Prerequisites

1. **PostgreSQL**: Make sure you have PostgreSQL installed and running on your system
2. **Node.js**: Ensure you have Node.js and npm installed

## Setup Instructions

### 1. Install Dependencies

The required packages are already installed:
- `prisma`: Prisma CLI and core package
- `@prisma/client`: Prisma client for database operations

### 2. Database Configuration

The project is configured to use a PostgreSQL database with the following connection string:
```
postgresql://postgres:password@localhost:5432/genlayer_raffle_db
```

**To set up your local PostgreSQL database:**

1. **Install PostgreSQL** (if not already installed):
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`
   - Windows: Download from https://www.postgresql.org/download/windows/

2. **Start PostgreSQL service**:
   - macOS: `brew services start postgresql`
   - Ubuntu: `sudo systemctl start postgresql`
   - Windows: Start from Services

3. **Create the database**:
   ```bash
   psql -U postgres
   CREATE DATABASE genlayer_raffle_db;
   \q
   ```

4. **Update .env file** (if needed):
   Update the `DATABASE_URL` in your `.env` file with your actual PostgreSQL credentials:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/genlayer_raffle_db"
   ```

### 3. Database Schema

The project includes the following tables:

#### Users Table
- `id`: Primary key (auto-increment)
- `name`: User's name (VARCHAR 255)
- `clerk_id`: Unique Clerk authentication ID (VARCHAR 255)
- `email`: User's email (VARCHAR 255, unique)
- `wallet_address`: User's wallet address (VARCHAR 255, unique)
- `encrypted_private_key`: Encrypted private key (TEXT)
- `iv`: Initialization vector for decryption (VARCHAR 32)
- `created_at`: Timestamp of creation

#### Raffles Table
- `id`: Primary key (auto-increment)
- `creator_id`: Foreign key to users table
- `contract_address`: Smart contract address (VARCHAR 255, unique)
- `created_at`: Timestamp of creation

### 4. Initialize Database

Run the following commands to set up your database:

```bash
# Generate Prisma client
npx prisma generate

# Push the schema to your database
npx prisma db push

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

### 5. Available Database Actions

The project includes the following database actions in `actions/databaseActions.tsx`:

- `getRaffles()`: Get all raffles with creator information
- `getRaffleByContractAddress(contractAddress)`: Get a specific raffle by contract address
- `createRaffle(creatorId, contractAddress)`: Create a new raffle
- `getUserByClerkId(clerkId)`: Get user by Clerk ID
- `createUser(userData)`: Create a new user

### 6. Environment Variables

Make sure your `.env` file includes:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/genlayer_raffle_db"

# Clerk Authentication (if using Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# NextAuth (if using NextAuth)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 7. Development

For development, you can use Prisma's development server:

```bash
# Start Prisma development server
npx prisma dev
```

This will start a local PostgreSQL server and provide a connection URL that you can use in your `.env` file.

### 8. Troubleshooting

**Connection Issues:**
- Ensure PostgreSQL is running
- Check your connection string in `.env`
- Verify database exists
- Check firewall settings

**Migration Issues:**
- Use `npx prisma db push` for development
- Use `npx prisma migrate dev` for production-like environments

**Prisma Client Issues:**
- Run `npx prisma generate` after schema changes
- Restart your development server

## Usage Example

```typescript
import { getRaffles, createRaffle } from '@/actions/databaseActions'

// Get all raffles
const raffles = await getRaffles()

// Create a new raffle
const newRaffle = await createRaffle(1, "0x1234567890abcdef...")
``` 