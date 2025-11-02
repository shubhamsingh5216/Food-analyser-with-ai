import { supabase } from "./supabase";

/**
 * Test Supabase connection
 */
export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    console.log("Testing Supabase connection...");
    
    // Try a simple query to test connection
    const { data, error } = await supabase.from("users").select("count").limit(1);
    
    if (error) {
      // Check if it's a table doesn't exist error
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return {
          success: false,
          message: "Supabase connected, but 'users' table does not exist. Please create the tables in your Supabase database.",
          details: error,
        };
      }
      
      // Check if it's a network error
      if (error.message?.includes("Network") || error.message?.includes("fetch")) {
        return {
          success: false,
          message: "Cannot connect to Supabase. Please check:\n1. Your internet connection\n2. Supabase project is active\n3. Supabase URL and API key are correct",
          details: error,
        };
      }
      
      return {
        success: false,
        message: `Supabase connection issue: ${error.message}`,
        details: error,
      };
    }
    
    return {
      success: true,
      message: "Supabase connection successful!",
    };
  } catch (err: any) {
    console.error("Connection test error:", err);
    return {
      success: false,
      message: `Connection failed: ${err.message || "Unknown error"}. Please verify your Supabase configuration.`,
      details: err,
    };
  }
};


