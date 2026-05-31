import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import {requireVercelEnv} from './vercel-env';

export const authOptions: NextAuthOptions = {
  providers: googleClientId && googleClientSecret ? [
    GoogleProvider({
      clientId: requireVercelEnv('GOOGLE_CLIENT_ID'),
      clientSecret: requireVercelEnv('GOOGLE_CLIENT_SECRET'),
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly'
        }
      }
    }),
  ],
  secret: requireVercelEnv('NEXTAUTH_SECRET'),
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
};
