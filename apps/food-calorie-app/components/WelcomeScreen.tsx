import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WelcomeScreen() {
  const router = useRouter();
  const { currentTheme, themeMode } = useTheme();
  const { t } = useLanguage();
  // For auto mode, always use dark theme like in the image
  const isDark = themeMode === 'auto' ? true : (currentTheme === 'dark');
  const isReading = currentTheme === 'reading';
  
  // Theme-aware overlay - much lighter in light mode, dark for auto and dark mode, sepia for reading
  const overlayColors: [string, string] = isDark 
    ? ["rgba(0,0,0,0.55)", "rgba(0,0,0,0.85)"] 
    : isReading
    ? ["rgba(247,243,233,0.4)", "rgba(250,248,243,0.6)"]
    : ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.5)"];
  
  // Theme-aware colors
  const textColor = isDark 
    ? "#ffffff" 
    : isReading 
    ? "#5D4037"
    : "#1e1e1e";
  const subtitleColor = isDark 
    ? "#D1D5DB" 
    : isReading 
    ? "#6D4C41"
    : "#4B5563";
  const chipBgColor = isDark 
    ? "rgba(255,255,255,0.08)" 
    : isReading 
    ? "rgba(255,255,255,0.7)"
    : "rgba(255,255,255,0.9)";
  const chipBorderColor = isDark 
    ? "rgba(255,255,255,0.18)" 
    : isReading 
    ? "rgba(93,64,55,0.2)"
    : "rgba(0,0,0,0.1)";
  const chipTextColor = isDark 
    ? "#E5E7EB" 
    : isReading 
    ? "#5D4037"
    : "#1e1e1e";
  // For auto mode, use the light green color like in the image (#9FE870)
  const badgeTextColor = isDark 
    ? "#9FE870" 
    : isReading 
    ? "#8B7355"
    : "#22C55E";
  const badgeBgColor = isDark 
    ? "rgba(255,255,255,0.08)" 
    : isReading 
    ? "rgba(139,115,85,0.15)"
    : "rgba(34,197,94,0.15)";
  const badgeBorderColor = isDark 
    ? "rgba(255,255,255,0.18)" 
    : isReading 
    ? "rgba(139,115,85,0.3)"
    : "rgba(34,197,94,0.3)";
  const buttonBorderColor = isDark 
    ? "rgba(255,255,255,0.22)" 
    : isReading 
    ? "rgba(139,115,85,0.3)"
    : "rgba(22,163,74,0.3)";
  const buttonBgColor = isDark 
    ? "rgba(255,255,255,0.06)" 
    : isReading 
    ? "rgba(139,115,85,0.1)"
    : "rgba(34,197,94,0.1)";
  const buttonTextColor = isDark 
    ? "#D1FAE5" 
    : isReading 
    ? "#8B7355"
    : "#16A34A";
  const footerTextColor = isDark 
    ? "#9CA3AF" 
    : isReading 
    ? "#8D6E63"
    : "#6B7280";

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
        <StatusBar style={isDark ? "light" : isReading ? "dark" : "dark"} />

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
                {t('welcome.badge')}
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
              {t('welcome.title')}
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                lineHeight: 22,
                color: subtitleColor,
              }}
            >
              {t('welcome.subtitle')}
            </Text>

            {/* Feature chips */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 20 }}>
              {[
                t('welcome.features.ai'),
                t('welcome.features.calories'),
                t('welcome.features.macros'),
                t('welcome.features.history'),
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
                  {t('welcome.getStarted')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text
              style={{
                color: footerTextColor,
                marginTop: 16,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              {t('welcome.terms')}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}
