import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find(opt => opt.value === selectedValue);

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
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select Meal Type</Text>
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
                        { backgroundColor: isSelected ? itemColor.backgroundColor : "#3a3a3a" }
                      ]}
                    >
                      <View style={styles.optionContent}>
                        <MaterialCommunityIcons
                          name={itemColor.icon as any}
                          size={24}
                          color={isSelected ? "white" : "#fff"}
                        />
                        <Text
                          style={[
                            styles.optionText,
                            isSelected ? styles.optionTextSelected : styles.optionTextUnselected,
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
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#2a2a2a",
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
    color: "#fff",
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
  optionTextSelected: {
    color: "#FFFFFF",
  },
  optionTextUnselected: {
    color: "#FFFFFF",
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#3a3a3a",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  placeholder: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 4,
  },
});
