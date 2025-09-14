// screens/HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function HomeScreen({ route }) {
  const { calorieNeeds } = route.params || { calorieNeeds: 2000 }; // Default

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Daily Needs</Text>
      <View style={styles.card}>
        <Text>Calories: {Math.round(calorieNeeds)} kcal</Text>
        <Text>Protein: {Math.round(calorieNeeds * 0.15)} g</Text>
        <Text>Minerals: Sufficient daily intake</Text>
        <Text>Vitamins: Sufficient daily intake</Text>
      </View>

      <Text style={styles.title}>Meals</Text>
      <View style={styles.mealContainer}>
        <View style={styles.mealCard}>
          <Text>Breakfast</Text>
        </View>
        <View style={styles.mealCard}>
          <Text>Lunch</Text>
        </View>
        <View style={styles.mealCard}>
          <Text>Dinner</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  card: {
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    marginVertical: 10,
  },
  mealContainer: { flexDirection: "row", justifyContent: "space-between" },
  mealCard: {
    width: "30%",
    padding: 10,
    backgroundColor: "#e9ecef",
    borderRadius: 10,
  },
});
