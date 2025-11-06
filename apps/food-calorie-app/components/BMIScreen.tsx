import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";

export default function BMIScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const [bmiColor, setBmiColor] = useState<string>("#4ECDC4");

  // Theme colors
  const gradientColors: [string, string] = isDark ? ["#434343", "#000000"] : ["#F8F9FA", "#E9ECEF"];
  const headerBgColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";
  const textColor = isDark ? "white" : "#1e1e1e";
  const iconColor = isDark ? "white" : "#1e1e1e";
  const cardBgColor = isDark ? "white" : "white";
  const cardTitleColor = isDark ? "#1e1e1e" : "#1e1e1e";
  const cardSubtitleColor = isDark ? "#666" : "#666";
  const inputLabelColor = isDark ? "#666" : "#666";
  const inputBgColor = isDark ? "#F3F4F6" : "#F3F4F6";
  const inputBorderColor = isDark ? "#D1D5DB" : "#D1D5DB";
  const inputTextColor = isDark ? "#1e1e1e" : "#1e1e1e";
  const resultCardBgColor = isDark ? "white" : "white";
  const resultCardBorderColor = isDark ? "#22C55E" : "#22C55E";
  const resultTitleColor = isDark ? "#1e1e1e" : "#1e1e1e";
  const bmiUnitColor = isDark ? "#666" : "#666";
  const scaleTitleColor = isDark ? "#1e1e1e" : "#1e1e1e";
  const scaleTextColor = isDark ? "#666" : "#666";
  const resetButtonBgColor = isDark ? "#F3F4F6" : "#F3F4F6";
  const resetButtonBorderColor = isDark ? "#D1D5DB" : "#D1D5DB";
  const resetButtonTextColor = isDark ? "#666" : "#666";
  const infoCardBgColor = isDark ? "white" : "white";
  const infoTitleColor = isDark ? "#1e1e1e" : "#1e1e1e";
  const infoTextColor = isDark ? "#666" : "#666";

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    // Validate inputs
    if (!weight || !height) {
      Alert.alert("Error", "Please enter both weight and height");
      return;
    }

    if (weightNum <= 0 || heightNum <= 0) {
      Alert.alert("Error", "Weight and height must be greater than 0");
      return;
    }

    if (heightNum > 300) {
      Alert.alert("Error", "Height in cm should not exceed 300 cm");
      return;
    }

    if (weightNum > 500) {
      Alert.alert("Error", "Weight in kg should not exceed 500 kg");
      return;
    }

    // Convert height from cm to meters
    const heightInMeters = heightNum / 100;

    // Calculate BMI: weight (kg) / height (m)^2
    const calculatedBmi = weightNum / (heightInMeters * heightInMeters);
    setBmi(parseFloat(calculatedBmi.toFixed(1)));

    // Determine BMI category
    let category = "";
    let color = "";

    if (calculatedBmi < 18.5) {
      category = "Underweight";
      color = "#3B82F6"; // Blue
    } else if (calculatedBmi < 25) {
      category = "Normal Weight";
      color = "#22C55E"; // Green
    } else if (calculatedBmi < 30) {
      category = "Overweight";
      color = "#F59E0B"; // Orange
    } else {
      category = "Obese";
      color = "#EF4444"; // Red
    }

    setBmiCategory(category);
    setBmiColor(color);
  };

  const resetCalculator = () => {
    setWeight("");
    setHeight("");
    setBmi(null);
    setBmiCategory("");
    setBmiColor("#4ECDC4");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={[styles.header, { backgroundColor: headerBgColor }]}>
          <Text style={[styles.headerTitle, { color: textColor }]}>BMI Calculator</Text>
          <MaterialCommunityIcons name="human-handsup" size={32} color={iconColor} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.card, { backgroundColor: cardBgColor }]}>
              <Text style={[styles.cardTitle, { color: cardTitleColor }]}>Enter Your Details</Text>
              <Text style={[styles.cardSubtitle, { color: cardSubtitleColor }]}>
                Calculate your Body Mass Index (BMI)
              </Text>

              {/* Weight Input */}
              <View style={styles.inputRow}>
                <View style={styles.inputLabelContainer}>
                  <MaterialCommunityIcons
                    name="weight-kilogram"
                    size={20}
                    color={inputLabelColor}
                  />
                  <Text style={[styles.inputLabel, { color: inputLabelColor }]}>Weight (kg)</Text>
                </View>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBgColor, borderColor: inputBorderColor, color: inputTextColor }]}
                  placeholder="e.g. 70"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>

              {/* Height Input */}
              <View style={styles.inputRow}>
                <View style={styles.inputLabelContainer}>
                  <MaterialCommunityIcons
                    name="human-male-height"
                    size={20}
                    color={inputLabelColor}
                  />
                  <Text style={[styles.inputLabel, { color: inputLabelColor }]}>Height (cm)</Text>
                </View>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBgColor, borderColor: inputBorderColor, color: inputTextColor }]}
                  placeholder="e.g. 175"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={height}
                  onChangeText={setHeight}
                />
              </View>

              {/* Calculate Button */}
              <TouchableOpacity
                onPress={calculateBMI}
                style={styles.calculateButton}
                disabled={!weight || !height}
              >
                <LinearGradient
                  colors={["#22C55E", "#16A34A"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.calculateButtonGradient}
                >
                  <MaterialCommunityIcons name="calculator" size={24} color="white" />
                  <Text style={styles.calculateButtonText}>Calculate BMI</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* BMI Result Card */}
            {bmi !== null && (
              <View style={[styles.resultCard, { backgroundColor: resultCardBgColor, borderColor: resultCardBorderColor }]}>
                <Text style={[styles.resultTitle, { color: resultTitleColor }]}>Your BMI Result</Text>
                <View style={styles.bmiDisplay}>
                  <Text style={[styles.bmiValue, { color: bmiColor }]}>
                    {bmi}
                  </Text>
                  <Text style={[styles.bmiUnit, { color: bmiUnitColor }]}>kg/m²</Text>
                </View>
                <View style={[styles.categoryBadge, { backgroundColor: `${bmiColor}20` }]}>
                  <Text style={[styles.categoryText, { color: bmiColor }]}>
                    {bmiCategory}
                  </Text>
                </View>

                {/* BMI Scale Info */}
                <View style={styles.scaleContainer}>
                  <Text style={[styles.scaleTitle, { color: scaleTitleColor }]}>BMI Scale</Text>
                  <View style={styles.scaleItem}>
                    <View style={[styles.scaleIndicator, { backgroundColor: "#3B82F6" }]} />
                    <Text style={[styles.scaleText, { color: scaleTextColor }]}>
                      Underweight: &lt; 18.5
                    </Text>
                  </View>
                  <View style={styles.scaleItem}>
                    <View style={[styles.scaleIndicator, { backgroundColor: "#22C55E" }]} />
                    <Text style={[styles.scaleText, { color: scaleTextColor }]}>
                      Normal Weight: 18.5 - 24.9
                    </Text>
                  </View>
                  <View style={styles.scaleItem}>
                    <View style={[styles.scaleIndicator, { backgroundColor: "#F59E0B" }]} />
                    <Text style={[styles.scaleText, { color: scaleTextColor }]}>
                      Overweight: 25 - 29.9
                    </Text>
                  </View>
                  <View style={styles.scaleItem}>
                    <View style={[styles.scaleIndicator, { backgroundColor: "#EF4444" }]} />
                    <Text style={[styles.scaleText, { color: scaleTextColor }]}>Obese: ≥ 30</Text>
                  </View>
                </View>

                {/* Reset Button */}
                <TouchableOpacity
                  onPress={resetCalculator}
                  style={[styles.resetButton, { backgroundColor: resetButtonBgColor, borderColor: resetButtonBorderColor }]}
                >
                  <Text style={[styles.resetButtonText, { color: resetButtonTextColor }]}>Calculate Again</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Info Card */}
            <View style={[styles.infoCard, { backgroundColor: infoCardBgColor }]}>
              <MaterialCommunityIcons
                name="information"
                size={24}
                color="#3B82F6"
              />
              <View style={styles.infoContent}>
                <Text style={[styles.infoTitle, { color: infoTitleColor }]}>About BMI</Text>
                <Text style={[styles.infoText, { color: infoTextColor }]}>
                  Body Mass Index (BMI) is a measure of body fat based on height
                  and weight. It's a useful screening tool but doesn't directly
                  measure body fat or account for muscle mass, bone density, or
                  overall body composition.
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  inputRow: {
    marginBottom: 16,
  },
  inputLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  calculateButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 8,
  },
  calculateButtonGradient: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  calculateButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 10,
  },
  resultCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  bmiDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
  },
  bmiValue: {
    fontSize: 56,
    fontWeight: "bold",
  },
  bmiUnit: {
    fontSize: 24,
    marginLeft: 8,
    fontWeight: "500",
  },
  categoryBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "700",
  },
  scaleContainer: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },
  scaleTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  scaleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  scaleIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  scaleText: {
    fontSize: 14,
  },
  resetButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
