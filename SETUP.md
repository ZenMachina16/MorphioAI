# Content Repurposer Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Hugging Face API Token
HUGGINGFACEHUB_API_TOKEN=your-huggingface-token

# Supabase Configuration (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://jocvaewlxyhlnytqvsah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvY3ZhZXdseHlobG55dHF2c2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0OTAwMDcsImV4cCI6MjA2NjA2NjAwN30.o86YQwot_bR3giDusOawNJiLlG_UaFzEhYN35QgUI5Q
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvY3ZhZXdseHlobG55dHF2c2FoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQ5MDAwNywiZXhwIjoyMDY2MDY2MDA3fQ.X5bl-TPuGVZkDobQQh5_IDA7Iq6SgpKE4TSZA9imOvw

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen
6. Set the authorized redirect URIs to: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env.local` file

## NextAuth Secret

Generate a random secret for NextAuth:
```bash
openssl rand -base64 32
```

## Running the Application

1. Install dependencies: `pnpm install`
2. Set up your `.env.local` file with the above variables
3. Run the development server: `pnpm dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database

The Supabase database has been automatically configured with the necessary tables for NextAuth:
- `users` - Store user information
- `accounts` - Store OAuth account connections
- `sessions` - Store user sessions
- `verification_tokens` - Store email verification tokens

## Features

- ✅ Landing page with Google authentication
- ✅ Protected dashboard route
- ✅ Session management with NextAuth
- ✅ Supabase database integration
- ✅ Responsive design with Tailwind CSS
- 🔄 Content repurposing functionality (coming next)
- 🔄 Subscription management with Dodo Payments (coming next)
- 🔄 AI integration with Mistral 7B (coming next) 