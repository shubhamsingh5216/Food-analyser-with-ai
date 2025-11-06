import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";

interface DropdownProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  style?: object;
  isDisabled: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onValueChange,
  placeholder,
  style,
  isDisabled,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const isReading = currentTheme === 'reading';
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find(opt => opt.value === selectedValue);
  
  // Theme colors
  const modalOverlayColor = isDark 
    ? "rgba(0, 0, 0, 0.5)" 
    : isReading 
    ? "rgba(139, 115, 85, 0.2)"
    : "rgba(0, 0, 0, 0.3)";
  const modalBgColor = isDark 
    ? "#2a2a2a" 
    : isReading 
    ? "#F7F3E9"
    : "#FFFFFF";
  const optionBgColor = isDark 
    ? "#3a3a3a" 
    : isReading 
    ? "#FFF8DC"
    : "#F8F9FA";
  const optionSelectedBgColor = "#4CAF50"; // Keep green for selected
  const textColor = isDark 
    ? "#fff" 
    : isReading 
    ? "#5D4037"
    : "#1e1e1e";
  const cancelButtonBgColor = isDark 
    ? "#3a3a3a" 
    : isReading 
    ? "#E8DDCA"
    : "#F3F4F6";
  const cancelButtonTextColor = isDark 
    ? "#fff" 
    : isReading 
    ? "#5D4037"
    : "#1e1e1e";

  const getMealColor = (mealType: string) => {
    // Use the exact same green color as the "Add Dish" button (#4CAF50)
    const addDishColor = "#4CAF50";
    return {
      gradient: [addDishColor, addDishColor], // Solid color to match Add Dish button exactly
      backgroundColor: addDishColor, // Solid background color
      icon: mealType === "Breakfast" ? "food-croissant" : mealType === "Lunch" ? "food" : "food-variant",
      iconColor: addDishColor,
    };
  };

  const mealColor = getMealColor(selectedValue);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View style={[styles.dropdownContainer, style]}>
      <TouchableOpacity
        onPress={() => !isDisabled && setModalVisible(true)}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[
          styles.buttonContainer,
          { backgroundColor: mealColor.backgroundColor },
          isDisabled && styles.buttonDisabled
        ]}
      >
        <View style={styles.buttonGradient}>
          <MaterialCommunityIcons
            name={mealColor.icon as any}
            size={20}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>{selectedOption?.label || placeholder || "Select"}</Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color="white"
            style={styles.chevronIcon}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: modalOverlayColor }]}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: modalBgColor }]} onStartShouldSetResponder={() => true}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Select Meal Type</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const itemColor = getMealColor(item.value);
                const isSelected = selectedValue === item.value;
                return (
                  <TouchableOpacity
                    onPress={() => handleSelect(item.value)}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.optionGradient,
                        { backgroundColor: isSelected ? optionSelectedBgColor : optionBgColor }
                      ]}
                    >
                      <View style={styles.optionContent}>
                        <MaterialCommunityIcons
                          name={itemColor.icon as any}
                          size={24}
                          color={isSelected ? "white" : textColor}
                        />
                        <Text
                          style={[
                            styles.optionText,
                            { color: isSelected ? "#FFFFFF" : textColor },
                          ]}
                        >
                          {item.label}
                        </Text>
                        {isSelected && (
                          <MaterialCommunityIcons
                            name="check-circle"
                            size={20}
                            color="white"
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.cancelButton, { backgroundColor: cancelButtonBgColor }]}
            >
              <Text style={[styles.cancelButtonText, { color: cancelButtonTextColor }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    width: "45%",
    marginLeft: 20,
    marginVertical: 10, // Match InputText container's marginVertical: 10
  },
  buttonContainer: {
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 18, // Match InputText: label (14px font size + 4px marginBottom) = 18px to align button with input field
    // Same styling as Add Dish button
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10, // Match InputText input padding: 10px
    paddingHorizontal: 16,
    width: "100%",
    height: 42, // Match InputText input height: padding (10*2) + border (1*2) ≈ 42px
    // Same padding as Add Dish button
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  chevronIcon: {
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionItemSelected: {
    borderColor: "#fff",
  },
  optionGradient: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginLeft: 12,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  placeholder: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 4,
  },
});
