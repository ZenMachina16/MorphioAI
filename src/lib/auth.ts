import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { supabase } from "./supabase"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user in database
          const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", credentials.email)
            .single()

          if (error || !user) {
            return null
          }

          // Check password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account && profile) {
        token.accessToken = account.access_token
        token.googleId = profile.sub
      }
      
      if (user) {
        token.sub = user.id
      }
      
      return token
    },
    async session({ session, token }) {
      // Add custom properties to session
      if (session.user?.email) {
        session.user.id = token.sub as string
        session.user.googleId = token.googleId as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists in database
          const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", user.email)
            .single()

          if (!existingUser) {
            // Create user in database for Google sign-in
            const { error } = await supabase
              .from("users")
              .insert([
                {
                  email: user.email,
                  name: user.name,
                  image: user.image,
                  plan: "hobby",
                  jobs_this_month: 0,
                },
              ])

            if (error) {
              console.error("Error creating user:", error)
              return false
            }
          }
        } catch (error) {
          console.error("SignIn callback error:", error)
          return false
        }
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after successful sign-in
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/dashboard`
      }
      
      // Allow relative URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      
      // Allow same origin URLs
      if (url.startsWith(baseUrl)) {
        return url
      }
      
      return `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development',
} 