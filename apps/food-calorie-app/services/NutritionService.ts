import axios from "axios";
import { NutritionInfo } from "../types";
import { CONFIG } from "@/constants/Index";
import { supabase } from "@/utils/supabase";
import { getUserIdByPhone } from "./userService";

export class NutritionService {
  static async fetchNutritionInfo(foodItem: string): Promise<NutritionInfo | null> {
    try {
      // EDAMAM API Implementation
      const EDAMAM_APP_ID = CONFIG.NUTRITION_API.APP_ID;
      const EDAMAM_APP_KEY = CONFIG.NUTRITION_API.APP_KEY;
      const EDAMAM_API_URL = "https://api.edamam.com/api/food-database/v2/parser";

      const response = await axios.get(EDAMAM_API_URL, {
        params: {
          ingr: foodItem,
          app_id: EDAMAM_APP_ID,
          app_key: EDAMAM_APP_KEY,
        },
      });

      return this.parseEdamamResponse(response.data, foodItem);
    } catch (error) {
      console.error("Error fetching nutrition info from EDAMAM:", error);
      return null;
    }
  }

  private static parseEdamamResponse(data: any, originalFoodItem: string): NutritionInfo | null {
    if (data?.hints?.[0]?.food) {
      const food = data.hints[0].food;
      const nutrients = food.nutrients || {};
      
      // EDAMAM returns nutrients per 100g
      return {
        foodItem: food.label || originalFoodItem,
        calories: nutrients.ENERC_KCAL || 0,
        totalFat: nutrients.FAT || 0,
        saturatedFat: nutrients.FASAT || 0,
        cholesterol: nutrients.CHOLE || 0,
        sodium: (nutrients.NA || 0) * 1000, // Convert from g to mg
        totalCarbohydrate: nutrients.CHOCDF || 0,
        dietaryFiber: nutrients.FIBTG || 0,
        sugars: nutrients.SUGAR || 0,
        protein: nutrients.PROCNT || 0,
        potassium: (nutrients.K || 0) * 1000, // Convert from g to mg
        phosphorus: nutrients.P || 0,
        servingQty: 1,
        servingUnit: "g",
        servingWeightGrams: 100, // EDAMAM provides per 100g
        confidence: data.hints[0].measures?.[0]?.weight ? 1.0 : 0.8,
      };
    }
    return null;
  }

  // Commented out USDA API implementation
  /*
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
      return this.parseUSDAResponse(response.data);
    } catch (error) {
      console.error("Error fetching nutrition info:", error);
      return null;
    }
  }

  // No special formatting needed for USDA API, but keeping this in case you want to adapt queries later
  private static formatQuery(foodItem: string): string {
    return foodItem;
  }

  private static parseUSDAResponse(data: any): NutritionInfo | null {
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
  */
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
  try {
    console.log("Adding food:", { phone, food_name, weight, calorie, mealType });
    
    // Step 1: Get or create meal
    const mealResult = await addMeal(phone, mealType);
    
    if (mealResult.error) {
      console.error("Error creating meal:", mealResult.error);
      return { data: null, error: mealResult.error };
    }
    
    if (!mealResult.data?.id) {
      console.error("Meal ID is missing:", mealResult);
      return { 
        data: null, 
        error: { message: "Failed to get meal ID", details: mealResult } 
      };
    }
    
    console.log("Meal created/retrieved with ID:", mealResult.data.id);
    
    // Step 2: Add food to the meal
    const { data, error } = await supabase.from("food").insert({
      meal_id: mealResult.data.id,
      food_name,
      weight,
      calorie,
      protein,
      carbs,
      fats,
      fiber,
      sugars,
      sodium,
    }).select();
    
    if (error) {
      console.error("Error inserting food:", error);
      return { data: null, error };
    }
    
    console.log("Food added successfully:", data);
    return { data, error: null };
  } catch (err: any) {
    console.error("Unexpected error in addFoodIntoFoods:", err);
    return { 
      data: null, 
      error: { message: err.message || "Unexpected error", details: err } 
    };
  }
};

export const addMeal = async (phone: string, mealType: string) => {
  try {
    console.log("Adding meal:", { phone, mealType });
    
    // Step 1: Get user ID
    const userId = await getUserIdByPhone(phone);
    
    if (userId.error) {
      console.error("Error getting user ID:", userId.error);
      const errorMsg = userId.error.message || JSON.stringify(userId.error);
      
      // If it's a network error, provide helpful message
      if (errorMsg.includes("Network") || errorMsg.includes("fetch") || errorMsg.includes("Failed")) {
        return { 
          data: null, 
          error: { 
            message: `Network error: Unable to connect to database. Please check your internet connection and Supabase configuration.`,
            originalError: userId.error
          } 
        };
      }
      
      return { data: null, error: userId.error };
    }
    
    if (!userId.data?.id) {
      console.error("User ID is missing. User may not exist for phone:", phone);
      return { 
        data: null, 
        error: { 
          message: `User not found for phone: ${phone}. Please login first.`,
          suggestion: "Make sure you've logged in with this phone number."
        } 
      };
    }
    
    console.log("User ID found:", userId.data.id);
    
    // Step 2: Check if meal already exists today
    const today = new Date().toISOString().split("T")[0];
    const { data: existingMeal } = await supabase
      .from("meals")
      .select("id")
      .eq("user_id", userId.data.id)
      .eq("name", mealType)
      .gte("created_at", `${today}T00:00:00.000Z`)
      .lt("created_at", `${today}T23:59:59.999Z`)
      .single();
    
    if (existingMeal) {
      console.log("Existing meal found:", existingMeal.id);
      return { data: existingMeal, error: null };
    }
    
    // Step 3: Create new meal
    const { data, error } = await supabase
      .from("meals")
      .insert({
        name: mealType,
        user_id: userId.data.id,
      })
      .select("id")
      .single();
    
    if (error) {
      console.error("Error inserting meal:", error);
      return { data: null, error };
    }
    
    console.log("New meal created with ID:", data.id);
    return { data, error: null };
  } catch (err: any) {
    console.error("Unexpected error in addMeal:", err);
    return { 
      data: null, 
      error: { message: err.message || "Unexpected error", details: err } 
    };
  }
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
