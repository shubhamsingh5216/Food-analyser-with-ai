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
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { themeMode, currentTheme, setThemeMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  
  // Form state
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState<string>("");
  
  const genderOptions = ["male", "female", "other"];
  
  const handleThemeChange = async (mode: 'light' | 'dark' | 'auto' | 'reading') => {
    await setThemeMode(mode);
    setShowThemeModal(false);
  };

  const handleLanguageChange = async (lang: 'en' | 'hi' | 'kn') => {
    await setLanguage(lang);
    setShowLanguageModal(false);
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
  const isReading = currentTheme === 'reading';
  // Reading mode: warm sepia tones
  const gradientColors: [string, string] = isDark 
    ? ["#434343", "#000000"] 
    : isReading 
    ? ["#F7F3E9", "#FAF8F3"]
    : ["#F8F9FA", "#E9ECEF"];
  const headerBgColor = isDark 
    ? "rgba(255, 255, 255, 0.1)" 
    : isReading 
    ? "rgba(139, 115, 85, 0.1)"
    : "rgba(0, 0, 0, 0.05)";
  const textColor = isDark 
    ? "white" 
    : isReading 
    ? "#5D4037"
    : "#1e1e1e";
  const iconColor = isDark 
    ? "white" 
    : isReading 
    ? "#5D4037"
    : "#1e1e1e";
  const loadingTextColor = isDark 
    ? "white" 
    : isReading 
    ? "#5D4037"
    : "#1e1e1e";

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={[styles.header, { backgroundColor: headerBgColor }]}>
          <Text style={[styles.headerTitle, { color: textColor }]}>{t('profile.title')}</Text>
          {!loading && userDetails && !isEditing && (
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={handleEdit} style={[styles.editButton, styles.pencilButton]}>
                <MaterialCommunityIcons name="pencil" size={24} color={iconColor} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  setShowThemeModal(true);
                }} 
                style={styles.settingsButton}
              >
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
              <Text style={[styles.loadingText, { color: loadingTextColor }]}>{t('common.loading')}</Text>
            ) : userDetails || isEditing ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{t('profile.personalInfo')}</Text>
                
                {isEditing ? (
                  <>
                    {/* Age Input */}
                    <View style={styles.inputRow}>
                      <Text style={styles.inputLabel}>{t('profile.age')}</Text>
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
                        <Text style={styles.inputLabel}>{t('userDetails.weight')}</Text>
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
                        <Text style={styles.inputLabel}>{t('userDetails.height')}</Text>
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
                      <Text style={styles.inputLabel}>{t('profile.gender')}</Text>
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
                                {t(`userDetails.genderOptions.${option}`)}
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
                        <Text style={styles.cancelButtonText}>{t('profile.cancelEdit')}</Text>
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
                            {saving ? t('common.loading') : t('common.save')}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    {/* View Mode */}
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>{t('profile.age')}:</Text>
                      <Text style={styles.infoValue}>{userDetails?.age || t('common.notSet')}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>{t('profile.weight')}:</Text>
                      <Text style={styles.infoValue}>{userDetails?.weight || t('common.notSet')} kg</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>{t('profile.height')}:</Text>
                      <Text style={styles.infoValue}>{userDetails?.height || t('common.notSet')} cm</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>{t('profile.gender')}:</Text>
                      <Text style={styles.infoValue}>
                        {userDetails?.gender ? t(`userDetails.genderOptions.${userDetails.gender}`) : t('common.notSet')}
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
                  <Text style={styles.logoutButtonText}>{t('profile.logout')}</Text>
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
              <Text style={styles.modalTitle}>{t('profile.selectTheme')}</Text>
              <View style={styles.modalTabContainer}>
                <TouchableOpacity
                  style={[styles.modalTab, !showLanguageModal && styles.modalTabActive]}
                  onPress={() => setShowLanguageModal(false)}
                >
                  <Text style={[styles.modalTabText, !showLanguageModal && styles.modalTabTextActive]}>
                    {t('profile.theme')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalTab, showLanguageModal && styles.modalTabActive]}
                  onPress={() => setShowLanguageModal(true)}
                >
                  <Text style={[styles.modalTabText, showLanguageModal && styles.modalTabTextActive]}>
                    {t('profile.language')}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {!showLanguageModal ? (
                <>
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
                  {t('profile.lightMode')}
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
                  {t('profile.darkMode')}
                </Text>
                {themeMode === 'dark' && (
                  <MaterialCommunityIcons name="check-circle" size={24} color="#22C55E" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeOption,
                  themeMode === 'reading' && styles.themeOptionSelected
                ]}
                onPress={() => handleThemeChange('reading')}
              >
                <MaterialCommunityIcons 
                  name="book-open-variant" 
                  size={24} 
                  color={themeMode === 'reading' ? "#22C55E" : "#666"} 
                />
                <Text style={[
                  styles.themeOptionText,
                  themeMode === 'reading' && styles.themeOptionTextSelected
                ]}>
                  {t('profile.readingMode')}
                </Text>
                {themeMode === 'reading' && (
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
                  {t('profile.autoMode')}
                </Text>
                {themeMode === 'auto' && (
                  <MaterialCommunityIcons name="check-circle" size={24} color="#22C55E" />
                )}
              </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalSubtitle}>{t('profile.selectLanguage')}</Text>
                
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    language === 'en' && styles.themeOptionSelected
                  ]}
                  onPress={() => handleLanguageChange('en')}
                >
                  <MaterialCommunityIcons 
                    name="translate" 
                    size={24} 
                    color={language === 'en' ? "#22C55E" : "#666"} 
                  />
                  <Text style={[
                    styles.themeOptionText,
                    language === 'en' && styles.themeOptionTextSelected
                  ]}>
                    {t('profile.english')}
                  </Text>
                  {language === 'en' && (
                    <MaterialCommunityIcons name="check-circle" size={24} color="#22C55E" />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    language === 'hi' && styles.themeOptionSelected
                  ]}
                  onPress={() => handleLanguageChange('hi')}
                >
                  <MaterialCommunityIcons 
                    name="translate" 
                    size={24} 
                    color={language === 'hi' ? "#22C55E" : "#666"} 
                  />
                  <Text style={[
                    styles.themeOptionText,
                    language === 'hi' && styles.themeOptionTextSelected
                  ]}>
                    {t('profile.hindi')}
                  </Text>
                  {language === 'hi' && (
                    <MaterialCommunityIcons name="check-circle" size={24} color="#22C55E" />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    language === 'kn' && styles.themeOptionSelected
                  ]}
                  onPress={() => handleLanguageChange('kn')}
                >
                  <MaterialCommunityIcons 
                    name="translate" 
                    size={24} 
                    color={language === 'kn' ? "#22C55E" : "#666"} 
                  />
                  <Text style={[
                    styles.themeOptionText,
                    language === 'kn' && styles.themeOptionTextSelected
                  ]}>
                    {t('profile.kannada')}
                  </Text>
                  {language === 'kn' && (
                    <MaterialCommunityIcons name="check-circle" size={24} color="#22C55E" />
                  )}
                </TouchableOpacity>
              </>
            )}
              
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setShowThemeModal(false);
                  setShowLanguageModal(false);
                }}
              >
                <Text style={styles.modalCloseButtonText}>{t('common.close')}</Text>
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
  modalTabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  modalTabActive: {
    borderBottomColor: '#22C55E',
  },
  modalTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalTabTextActive: {
    color: '#22C55E',
  },
});


