import { supabase } from "@/utils/supabase";

export const insertUser = async (phone: string, name: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("phone", phone)
    .single();

  if (error) {
    const { data } = await supabase
      .from("users")
      .upsert({ phone, name })
      .eq("phone", phone);

    return { data, error };
  }
};

export const getUserIdByPhone = async (phone: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("phone", phone)
    .single();

  return { data, error };
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
