# ContentRepurposer - AI-Powered Content Repurposing SaaS

Transform your long-form content into engaging social media posts for X (Twitter), LinkedIn, and Instagram using the power of AI.

## 🚀 Features

- **AI-Powered Content Generation**: Uses GPT-4o to create platform-optimized social media content
- **Multi-Platform Support**: Generate content for X (Twitter), LinkedIn, and Instagram
- **URL Content Scraping**: Extract content directly from any web article
- **User Authentication**: Google OAuth and email/password authentication via Supabase
- **Beautiful UI**: Modern, responsive design with Tailwind CSS and shadcn/ui components
- **Subscription Ready**: Built with Stripe integration foundation for monetization

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication & Database**: Supabase
- **AI/LLM**: OpenAI GPT-4o
- **Payments**: Stripe (foundation)
- **Deployment**: Vercel-ready

## 📋 Prerequisites

Before running this application, you'll need:

1. **Node.js** (v18 or higher)
2. **Supabase Project**: [Create a new project](https://supabase.com)
3. **OpenAI API Key**: [Get your API key](https://platform.openai.com)
4. **Stripe Account**: [Setup for payments](https://stripe.com) (optional for basic functionality)

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

\`\`\`bash
git clone <your-repo-url>
cd content-repurposer
npm install
\`\`\`

### 2. Environment Variables

Create a \`.env.local\` file in the root directory and add the following variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Supabase Setup

#### Create the profiles table:

Go to your Supabase dashboard → SQL Editor and run:

\`\`\`sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  subscription_status TEXT DEFAULT 'free',
  usage_count INTEGER DEFAULT 0,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view and update their own profile" ON profiles
  FOR ALL USING (auth.uid() = id);
\`\`\`

#### Configure Authentication Providers:

1. Go to Authentication → Providers in your Supabase dashboard
2. Enable Google OAuth:
   - Add your Google Client ID and Secret
   - Add redirect URL: \`http://localhost:3000/auth/callback\`
3. Enable Twitter OAuth (optional):
   - Add your Twitter/X API credentials
   - Add redirect URL: \`http://localhost:3000/auth/callback\`

### 4. Run the Application

\`\`\`bash
npm run dev
\`\`\`

The application will be available at \`http://localhost:3000\`

## 📱 Usage

1. **Landing Page**: Visit the homepage to learn about the service
2. **Sign Up/Login**: Create an account or sign in using Google, Twitter, or email
3. **Dashboard**: Access the main application interface
4. **Content Input**: 
   - Paste your article text directly, or
   - Provide a URL to any web article
5. **Generate Content**: Click "Repurpose Content" to generate social media posts
6. **Copy & Share**: Use the copy buttons to easily share generated content

## 🏗️ Project Structure

\`\`\`
content-repurposer/
├── app/
│   ├── api/
│   │   └── repurpose/
│   │       └── route.ts          # Core AI content generation API
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts          # OAuth callback handler
│   │   └── login/
│   │       └── page.tsx          # Login page
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard (protected)
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── supabase.ts              # Supabase client configuration
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
\`\`\`

## 🔒 Authentication Flow

1. User visits login page
2. Chooses authentication method (Google OAuth, Twitter OAuth, or email/password)
3. OAuth providers redirect to \`/auth/callback\`
4. Callback handler processes authentication and redirects to dashboard
5. Dashboard checks authentication status and redirects to login if not authenticated

## 🤖 AI Content Generation

The application uses OpenAI's GPT-4o model to generate platform-specific content:

- **X (Twitter)**: 3-5 short posts under 280 characters with hashtags
- **LinkedIn**: Professional posts (1300-3000 characters) with engagement hooks
- **Instagram**: Visual captions with emojis and hashtags

## 🚦 Environment Setup Notes

- **Development**: Uses \`http://localhost:3000\`
- **Production**: Update \`NEXT_PUBLIC_APP_URL\` and OAuth redirect URLs
- **Database**: Supabase handles authentication and user profiles
- **File Structure**: Follows Next.js 14 App Router conventions

## 🔄 Next Steps

To complete the full SaaS functionality, you can:

1. Implement Stripe subscription logic
2. Add usage limits based on subscription tiers
3. Create subscription management pages
4. Add webhook handlers for payment events
5. Implement user profile management
6. Add content history and saved posts

## 📄 License

This project is created for educational purposes. Modify and use as needed for your projects.

## 🤝 Contributing

Feel free to open issues and submit pull requests to improve the application.
