import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/lib/validations"

// This file has NO Prisma import — safe for Edge Runtime
export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.isEmailVerified = user.isEmailVerified
      }
      return token
    },

    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      session.user.isEmailVerified = token.isEmailVerified as boolean
      return session
    },
  },

  providers: [], // empty here — providers added in auth.ts
}