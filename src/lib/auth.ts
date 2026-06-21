import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import {getVercelEnv} from './vercel-env';

const googleClientId = getVercelEnv('GOOGLE_CLIENT_ID');
const googleClientSecret = getVercelEnv('GOOGLE_CLIENT_SECRET');

export const authOptions: NextAuthOptions = {
  providers: googleClientId && googleClientSecret ? [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly'
        }
      }
    }),
  ] : [],
  secret: getVercelEnv('NEXTAUTH_SECRET'),
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
