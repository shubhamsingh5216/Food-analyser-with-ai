import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function WelcomeScreen() {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Theme-aware overlay - much lighter in light mode
  const overlayColors: [string, string] = isDark 
    ? ["rgba(0,0,0,0.55)", "rgba(0,0,0,0.85)"] 
    : ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.5)"];
  
  // Theme-aware colors
  const textColor = isDark ? "#ffffff" : "#1e1e1e";
  const subtitleColor = isDark ? "#D1D5DB" : "#4B5563";
  const chipBgColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)";
  const chipBorderColor = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.1)";
  const chipTextColor = isDark ? "#E5E7EB" : "#1e1e1e";
  const badgeTextColor = isDark ? "#9FE870" : "#22C55E";
  const badgeBgColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(34,197,94,0.15)";
  const badgeBorderColor = isDark ? "rgba(255,255,255,0.18)" : "rgba(34,197,94,0.3)";
  const buttonBorderColor = isDark ? "rgba(255,255,255,0.22)" : "rgba(22,163,74,0.3)";
  const buttonBgColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(34,197,94,0.1)";
  const buttonTextColor = isDark ? "#D1FAE5" : "#16A34A";
  const footerTextColor = isDark ? "#9CA3AF" : "#6B7280";

  return (
    <ImageBackground
      source={require("../assets/images/splash-icon.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Overlay */}
      <LinearGradient
        colors={overlayColors}
        style={{ flex: 1 }}
      >
        <StatusBar style={isDark ? "light" : "dark"} />

        {/* Content */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 72,
            paddingBottom: 36,
            justifyContent: "space-between",
          }}
        >
          {/* Hero */}
          <View>
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: badgeBgColor,
                borderColor: badgeBorderColor,
                borderWidth: 1,
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 999,
                marginBottom: 16,
              }}
            >
              <Text style={{ color: badgeTextColor, fontWeight: "600", fontSize: 12 }}>
                AI-Powered Nutrition
              </Text>
            </View>

            <Text
              style={{
                fontSize: 40,
                lineHeight: 48,
                fontWeight: "800",
                color: textColor,
              }}
            >
              NutriTrack
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                lineHeight: 22,
                color: subtitleColor,
              }}
            >
              Fuel your body smarter. Snap your meal, get instant calories and
              macros.
            </Text>

            {/* Feature chips */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 20 }}>
              {[
                "Camera Vision",
                "USDA Verified",
                "Macro Tracking",
                "Meal History",
              ].map((chip) => (
                <View
                  key={chip}
                  style={{
                    backgroundColor: chipBgColor,
                    borderColor: chipBorderColor,
                    borderWidth: 1,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 999,
                    marginRight: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: chipTextColor, fontSize: 12, fontWeight: "600" }}>
                    {chip}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* CTA Buttons */}
          <View style={{ width: "100%", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                width: "100%",
                borderRadius: 14,
                overflow: "hidden",
                shadowColor: "#000",
                shadowOpacity: 0.25,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 8 },
                elevation: 6,
              }}
              onPress={() => router.push("/(auth)/user-details")}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#22C55E", "#16A34A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ paddingVertical: 16, alignItems: "center" }}
              >
                <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "800" }}>
                  Get Started
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "100%",
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: "center",
                borderWidth: 1,
                borderColor: buttonBorderColor,
                backgroundColor: buttonBgColor,
                marginTop: 14,
              }}
              onPress={() => router.push("/(auth)/login")}
              activeOpacity={0.8}
            >
              <Text style={{ color: buttonTextColor, fontSize: 18, fontWeight: "800" }}>
                Login
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                color: footerTextColor,
                marginTop: 16,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              By continuing, you agree to our Terms and Privacy Policy.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}
