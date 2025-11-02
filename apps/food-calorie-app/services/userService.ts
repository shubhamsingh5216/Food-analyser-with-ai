import { supabase } from "@/utils/supabase";

export const insertUser = async (phone: string, name: string) => {
  try {
    console.log("Inserting/updating user:", { phone, name });
    
    // Try to find existing user first
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("id")
      .eq("phone", phone)
      .single();

    // If user exists, return it
    if (existingUser && !findError) {
      console.log("User already exists:", existingUser.id);
      return { data: existingUser, error: null };
    }

    // If user doesn't exist, create it
    console.log("Creating new user...");
    const { data, error } = await supabase
      .from("users")
      .insert({ phone, name })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating user:", error);
      // If insert fails due to duplicate, try to get the existing user
      if (error.code === "23505" || error.message?.includes("duplicate")) {
        const { data: existing } = await supabase
          .from("users")
          .select("id")
          .eq("phone", phone)
          .single();
        if (existing) {
          return { data: existing, error: null };
        }
      }
      return { data: null, error };
    }

    console.log("User created successfully:", data?.id);
    return { data, error: null };
  } catch (err: any) {
    console.error("Unexpected error in insertUser:", err);
    return { 
      data: null, 
      error: { message: err.message || "Network error. Please check your internet connection." } 
    };
  }
};

export const getUserIdByPhone = async (phone: string) => {
  try {
    console.log("Getting user ID for phone:", phone);
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("phone", phone)
      .single();

    if (error) {
      console.error("Error getting user ID:", error);
      // If user not found, return a helpful error
      if (error.code === "PGRST116" || error.message?.includes("No rows")) {
        return { 
          data: null, 
          error: { message: `User not found. Please login first with phone: ${phone}` } 
        };
      }
    } else {
      console.log("User ID retrieved:", data?.id);
    }

    return { data, error };
  } catch (err: any) {
    console.error("Unexpected error in getUserIdByPhone:", err);
    return { 
      data: null, 
      error: { 
        message: err.message || "Network error. Please check your internet connection.",
        details: err
      } 
    };
  }
};

export const insertUserDetails = async (
  phone: string,
  age: string,
  weight: string,
  height: string,
  gender: string
) => {
  const userId = await getUserIdByPhone(phone);
  console.log("userId", userId);
  const { data, error } = await supabase
    .from("user_details")
    .select("id")
    .eq("user_id", userId.data?.id)
    .single();

  if (error) {
    const { data } = await supabase
      .from("user_details")
      .upsert({ user_id: userId.data?.id, age, weight, height, gender });

    return { data };
  }
};

export const getUserDetailsByPhone = async (phone: string) => {
  const userId = await getUserIdByPhone(phone);
  const { data, error } = await supabase
    .from("user_details")
    .select("*")
    .eq("user_id", userId.data?.id)
    .single();

  return { data };
};
