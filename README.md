# MorphioAI 🚀

Transform your content across multiple social media platforms with AI-powered content repurposing.

## ✨ Features

- **AI-Powered Content Transformation**: Uses Mistral 7B Instruct for intelligent content repurposing
- **Multi-Platform Support**: Generate content optimized for Twitter/X, LinkedIn, and Instagram
- **No Character Limits**: Paste entire blog posts, YouTube transcripts, or any amount of content
- **Real-time Generation**: Fast content transformation with Hugging Face Inference API
- **User Authentication**: Secure login system with NextAuth.js
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI Model**: Mistral 7B Instruct via Hugging Face
- **Authentication**: NextAuth.js with Supabase
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Hugging Face API token
- Supabase account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZenMachina16/MorphioAI.git
   cd MorphioAI/content-repurposer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Hugging Face API
   HUGGINGFACEHUB_API_TOKEN=your_huggingface_token_here
   
   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:3000
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see MorphioAI in action!

## 📖 How to Use

1. **Sign In**: Create an account or sign in with your credentials
2. **Add Content**: Paste your blog post, YouTube transcript, or any content
3. **Select Platforms**: Choose Twitter/X, LinkedIn, and/or Instagram
4. **Generate**: Click "Repurpose Content" to get AI-optimized versions
5. **Copy & Use**: Copy the generated content for your social media posts

## 🤖 AI Model Details

MorphioAI uses **Mistral 7B Instruct v0.3** for content transformation:
- **Model**: `mistralai/Mistral-7B-Instruct-v0.3`
- **Provider**: Hugging Face Inference API
- **Features**: Instruction-following, context-aware, multilingual
- **Optimization**: Platform-specific prompts for best results

## 📚 API Reference

### POST `/api/repurpose`

Transform content for multiple platforms.

**Request Body:**
```json
{
  "content": "Your original content here...",
  "platforms": ["twitter", "linkedin", "instagram"]
}
```

**Response:**
```json
{
  "results": {
    "twitter": "Generated Twitter content...",
    "linkedin": "Generated LinkedIn content...",
    "instagram": "Generated Instagram content..."
  }
}
```

## 🔧 Configuration

### Platform-Specific Optimization

- **Twitter/X**: Optimized for engagement, hashtags, under 280 characters
- **LinkedIn**: Professional tone, business insights, thought leadership
- **Instagram**: Visual-friendly, emojis, community engagement

### Environment Variables

See `SETUP.md` for detailed environment variable configuration.

## 🚀 Deployment

### Deploy on Vercel

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy your app

### Deploy on Other Platforms

MorphioAI is a standard Next.js app and can be deployed on any platform that supports Node.js.

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

- **Documentation**: Check `SETUP.md` for detailed setup instructions
- **Issues**: Report bugs or request features on GitHub Issues
- **Community**: Join our discussions

---

**Built with ❤️ using AI-powered technology**

Transform your content. Amplify your reach. Welcome to MorphioAI.
