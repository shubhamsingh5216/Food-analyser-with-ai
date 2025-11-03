import React, { useEffect, useState, useCallback } from "react";
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
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getUserDetailsByPhone, insertUserDetails } from "@/services/userService";
import { getCurrentUserPhone, clearCurrentUserPhone } from "@/utils/session";
import { useTheme } from "@/contexts/ThemeContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { themeMode, currentTheme, setThemeMode } = useTheme();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [showThemeModal, setShowThemeModal] = useState(false);
  
  // Form state
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState<string>("");
  
  const genderOptions = ["male", "female", "other"];
  
  const handleThemeChange = async (mode: 'light' | 'dark' | 'auto') => {
    await setThemeMode(mode);
    setShowThemeModal(false);
  };

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      const phone = getCurrentUserPhone();
      if (phone) {
        const details = await getUserDetailsByPhone(phone);
        if (details?.data) {
          setUserDetails(details.data);
          // Initialize form fields with existing data
          setAge(details.data.age || "");
          setWeight(details.data.weight || "");
          setHeight(details.data.height || "");
          setGender(details.data.gender || "");
        }
      }
    } catch (error) {
      console.error("Error loading user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    // Reset form fields to original values
    if (userDetails) {
      setAge(userDetails.age || "");
      setWeight(userDetails.weight || "");
      setHeight(userDetails.height || "");
      setGender(userDetails.gender || "");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
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
        setIsEditing(false);
        // Reload user details to show updated values
        await loadUserDetails();
        Alert.alert("Success", "Profile updated successfully!");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, []);

  // Refresh data when screen comes into focus (e.g., when returning from user details)
  useFocusEffect(
    useCallback(() => {
      if (!isEditing) {
        loadUserDetails();
      }
    }, [isEditing])
  );


  const handleLogout = () => {
    clearCurrentUserPhone();
    router.replace("/(auth)");
  };

  const isDark = currentTheme === 'dark';
  const gradientColors: [string, string] = isDark ? ["#434343", "#000000"] : ["#F8F9FA", "#E9ECEF"];
  const headerBgColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";
  const textColor = isDark ? "white" : "#1e1e1e";
  const iconColor = isDark ? "white" : "#1e1e1e";
  const loadingTextColor = isDark ? "white" : "#1e1e1e";

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={[styles.header, { backgroundColor: headerBgColor }]}>
          <Text style={[styles.headerTitle, { color: textColor }]}>Profile</Text>
          {!loading && userDetails && !isEditing && (
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={handleEdit} style={[styles.editButton, styles.pencilButton]}>
                <MaterialCommunityIcons name="pencil" size={24} color={iconColor} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowThemeModal(true)} style={styles.settingsButton}>
                <MaterialCommunityIcons name="cog" size={24} color={iconColor} />
              </TouchableOpacity>
            </View>
          )}
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
            {loading ? (
              <Text style={[styles.loadingText, { color: loadingTextColor }]}>Loading...</Text>
            ) : userDetails || isEditing ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Personal Information</Text>
                
                {isEditing ? (
                  <>
                    {/* Age Input */}
                    <View style={styles.inputRow}>
                      <Text style={styles.inputLabel}>Age</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. 22"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="number-pad"
                        value={age}
                        onChangeText={setAge}
                      />
                    </View>

                    {/* Weight and Height Row */}
                    <View style={styles.inputRowDouble}>
                      <View style={[styles.inputHalf, { marginRight: 6 }]}>
                        <Text style={styles.inputLabel}>Weight (kg)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="kg"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="decimal-pad"
                          value={weight}
                          onChangeText={setWeight}
                        />
                      </View>
                      <View style={[styles.inputHalf, { marginLeft: 6 }]}>
                        <Text style={styles.inputLabel}>Height (cm)</Text>
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

                    {/* Gender Selection */}
                    <View style={styles.inputRow}>
                      <Text style={styles.inputLabel}>Gender</Text>
                      <View style={styles.genderRow}>
                        {genderOptions.map((option) => {
                          const selected = gender === option;
                          return (
                            <TouchableOpacity
                              key={option}
                              onPress={() => setGender(option)}
                              activeOpacity={0.8}
                              style={[
                                styles.genderButton,
                                selected && styles.genderButtonSelected,
                                { marginRight: option !== genderOptions[genderOptions.length - 1] ? 10 : 0 },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.genderButtonText,
                                  selected && styles.genderButtonTextSelected,
                                ]}
                              >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>

                    {/* Error Message */}
                    {error ? (
                      <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                      </View>
                    ) : null}

                    {/* Save and Cancel Buttons */}
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        onPress={handleCancel}
                        style={[styles.actionButton, styles.cancelButton, { marginRight: 6 }]}
                        disabled={saving}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleSave}
                        style={[styles.actionButton, styles.saveButton, { marginLeft: 6 }]}
                        disabled={saving}
                      >
                        <LinearGradient
                          colors={["#22C55E", "#16A34A"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.saveButtonGradient}
                        >
                          <Text style={styles.saveButtonText}>
                            {saving ? "Saving..." : "Save"}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    {/* View Mode */}
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Age:</Text>
                      <Text style={styles.infoValue}>{userDetails?.age || "Not set"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Weight:</Text>
                      <Text style={styles.infoValue}>{userDetails?.weight || "Not set"} kg</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Height:</Text>
                      <Text style={styles.infoValue}>{userDetails?.height || "Not set"} cm</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Gender:</Text>
                      <Text style={styles.infoValue}>
                        {userDetails?.gender ? userDetails.gender.charAt(0).toUpperCase() + userDetails.gender.slice(1) : "Not set"}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.noDataText}>No profile information available.</Text>
                <Text style={styles.hintText}>Complete your profile in User Details.</Text>
              </View>
            )}

            {!isEditing && (
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
            )}
          </ScrollView>
        </KeyboardAvoidingView>
        
        {/* Theme Selection Modal */}
        <Modal
          visible={showThemeModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowThemeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Theme</Text>
              <Text style={styles.modalSubtitle}>Choose your preferred app theme</Text>
              
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  themeMode === 'light' && styles.themeOptionSelected
                ]}
                onPress={() => handleThemeChange('light')}
              >
                <MaterialCommunityIcons 
                  name="white-balance-sunny" 
                  size={24} 
                  color={themeMode === 'light' ? "#22C55E" : "#666"} 
                />
                <Text style={[
                  styles.themeOptionText,
                  themeMode === 'light' && styles.themeOptionTextSelected
                ]}>
                  Light Mode
                </Text>
                {themeMode === 'light' && (
                  <MaterialCommunityIcons name="check-circle" size={24} color="#22C55E" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  themeMode === 'dark' && styles.themeOptionSelected
                ]}
                onPress={() => handleThemeChange('dark')}
              >
                <MaterialCommunityIcons 
                  name="weather-night" 
                  size={24} 
                  color={themeMode === 'dark' ? "#22C55E" : "#666"} 
                />
                <Text style={[
                  styles.themeOptionText,
                  themeMode === 'dark' && styles.themeOptionTextSelected
                ]}>
                  Dark Mode
                </Text>
                {themeMode === 'dark' && (
                  <MaterialCommunityIcons name="check-circle" size={24} color="#22C55E" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  themeMode === 'auto' && styles.themeOptionSelected
                ]}
                onPress={() => handleThemeChange('auto')}
              >
                <MaterialCommunityIcons 
                  name="theme-light-dark" 
                  size={24} 
                  color={themeMode === 'auto' ? "#22C55E" : "#666"} 
                />
                <Text style={[
                  styles.themeOptionText,
                  themeMode === 'auto' && styles.themeOptionTextSelected
                ]}>
                  Auto (System)
                </Text>
                {themeMode === 'auto' && (
                  <MaterialCommunityIcons name="check-circle" size={24} color="#22C55E" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowThemeModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
  },
  pencilButton: {
    marginRight: 4,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e1e1e",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
  },
  themeOptionSelected: {
    borderColor: "#22C55E",
    backgroundColor: "#F0FDF4",
  },
  themeOptionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  themeOptionTextSelected: {
    color: "#1e1e1e",
    fontWeight: "700",
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
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
  inputRow: {
    marginBottom: 16,
  },
  inputRowDouble: {
    flexDirection: "row",
    marginBottom: 16,
  },
  inputHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 12,
    color: "#1e1e1e",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  genderRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
  },
  genderButtonSelected: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  genderButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 14,
  },
  genderButtonTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 14,
  },
  saveButton: {
    overflow: "hidden",
  },
  saveButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});


