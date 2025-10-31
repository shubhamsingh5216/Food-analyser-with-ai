import axios from "axios";
import { NutritionInfo } from "../types";
import { CONFIG } from "@/constants/Index";
import { supabase } from "@/utils/supabase";
import { getUserIdByPhone } from "./userService";

export class NutritionService {
  static async fetchNutritionInfo(foodItem: string): Promise<NutritionInfo | null> {
    try {
      const response = await axios.post(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${CONFIG.NUTRITION_API.API_KEY}`,
        {
          query: foodItem,
          pageSize: 1,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      return this.parseResponse(response.data);
    } catch (error) {
      console.error("Error fetching nutrition info:", error);
      return null;
    }
  }

  // No special formatting needed for USDA API, but keeping this in case you want to adapt queries later
  private static formatQuery(foodItem: string): string {
    return foodItem;
  }

  private static parseResponse(data: any): NutritionInfo | null {
    if (data?.foods?.[0]) {
      const food = data.foods[0];
      // Nutrient number mapping from USDA:
      // 208: Calories, 203: Protein, 204: Total Fat, 205: Carbs, 269: Sugars, 207: Ash, 208: Energy, 291: Fiber, 301: Calcium, 307: Sodium, 601: Cholesterol, 605: Trans Fat, 606: Sat. Fat, 607: MUFA, 608: PUFA, 309: Zinc, 318: Vit A IU, 320: Vit A RAE, 324: Vit D, 401: Vit C, 404: Thiamin, 405: Riboflavin, 601: Cholesterol, 646: Fatty acids, 672: Linoleic acid
      const getNutrient = (nutrientNumber: number) => {
        return (
          food.foodNutrients?.find((n: any) => n.nutrientNumber == nutrientNumber.toString())?.value || 0
        );
      };
      return {
        foodItem: food.description,
        calories: getNutrient(208),
        totalFat: getNutrient(204),
        saturatedFat: getNutrient(606),
        cholesterol: getNutrient(601),
        sodium: getNutrient(307),
        totalCarbohydrate: getNutrient(205),
        dietaryFiber: getNutrient(291),
        sugars: getNutrient(269),
        protein: getNutrient(203),
        potassium: getNutrient(306),
        phosphorus: getNutrient(305),
        servingQty: 1,
        servingUnit: food.servingSizeUnit || "g",
        servingWeightGrams: food.servingSize || 100,
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
