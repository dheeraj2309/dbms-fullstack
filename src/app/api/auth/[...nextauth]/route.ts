// User submits login form
//         ↓
// Browser sends POST request to /api/auth/signin
//         ↓
// Next.js routes it to [...nextauth]/route.ts
//         ↓
// handlers.POST receives it
//         ↓
// NextAuth internally calls your authorize() function in auth.ts
//         ↓
// authorize() checks DB, verifies password, returns user
//         ↓
// NextAuth calls your jwt() callback → builds the token
//         ↓
// NextAuth sets encrypted JWT as a cookie in the browser
//         ↓
// User is now logged in
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
