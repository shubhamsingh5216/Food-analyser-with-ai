import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getUserDetailsByPhone } from "@/services/userService";
import { getCurrentUserPhone, clearCurrentUserPhone } from "@/utils/session";

export default function ProfileScreen() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserDetails();
  }, []);

  const loadUserDetails = async () => {
    try {
      const phone = getCurrentUserPhone();
      if (phone) {
        const details = await getUserDetailsByPhone(phone);
        setUserDetails(details?.data);
      }
    } catch (error) {
      console.error("Error loading user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearCurrentUserPhone();
    router.replace("/(auth)");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#434343", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : userDetails ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Age:</Text>
                <Text style={styles.infoValue}>{userDetails.age || "Not set"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Weight:</Text>
                <Text style={styles.infoValue}>{userDetails.weight || "Not set"} kg</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Height:</Text>
                <Text style={styles.infoValue}>{userDetails.height || "Not set"} cm</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Gender:</Text>
                <Text style={styles.infoValue}>
                  {userDetails.gender ? userDetails.gender.charAt(0).toUpperCase() + userDetails.gender.slice(1) : "Not set"}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.noDataText}>No profile information available.</Text>
              <Text style={styles.hintText}>Complete your profile in User Details.</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LinearGradient
              colors={["#FF6B6B", "#EE5A6F"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoutButtonGradient}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "white",
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
    color: "#1e1e1e",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 16,
    color: "#1e1e1e",
    fontWeight: "500",
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 40,
  },
  logoutButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 20,
    marginBottom: 40,
  },
  logoutButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
});


