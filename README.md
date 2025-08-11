# GenLayer Raffle - AI-Powered Subjective Raffles on the Blockchain

Create and participate in raffles where AI consensus determines winners based on subjective criteria. Trustless, transparent, and fair judgment at machine speed.

## 🌐 Live Demo

Check out the live application at: **[https://gen-raffle.vercel.app/](https://gen-raffle.vercel.app/)**

The demo showcases various raffles including:
- "Make Us Laugh Out Loud – Funniest Joke Wins"
- "✈️ Your Most Unexpected Travel Adventure – by Airbnb"
- "☕ Tell Us Your Craziest Coffee Moment"
- "🍫 Break the Rules with KitKat!"
- "Worst Travel Advice You've Ever Gotten"

## 🚀 Features

- **AI-Powered Judging**: Subjective criteria evaluated by AI consensus
- **Blockchain Integration**: Smart contracts for trustless raffle execution
- **User Authentication**: Secure authentication with Clerk
- **Wallet Management**: Automatic wallet generation for users
- **Real-time Updates**: Live raffle status and winner announcements
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Blockchain**: GenLayer integration
- **Deployment**: Vercel-ready

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm** or **bun**
- **PostgreSQL** (v12 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/CHoRiDeN/gen-raffle
cd genlayer-raffle
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following environment variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/genlayer_raffle_db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Encryption (32 characters recommended)
ENCRYPTION_KEY=your_32_character_encryption_key_here

# Webhook Secret (same as CLERK_WEBHOOK_SECRET)
WEBHOOK_SECRET=your_clerk_webhook_secret
```

### 4. Database Setup

#### Option A: Local PostgreSQL

1. **Install PostgreSQL**:
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Ubuntu
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   
   # Windows: Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**:
   ```bash
   psql -U postgres
   CREATE DATABASE genlayer_raffle_db;
   \q
   ```

3. **Update DATABASE_URL** in your `.env.local` with your actual credentials:
   ```bash
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/genlayer_raffle_db"
   ```

#### Option B: Supabase (Recommended for Development)

1. Go to [Supabase](https://supabase.com) and create a new project
2. Get your database connection string from Settings > Database
3. Update your `DATABASE_URL` in `.env.local`

### 5. Initialize Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Push the schema to your database
npx prisma db push

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

### 6. Clerk Authentication Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Get your API keys from the dashboard:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Update your `.env.local` with these keys

### 7. Webhook Configuration (Optional for Development)

For production or testing webhooks locally:

1. In Clerk Dashboard, go to **Webhooks**
2. Click **Add Endpoint**
3. Set the endpoint URL: `https://your-domain.com/api/webhooks/clerk`
4. Select events: `user.created`, `user.updated`, `user.deleted`
5. Copy the signing secret to `CLERK_WEBHOOK_SECRET` and `WEBHOOK_SECRET`

### 8. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🔗 Webhook Integration

The application uses Clerk webhooks to automatically create users in the database whenever a new user registers. When a user signs up through Clerk, the webhook endpoint (`/api/webhooks/clerk`) is triggered and:

- Creates a new user record in the database
- Generates a unique Ethereum wallet address for the user
- Encrypts and stores the private key securely
- Links the Clerk user ID to the database user

**For local development testing:**
- Use a tunnel tool like [ngrok](https://ngrok.com/) to expose your local server
- Update the webhook URL in Clerk dashboard to your ngrok URL (e.g., `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`)
- Test user registration to verify webhook functionality

## 🏗️ Smart Contract

The raffle smart contract is located in `contracts/raffle_contract.py`. This contract handles:

- Raffle creation and management
- Submission handling and storage
- AI-powered winner determination
- Prize distribution

**Testing the Smart Contract:**
- You can test and deploy the contract using the [GenLayer Studio](https://studio.genlayer.com/contracts)
- The studio provides a development environment for testing contract functionality
- Use the studio to verify contract logic before deploying to production

## 🗄️ Database Architecture

The database only stores essential user and raffle metadata:

### Database Storage (PostgreSQL)
- **Users**: Basic user information, wallet addresses, and encrypted private keys
- **Raffles**: Basic raffle information (creator, contract address, creation date, image URL)

### Blockchain Storage (GenLayer)
- **Raffle Submissions**: All user submissions and their content
- **Raffle Status**: Current state, winner selection, and execution status
- **Smart Contract Logic**: All raffle rules and AI consensus mechanisms

This hybrid approach ensures:
- Fast access to basic information via database queries
- Immutable and transparent raffle data on the blockchain
- Decentralized execution of AI-powered winner determination

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint


## 🔐 Security Features

- **Encrypted Private Keys**: All wallet private keys are encrypted before storage
- **Webhook Verification**: Uses Svix to verify webhook signatures
- **Authentication**: Secure user authentication with Clerk
- **Environment Variables**: Sensitive data stored in environment variables

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues:**
- Ensure PostgreSQL is running
- Check your `DATABASE_URL` in `.env.local`
- Verify database exists and is accessible

**Prisma Issues:**
- Run `npx prisma generate` after schema changes
- Use `npx prisma db push` for development
- Restart your development server after Prisma changes

**Clerk Authentication Issues:**
- Verify your Clerk API keys are correct
- Check that your domain is whitelisted in Clerk dashboard
- Ensure environment variables are properly set

**Webhook Issues:**
- Verify webhook secret matches in Clerk dashboard
- Check webhook endpoint URL is correct
- Use ngrok for local webhook testing

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GenLayer Documentation](https://docs.genlayer.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



---

**Happy Raffling! 🎉**
