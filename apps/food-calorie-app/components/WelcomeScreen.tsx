import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/splash-icon.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Dark overlay */}
      <LinearGradient
        colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0.85)"]}
        style={{ flex: 1 }}
      >
        <StatusBar style="light" />

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
                backgroundColor: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.18)",
                borderWidth: 1,
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 999,
                marginBottom: 16,
              }}
            >
              <Text style={{ color: "#9FE870", fontWeight: "600", fontSize: 12 }}>
                AI-Powered Nutrition
              </Text>
            </View>

            <Text
              style={{
                fontSize: 40,
                lineHeight: 48,
                fontWeight: "800",
                color: "#ffffff",
              }}
            >
              NutriTrack
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                lineHeight: 22,
                color: "#D1D5DB",
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
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.18)",
                    borderWidth: 1,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 999,
                    marginRight: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: "#E5E7EB", fontSize: 12, fontWeight: "600" }}>
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
                borderColor: "rgba(255,255,255,0.22)",
                backgroundColor: "rgba(255,255,255,0.06)",
                marginTop: 14,
              }}
              onPress={() => router.push("/(auth)/login")}
              activeOpacity={0.8}
            >
              <Text style={{ color: "#D1FAE5", fontSize: 18, fontWeight: "800" }}>
                Login
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                color: "#9CA3AF",
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
