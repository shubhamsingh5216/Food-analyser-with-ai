// screens/HomeScreen.js
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  fetchFoodByUserIdForToday,
  getMealTypeByMealIdForToday,
} from "@/services/NutritionService";
import { getCurrentUserPhone } from "@/utils/session";
import { GroupedMeal, Meal } from "@/types";

export default function HomeScreen({ route }) {
  const { calorieNeeds } = route.params || { calorieNeeds: 2000 }; // Default
  const [foodData, setFoodData] = useState<Meal[]>([]);
  const [mealHistory, setMealHistory] = useState<GroupedMeal[]>([]);
  const [loading, setLoading] = useState(true);

  const getMealTime = async (mealId: string): Promise<string> => {
    try {
      const mealTime = await getMealTypeByMealIdForToday(mealId);
      return mealTime?.[0]?.name || "Other";
    } catch (error) {
      console.error("Error getting meal type:", error);
      return "Other";
    }
  };

  const groupMealsByTime = async (): Promise<GroupedMeal[]> => {
    try {
      const tempMeals: Record<string, GroupedMeal> = {};
      await Promise.all(
        foodData.map(async (item: Meal) => {
          const mealTime = await getMealTime(item.meal_id);

          if (!tempMeals[mealTime]) {
            tempMeals[mealTime] = {
              time: mealTime,
              calories: 0,
              items: [],
            };
          }

          tempMeals[mealTime].calories += parseFloat(item.calorie);
          tempMeals[mealTime].items.push(item.food_name);
        })
      );

      // Sort meals in chronological order
      const mealOrder = ["Breakfast", "Lunch", "Dinner", "Snack", "Other"];
      return Object.values(tempMeals).sort(
        (a, b) => mealOrder.indexOf(a.time) - mealOrder.indexOf(b.time)
      );
    } catch (error) {
      console.error("Error grouping meals:", error);
      return [];
    }
  };

  const fetchFoodData = useCallback(async () => {
    try {
      setLoading(true);
      const phone = getCurrentUserPhone();
      if (!phone) {
        console.log("No user phone found, skipping fetch");
        setFoodData([]);
        setMealHistory([]);
        return;
      }
      const response = await fetchFoodByUserIdForToday(phone);
      if (response?.data) {
        setFoodData(response.data);
      }
    } catch (error) {
      console.error("Error fetching food data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadMealHistory = async () => {
      if (foodData.length > 0) {
        const groupedMeals = await groupMealsByTime();
        setMealHistory(groupedMeals);
      } else {
        setMealHistory([]);
      }
    };

    loadMealHistory();
  }, [foodData]);

  useEffect(() => {
    fetchFoodData();
  }, [fetchFoodData]);

  // Calculate total calories consumed
  const totalCalories = foodData.reduce((sum, item) => {
    return sum + parseFloat(item.calorie || "0");
  }, 0);

  const totalProtein = foodData.reduce((sum, item) => {
    return sum + parseFloat(item.protein || "0");
  }, 0);

  // Get meal type configuration
  const getMealConfig = (mealType: string) => {
    const configs: Record<string, any> = {
      Breakfast: {
        icon: "food-croissant",
        gradient: ["#FFA726", "#FB8C00"],
        bgGradient: ["#FFF4E6", "#FFE8CC"],
        iconColor: "#FB8C00",
        borderColor: "#FFB74D",
      },
      Lunch: {
        icon: "food",
        gradient: ["#42A5F5", "#1E88E5"],
        bgGradient: ["#E3F2FD", "#BBDEFB"],
        iconColor: "#1E88E5",
        borderColor: "#42A5F5",
      },
      Dinner: {
        icon: "food-variant",
        gradient: ["#AB47BC", "#8E24AA"],
        bgGradient: ["#F3E5F5", "#E1BEE7"],
        iconColor: "#8E24AA",
        borderColor: "#AB47BC",
      },
      Snack: {
        icon: "cookie",
        gradient: ["#66BB6A", "#43A047"],
        bgGradient: ["#E8F5E9", "#C8E6C9"],
        iconColor: "#43A047",
        borderColor: "#66BB6A",
      },
    };
    return configs[mealType] || {
      icon: "food",
      gradient: ["#78909C", "#546E7A"],
      bgGradient: ["#ECEFF1", "#CFD8DC"],
      iconColor: "#546E7A",
      borderColor: "#78909C",
    };
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Daily Needs</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Calories: {Math.round(calorieNeeds)} kcal
        </Text>
        <Text style={styles.cardText}>
          Consumed: {Math.round(totalCalories)} kcal
        </Text>
        <Text style={styles.cardText}>
          Remaining: {Math.round(calorieNeeds - totalCalories)} kcal
        </Text>
        <View style={styles.divider} />
        <Text style={styles.cardText}>
          Protein: {Math.round(totalProtein)} g / {Math.round(calorieNeeds * 0.15)} g
        </Text>
      </View>

      <Text style={styles.title}>Today's Meals</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#666" />
          <Text style={styles.loadingText}>Loading meals...</Text>
        </View>
      ) : mealHistory.length > 0 ? (
        <View style={styles.mealContainer}>
          {mealHistory.map((meal, index) => {
            const mealConfig = getMealConfig(meal.time);
            return (
              <View key={`${meal.time}-${index}`} style={styles.mealCardContainer}>
                <LinearGradient
                  colors={mealConfig.bgGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.mealCardGradient}
                >
                  {/* Header with Icon and Title */}
                  <View style={styles.mealCardHeader}>
                    <View style={styles.mealIconContainer}>
                      <LinearGradient
                        colors={mealConfig.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.mealIconGradient}
                      >
                        <MaterialCommunityIcons
                          name={mealConfig.icon as any}
                          size={28}
                          color="white"
                        />
                      </LinearGradient>
                      <View style={styles.mealTitleContainer}>
                        <Text style={styles.mealTitle}>{meal.time}</Text>
                        <Text style={styles.mealSubtitle}>
                          {meal.items.length} {meal.items.length === 1 ? "ITEM" : "ITEMS"}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.calorieBadge, { backgroundColor: mealConfig.iconColor }]}>
                      <Text style={styles.calorieBadgeText}>
                        {Math.round(meal.calories)} kcal
                      </Text>
                    </View>
                  </View>

                  {/* Food Items */}
                  <View style={styles.mealItemsContainer}>
                    {meal.items.map((item, itemIndex) => (
                      <View key={itemIndex} style={styles.mealItemRow}>
                        <View style={[styles.mealItemDot, { backgroundColor: mealConfig.iconColor }]} />
                        <Text style={styles.mealItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No meals logged today</Text>
          <Text style={styles.emptySubtext}>
            Add meals using the camera to see them here
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginVertical: 10,
    color: "#1e1e1e",
  },
  card: {
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    marginVertical: 4,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#dee2e6",
    marginVertical: 10,
  },
  mealContainer: { 
    flexDirection: "column",
  },
  mealCardContainer: {
    width: "100%",
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  mealCardGradient: {
    padding: 20,
    borderRadius: 20,
  },
  mealCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  mealIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  mealIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mealTitleContainer: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e1e1e",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  mealSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    letterSpacing: 0.5,
  },
  calorieBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  calorieBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  mealItemsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 12,
    padding: 12,
  },
  mealItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  mealItemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  mealItemText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
    flex: 1,
    lineHeight: 22,
  },
  loadingContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
