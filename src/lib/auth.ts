import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { getVercelEnv } from './vercel-env';

const googleClientId = getVercelEnv('GOOGLE_CLIENT_ID');
const googleClientSecret = getVercelEnv('GOOGLE_CLIENT_SECRET');

const providers = (googleClientId && googleClientSecret) ? [
  GoogleProvider({
    clientId: googleClientId,
    clientSecret: googleClientSecret,
    authorization: {
      params: {
        scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly',
      },
    },
  }),
] : [];

export const authOptions: NextAuthOptions = {
  providers,
  // Use NEXTAUTH_SECRET if set; leave undefined otherwise so builds won't throw.
  secret: getVercelEnv('NEXTAUTH_SECRET'),
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        (token as any).accessToken = (account as any).access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session as any).accessToken = (token as any).accessToken;
      }
      return session;
    },
  },
};
