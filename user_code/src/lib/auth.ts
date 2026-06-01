
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import {getVercelEnv} from '../../../src/lib/vercel-env';

const googleClientId = getVercelEnv('GOOGLE_CLIENT_ID');
const googleClientSecret = getVercelEnv('GOOGLE_CLIENT_SECRET');
const nextAuthSecret = getVercelEnv('NEXTAUTH_SECRET');

export const authOptions: NextAuthOptions = {
  providers: googleClientId && googleClientSecret ? [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ] : [],
  secret: nextAuthSecret,
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      // The session object is what the client-side useSession() hook receives.
      if (session.user) {
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
};
