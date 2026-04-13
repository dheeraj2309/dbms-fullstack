import NextAuth, { DefaultSession, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      isEmailVerified: boolean;
    } & DefaultSession['user'];
  }
  interface User {
    role: string;
    isEmailVerified: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    isEmailVerified: boolean;
  }
}
