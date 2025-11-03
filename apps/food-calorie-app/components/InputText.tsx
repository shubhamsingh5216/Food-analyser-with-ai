import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface InputTextProps {
  value: string | number;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address";
  style?: object;
  label?: string;
  isDisabled: boolean;
}

export const InputText: React.FC<InputTextProps> = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  style,
  label,
  isDisabled,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const displayValue = value?.toString() || "";
  
  const labelColor = isDark ? "#fff" : "#1e1e1e";
  const inputBgColor = isDark ? "#2a2a2a" : "#FFFFFF";
  const inputBorderColor = isDark ? "#ccc" : "#D1D5DB";
  const inputTextColor = isDark ? "#fff" : "#1e1e1e";
  const placeholderColor = isDark ? "#aaa" : "#9CA3AF";
  
  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={[styles.label, { color: labelColor }]}>{label}</Text>}
      <TextInput
        style={[styles.input, { backgroundColor: inputBgColor, borderColor: inputBorderColor, color: inputTextColor }]}
        value={displayValue}
        editable={!isDisabled}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
    width: 150,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
});
