import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLanguage } from "@/contexts/LanguageContext";

interface CameraControlsProps {
  onCapture: () => void;
  onFlip: () => void;
  loading: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onCapture,
  onFlip,
  loading,
}) => {
  const { t } = useLanguage();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [loading]);

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={onFlip}
        disabled={loading}
        activeOpacity={0.8}
        style={styles.actionButton}
      >
        <LinearGradient
          colors={["#667EEA", "#764BA2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <MaterialCommunityIcons name="camera-flip" size={22} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>{t('camera.flip')}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onCapture}
        disabled={loading}
        activeOpacity={0.8}
        style={styles.actionButton}
      >
        <Animated.View
          style={[
            { width: "100%" },
            { transform: loading ? [{ scale: pulseAnim }] : [] },
          ]}
        >
          <LinearGradient
            colors={loading ? ["#95A5A6", "#7F8C8D"] : ["#4CAF50", "#43A047"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <MaterialCommunityIcons 
              name={loading ? "loading" : "camera"} 
              size={22} 
              color="white" 
              style={styles.buttonIcon} 
            />
            <Text style={styles.buttonText}>
              {loading ? t('camera.processing') : t('camera.takePhoto')}
            </Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    maxWidth: "48%",
    marginHorizontal: 8,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 56,
    width: "100%",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
