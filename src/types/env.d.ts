declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: string;
    NEXT_PUBLIC_STORY_PROTOCOL_API_KEY: string;
    
    // Private keys - server-side only
    IRYS_PRIVATE_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    STORY_PROTOCOL_PRIVATE_KEY: string;
  }
}