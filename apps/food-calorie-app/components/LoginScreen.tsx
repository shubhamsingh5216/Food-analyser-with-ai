import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { insertUser } from "@/services/userService";

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !name) return;
    try {
      setLoading(true);
      await insertUser(phone, name);
      router.push("/(tabs)");
    } finally {
      setLoading(false);
    }
  };

  const disabled = !phone || !name || loading;

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1220" }}>
      <LinearGradient
        colors={["#0EA5E9", "#10B981"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Welcome back</Text>
        <Text style={styles.headerSubtitle}>Login to continue tracking</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.card}>
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.92}
            onPress={handleLogin}
            disabled={disabled}
            style={{ borderRadius: 12, overflow: "hidden", opacity: disabled ? 0.6 : 1, marginTop: 8 }}
          >
            <LinearGradient
              colors={["#22C55E", "#16A34A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryCta}
            >
              <Text style={styles.primaryCtaText}>{loading ? "Signing in..." : "Login"}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.helper}>We’ll create your account if it doesn’t exist.</Text>
        </View>
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
  card: {
    marginTop: 16,
    marginHorizontal: 20,
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
  helper: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
  },
});
