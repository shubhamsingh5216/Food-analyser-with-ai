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
  insertUser,
} from "@/services/userService";
import { setCurrentUserPhone } from "@/utils/session";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function UserDetails() {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = currentTheme === 'dark';
  const isReading = currentTheme === 'reading';
  const bgColor = isDark 
    ? "#0B1220" 
    : isReading 
    ? "#FAF8F3"
    : "#FFFFFF";
  const cardBgColor = isDark 
    ? "#0F172A" 
    : isReading 
    ? "#F7F3E9"
    : "#F8F9FA";
  const cardBorderColor = isDark 
    ? "rgba(255,255,255,0.08)" 
    : isReading 
    ? "rgba(139,115,85,0.2)"
    : "rgba(0,0,0,0.1)";
  const labelColor = isDark 
    ? "#C7D2FE" 
    : isReading 
    ? "#5D4037"
    : "#1e1e1e";
  const inputBgColor = isDark 
    ? "#0B1220" 
    : isReading 
    ? "#FFF8DC"
    : "#FFFFFF";
  const inputBorderColor = isDark 
    ? "#1F2937" 
    : isReading 
    ? "#D7CCC8"
    : "#D1D5DB";
  const inputTextColor = isDark 
    ? "#FFFFFF" 
    : isReading 
    ? "#5D4037"
    : "#1e1e1e";
  const segmentBgColor = isDark 
    ? "#0B1220" 
    : isReading 
    ? "#FFF8DC"
    : "#FFFFFF";
  const segmentBorderColor = isDark 
    ? "#374151" 
    : isReading 
    ? "#D7CCC8"
    : "#D1D5DB";
  const segmentTextColor = isDark 
    ? "#E5E7EB" 
    : isReading 
    ? "#5D4037"
    : "#1e1e1e";
  const footerTextColor = isDark 
    ? "#9CA3AF" 
    : isReading 
    ? "#8D6E63"
    : "#666666";
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleContinue = async () => {
    // Validate all fields
    if (!phone || !name || !age || !weight || !height || !gender) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // First, create the user account
      const userResult = await insertUser(phone, name);
      if (userResult?.error) {
        setError(userResult.error.message || "Failed to create account");
        return;
      }

      // Then, save user details
      const detailsResult = await insertUserDetails(phone, age, weight, height, gender);
      if (detailsResult?.error) {
        setError(detailsResult.error.message || "Failed to save details");
        return;
      }

      // Set session to log the user in automatically
      setCurrentUserPhone(phone);

      // After successful sign-up, redirect directly to home screen
      router.push("/(tabs)");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = ["male", "female", "other"];

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      {/* Header */}
      <LinearGradient
        colors={["#0EA5E9", "#10B981"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Sign Up</Text>
        <Text style={styles.headerSubtitle}>
          Create your account to get started
        </Text>
      </LinearGradient>

      {/* Content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          <View style={[styles.card, { backgroundColor: cardBgColor, borderColor: cardBorderColor }]}>
            {/* Phone */}
            <View style={styles.fieldBlock}>
              <Text style={[styles.label, { color: labelColor }]}>Phone Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBgColor, borderColor: inputBorderColor, color: inputTextColor }]}
                placeholder="Enter your phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* Name */}
            <View style={styles.fieldBlock}>
              <Text style={[styles.label, { color: labelColor }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBgColor, borderColor: inputBorderColor, color: inputTextColor }]}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Age */}
            <View style={styles.fieldBlock}>
              <Text style={[styles.label, { color: labelColor }]}>{t('userDetails.age')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBgColor, borderColor: inputBorderColor, color: inputTextColor }]}
                placeholder={t('userDetails.agePlaceholder')}
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                value={age}
                onChangeText={setAge}
              />
            </View>
            {/* Weight */}
            <View style={styles.fieldRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={[styles.label, { color: labelColor }]}>{t('userDetails.weight')}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBgColor, borderColor: inputBorderColor, color: inputTextColor }]}
                  placeholder={t('userDetails.weightPlaceholder')}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={[styles.label, { color: labelColor }]}>{t('userDetails.height')}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBgColor, borderColor: inputBorderColor, color: inputTextColor }]}
                  placeholder={t('userDetails.heightPlaceholder')}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={height}
                  onChangeText={setHeight}
                />
              </View>
            </View>

            {/* Gender */}
            <View style={styles.fieldBlock}>
              <Text style={[styles.label, { color: labelColor }]}>{t('userDetails.gender')}</Text>
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
                        { backgroundColor: selected ? "#10B981" : segmentBgColor, borderColor: selected ? "#10B981" : segmentBorderColor },
                      ]}
                    >
                      <Text style={[styles.segmentText, { color: selected ? "#0B1220" : segmentTextColor }, selected && { fontWeight: "800" }]}>
                        {t(`userDetails.genderOptions.${option}`)}
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
              disabled={loading || !phone || !name || !age || !weight || !height || !gender}
              style={{ borderRadius: 12, overflow: "hidden", marginTop: 8, opacity: (loading || !phone || !name || !age || !weight || !height || !gender) ? 0.6 : 1 }}
            >
              <LinearGradient
                colors={["#22C55E", "#16A34A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryCta}
              >
                <Text style={styles.primaryCtaText}>
                  {loading ? "Creating Account..." : "Sign Up"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.loginPromptContainer}>
            <Text style={[styles.loginPromptText, { color: footerTextColor }]}>
              Already have an account?{" "}
              <Text
                style={[styles.loginLink, { color: isDark ? "#10B981" : isReading ? "#8B7355" : "#22C55E" }]}
                onPress={() => router.push("/(auth)/login")}
              >
                Login
              </Text>
            </Text>
          </View>
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
  loginPromptContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  loginPromptText: {
    fontSize: 14,
    textAlign: "center",
  },
  loginLink: {
    fontWeight: "700",
    textDecorationLine: "underline",
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
