export interface NutritionInfo {
  foodItem: string;
  calories: number;
  totalFat: number;
  saturatedFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbohydrate: number;
  dietaryFiber: number;
  sugars: number;
  protein: number;
  potassium: number;
  phosphorus: number;
  servingQty: number;
  servingUnit: string;
  servingWeightGrams: number;
  confidence: number;
}

export interface VisionResponse {
  labelAnnotations?: Array<{
    description: string;
    score: number;
  }>;
  localizedObjectAnnotations?: Array<{
    name: string;
    score: number;
  }>;
}

export interface Meal {
  id: string;
  food_name: string;
  calorie: string;
  protein: string;
  carbs: string;
  fats: string;
  weight: string;
  created_at: string;
  meal_id: string;
}

export interface NutrientItem {
  icon: string;
  title: string;
  value: string;
  unit: string;
  target: string;
  color: string;
}

export interface GroupedMeal {
  time: string;
  calories: number;
  items: string[];
}

export interface NutrientTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}
