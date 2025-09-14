import { GENERIC_FOOD_TERMS } from "@/constants/Index";
import { VisionResponse } from "@/types";

export class FoodDetectionUtils {
  static isValidFoodItem(label: string): boolean {
    const lowerLabel = label.toLowerCase();
    if (GENERIC_FOOD_TERMS.has(lowerLabel)) {
      return false;
    }
    return label.length >= 3;
  }

  static extractFoodLabels(
    visionResponse: VisionResponse
  ): Array<{ description: string; score: number }> {
    const labels = [
      ...(visionResponse?.labelAnnotations || []),
      ...(visionResponse?.localizedObjectAnnotations || []).map((obj) => ({
        description: obj.name,
        score: obj.score,
      })),
    ];

    return labels
      .filter((label) => this.isValidFoodItem(label.description))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }
}
