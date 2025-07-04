import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token
        token.googleId = profile.sub
      }
      return token
    },
    async session({ session, token }) {
      // Add custom properties to session
      if (session.user?.email) {
        session.user.googleId = token.googleId as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allow explicit callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Redirect to dashboard for OAuth sign-in
      if (url.startsWith(baseUrl)) return `${baseUrl}/dashboard`
      // Default redirect to dashboard
      return `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  debug: false,
} 