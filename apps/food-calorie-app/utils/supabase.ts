import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://inhcknatwyacvimwtxho.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluaGNrbmF0d3lhY3ZpbXd0eGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0ODM2MjMsImV4cCI6MjA1MTA1OTYyM30.xYlUHeyUFVFd2JC7ztoGnUXTTrvkbxKtqxJMAnsRDvE";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
