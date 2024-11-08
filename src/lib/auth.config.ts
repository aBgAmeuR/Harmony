import type { NextAuthConfig } from "next-auth";
import Spotify from "next-auth/providers/spotify";

export default {
  providers: [
    Spotify({
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-recently-played%20user-top-read"
    })
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    }
  }
} satisfies NextAuthConfig;
