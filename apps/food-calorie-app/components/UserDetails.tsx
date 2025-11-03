// apps/mobile/app/(auth)/user-details.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  getUserDetailsByPhone,
  insertUserDetails,
} from "@/services/userService";
import { getCurrentUserPhone } from "@/utils/session";

export default function UserDetails() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleContinue = async () => {
    try {
      setLoading(true);
      setError("");
      const phone = getCurrentUserPhone();
      if (!phone) {
        setError("Please login first");
        return;
      }
      const result = await insertUserDetails(phone, age, weight, height, gender);
      if (result?.error) {
        setError(result.error.message || "Failed to save details");
      } else {
        router.push("/(tabs)");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = ["male", "female", "other"];

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1220" }}>
      {/* Header */}
      <LinearGradient
        colors={["#0EA5E9", "#10B981"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Tell us about you</Text>
        <Text style={styles.headerSubtitle}>
          We will personalize your daily targets and insights.
        </Text>
      </LinearGradient>

      {/* Content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          <View style={styles.card}>
            {/* Age */}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 22"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                value={age}
                onChangeText={setAge}
              />
            </View>
            {/* Weight */}
            <View style={styles.fieldRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Weight</Text>
                <TextInput
                  style={styles.input}
                  placeholder="kg"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Height</Text>
                <TextInput
                  style={styles.input}
                  placeholder="cm"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={height}
                  onChangeText={setHeight}
                />
              </View>
            </View>

            {/* Gender */}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.segmentRow}>
                {genderOptions.map((option) => {
                  const selected = gender === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setGender(option)}
                      activeOpacity={0.8}
                      style={[
                        styles.segment,
                        selected && { backgroundColor: "#10B981", borderColor: "#10B981" },
                      ]}
                    >
                      <Text style={[styles.segmentText, selected && { color: "#0B1220", fontWeight: "800" }]}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Error message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Continue */}
            <TouchableOpacity 
              onPress={handleContinue} 
              activeOpacity={0.92} 
              disabled={loading}
              style={{ borderRadius: 12, overflow: "hidden", marginTop: 8, opacity: loading ? 0.6 : 1 }}
            >
              <LinearGradient
                colors={["#22C55E", "#16A34A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryCta}
              >
                <Text style={styles.primaryCtaText}>
                  {loading ? "Saving..." : "Continue"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerNote}>
            Your data is stored securely. You can edit details later in Profile.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: "#E5E7EB",
    marginTop: 6,
    fontSize: 13,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#0F172A",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  label: {
    color: "#C7D2FE",
    marginBottom: 8,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: "#0B1220",
    borderColor: "#1F2937",
    borderWidth: 1,
    borderRadius: 12,
    color: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  segmentRow: {
    flexDirection: "row",
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
    marginRight: 10,
    backgroundColor: "#0B1220",
  },
  segmentText: {
    color: "#E5E7EB",
    fontWeight: "700",
  },
  primaryCta: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
  },
  primaryCtaText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  footerNote: {
    color: "#9CA3AF",
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
  },
});
