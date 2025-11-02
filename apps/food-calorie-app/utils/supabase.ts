import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eehyvpahvzsupocoutjo.supabase.co";

// TODO: Replace with your actual API key from Supabase Dashboard > Settings > API > Project API keys > anon/public
// The API key is a long JWT token starting with "eyJ..." - NOT the project reference ID
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlaHl2cGFodnpzdXBvY291dGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDQzMjMsImV4cCI6MjA3NzQ4MDMyM30.T8pFwvH3ZXN_1qnzv0QIsTqZiiB5yGhEO6pA7ZaVC8k";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key. Please add your API key in utils/supabase.ts");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
