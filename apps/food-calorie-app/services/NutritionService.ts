import axios from "axios";
import { NutritionInfo } from "../types";
import { CONFIG } from "@/constants/Index";
import { supabase } from "@/utils/supabase";
import { getUserIdByPhone } from "./userService";

export class NutritionService {
  static async fetchNutritionInfo(
    foodItem: string
  ): Promise<NutritionInfo | null> {
    try {
      const query = this.formatQuery(foodItem);
      const response = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        { query },
        {
          headers: {
            "Content-Type": "application/json",
            "x-app-id": CONFIG.NUTRITION_API.APP_ID,
            "x-app-key": CONFIG.NUTRITION_API.API_KEY,
          },
        }
      );
      return this.parseResponse(response.data);
    } catch (error) {
      console.error("Error fetching nutrition info:", error);
      return null;
    }
  }

  private static formatQuery(foodItem: string): string {
    return foodItem.includes(" piece") || foodItem.includes(" serving")
      ? foodItem
      : `1 serving ${foodItem}`;
  }

  private static parseResponse(data: any): NutritionInfo | null {
    if (data?.foods?.[0]) {
      const food = data.foods[0];
      return {
        foodItem: food.food_name,
        calories: food.nf_calories,
        totalFat: food.nf_total_fat,
        saturatedFat: food.nf_saturated_fat,
        cholesterol: food.nf_cholesterol,
        sodium: food.nf_sodium,
        totalCarbohydrate: food.nf_total_carbohydrate,
        dietaryFiber: food.nf_dietary_fiber,
        sugars: food.nf_sugars,
        protein: food.nf_protein,
        potassium: food.nf_potassium,
        phosphorus: food.nf_p,
        servingQty: food.serving_qty,
        servingUnit: food.serving_unit,
        servingWeightGrams: food.serving_weight_grams,
        confidence: 1.0,
      };
    }
    return null;
  }
}

export const addFoodIntoFoods = async (
  phone: string,
  food_name: string,
  weight: number,
  calorie: number,
  protein: number,
  carbs: number,
  fats: number,
  fiber: number,
  sugars: number,
  sodium: number,
  mealType: string
) => {
  const mealId = await addMeal(phone, mealType);
  const { data, error } = await supabase.from("food").upsert({
    meal_id: mealId.data?.id,
    food_name,
    weight,
    calorie,
    protein,
    carbs,
    fats,
    fiber,
    sugars,
    sodium,
  });
  return { data, error };
};

export const addMeal = async (phone: string, mealType: string) => {
  const userId = await getUserIdByPhone(phone);
  const { data, error } = await supabase
    .from("meals")
    .upsert({
      name: mealType,
      user_id: userId.data?.id,
    })
    .select("id")
    .single();
  return { data, error };
};

export const getMealsIdByUserIdForToday = async (phone: string) => {
  const userId = await getUserIdByPhone(phone);
  console.log("userId", JSON.stringify(userId.data?.id));

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const { data, error } = await supabase
    .from("meals")
    .select("id")
    .eq("user_id", userId.data?.id)
    .filter("created_at", "gte", `${today}T00:00:00.000Z`) // Start of today
    .filter("created_at", "lt", `${today}T23:59:59.999Z`); // End of today

  if (error) {
    console.error("Error fetching meal IDs:", error.message);
  } else {
    console.log("Meal IDs for today:", JSON.stringify(data));
  }

  return { data, error };
};

export const fetchFoodByUserIdForToday = async (phone: string) => {
  const { data: mealIds, error: mealError } =
    await getMealsIdByUserIdForToday(phone);
  if (mealError) {
    console.error("Error fetching meal IDs:", mealError.message);
    return { data: null, error: mealError };
  }

  if (!mealIds || mealIds.length === 0) {
    console.log("No meals found for today.");
    return { data: [], error: null };
  }

  // Extract IDs from the result
  const mealIdArray = mealIds.map((meal) => meal.id);
  console.log("mealIdArray", JSON.stringify(mealIdArray));

  // Fetch all food entries for the given meal IDs
  const { data, error } = await supabase
    .from("food")
    .select("*")
    .in("meal_id", mealIdArray); // Use `in` to match multiple meal IDs

  if (error) {
    console.error("Error fetching food data:", error.message);
  } else {
    console.log("Food data for today:", JSON.stringify(data));
  }

  return { data, error };
};

export const getMealTypeByMealIdForToday = async (mealId: string) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const { data, error } = await supabase
    .from("meals")
    .select("name")
    .eq("id", mealId)
    .filter("created_at", "gte", `${today}T00:00:00.000Z`) // Start of today
    .filter("created_at", "lt", `${today}T23:59:59.999Z`); // End of today

  if (error) {
    console.error("Error fetching meal IDs:", error.message);
  } else {
    console.log("Meal Type for today:", JSON.stringify(data));
  }

  return data;
};
