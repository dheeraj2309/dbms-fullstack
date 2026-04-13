// Next-Auth (or Auth.js) can feel like a "black box" because it handles so much via abstraction. Think of the NextAuth() function as a Factory. You give it a blueprint (Configuration), and it gives you back all the tools you need to manage security.
// Here is the anatomy of the Next-Auth wrapper.
// 1. The "In": The Configuration Object
// When you call NextAuth({...}), you pass in an object. These are the four main pillars you define:
// A. Providers (The "Who")
// This is an array of services allowed to verify your users.
// Credentials: Your own DB logic (Email/Password).
// OAuth: Google, GitHub, etc.
// What goes in: API Keys, Secrets, and the authorize() function (for Credentials).
// B. Session (The "How")
// How do you want to remember the user?
// strategy: "jwt": (Default) Encrypt the user data into a cookie. No DB hits per request.
// strategy: "database": Store a session ID in the cookie and the actual data in your DB (requires an Adapter).
// C. Pages (The "Where")
// By default, Next-Auth provides ugly, unstyled login pages.
// What goes in: A mapping of actions to routes (e.g., signIn: "/login").
// Result: If a user tries to access a protected page, Next-Auth automatically redirects them to your custom /login.
// D. Callbacks (The "Processing")
// These are the functions that let you modify data as it moves through the system.
// jwt(): Runs when the cookie is created/updated.
// session(): Runs when the app asks "Who is logged in?"
// 2. The "Out": What the Factory Returns
// In the new version (v5), the NextAuth() call returns an object that you destructure.
// TypeScript
// export const {
//   handlers, // The "Plumbing"
//   auth,     // The "Sensor"
//   signIn,   // The "Action" (Server-side)
//   signOut   // The "Action" (Server-side)
// } = NextAuth({ ...config })
// handlers (GET and POST)
// These are exported in your api/auth/[...nextauth]/route.ts.
// Under the hood: They create the actual URLs like /api/auth/signin, /api/auth/callback, and /api/auth/session. You never call these manually; the Next-Auth client does it for you.
// auth
// This is your Swiss Army Knife for the server.
// In Server Components: const session = await auth() gets you the user data instantly.
// In Middleware: It checks if a user is allowed to see a route before the page even starts rendering.
// import NextAuth from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';
// import { prisma } from '@/lib/prisma';
// import bcrypt from 'bcryptjs';
// import { LoginSchema } from './validations';
// import { z } from 'zod';

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   session: {
//     // where to save the encrypted tokens
//     strategy: 'jwt',
//   },
//   pages: {
//     // if login fails(or unauthenticated) , where to redirect
//     signIn: '/login',
//   },
//   callbacks: {
//     // encrypt the details and generate the token as soon as user logins
//     // this callback is run
//     async jwt({ token, user }) {
//       if (user) {
//         ((token.id = user.id), (token.role = user.role));
//         token.isEmailVerified = user.isEmailVerified;
//       }
//       return token;
//     },
//     //  Step 2: runs every time session is READ (in components, middleware)
//     // Copy token fields onto the session so your app can read them
//     async session({ session, token }) {
//       session.user.id = token.id as string;
//       session.user.role = token.role as string;
//       session.user.isEmailVerified = token.isEmailVerified as boolean;
//       return session;
//     },
//   },
//   providers: [
//     Credentials({
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },

//       // this runs when the user submits the login form
//       async authorize(credentials) {
//         const parsed = LoginSchema.safeParse(credentials);
//         if (!parsed.success) return null; // this was crazy using parsed.success !
//         // extract credentials
//         const { email, password } = parsed.data;
//         // find user in db
//         const user = await prisma.user.findUnique({
//           where: { email },
//         });
//         if (!user) return null;

//         // check password
//         const checkPassword = await bcrypt.compare(password, user.password);
//         if (!checkPassword) return null;

//         // 4. Return user object — this gets passed to the jwt() callback above
//         return {
//           id: user.id,
//           email: user.email,
//           role: user.role,
//           isEmailVerified: user.isEmailVerified,
//         };
//       },
//     }),
//   ],
// });

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { LoginSchema } from '@/lib/validations';
import { authConfig } from '@/lib/auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig, // spread the edge-safe config

  // Add the Credentials provider here — this is the Node.js only part
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        };
      },
    }),
  ],
});
// User submits login form
//         ↓
// authorize() in auth.ts runs
//   → validates with Zod
//   → finds user in DB
//   → compares password with bcrypt
//   → returns user object (or null = login failed)
//         ↓
// jwt() callback runs
//   → attaches id, role, emailVerified to the JWT token
//         ↓
// session() callback runs
//   → copies those fields from token → session
//         ↓
// Your components/middleware can now read:
//   session.user.id
//   session.user.role
//   session.user.isEmailVerified
