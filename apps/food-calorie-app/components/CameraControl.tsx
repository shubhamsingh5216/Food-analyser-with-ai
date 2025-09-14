import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface CameraControlsProps {
  onCapture: () => void;
  onFlip: () => void;
  loading: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onCapture,
  onFlip,
  loading,
}) => (
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.button} onPress={onFlip} disabled={loading}>
      <Text style={styles.text}>Flip Camera</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={onCapture}
      disabled={loading}
    >
      <Text style={styles.text}>{loading ? "Processing..." : "Capture"}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 120,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
