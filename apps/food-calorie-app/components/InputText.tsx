import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";

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
  const displayValue = value?.toString() || "";
  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        value={displayValue}
        editable={!isDisabled}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
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
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    backgroundColor: "#2a2a2a",
  },
});
