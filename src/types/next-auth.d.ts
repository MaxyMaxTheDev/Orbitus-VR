
import 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in session types to add the accessToken property.
   * This is used to access the Google API on behalf of the user.
   */
  interface Session {
    accessToken?: string;
  }
}
