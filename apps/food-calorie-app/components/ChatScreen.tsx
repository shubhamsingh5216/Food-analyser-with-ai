import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
// Ensure icons are loaded - @expo/vector-icons includes Ionicons by default
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { ChatService, ChatMessage } from "@/services/ChatService";

const { width } = Dimensions.get('window');

// Typewriter effect hook
const useTypewriter = (text: string, speed: number = 30) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, speed);

    return () => clearInterval(typeInterval);
  }, [text, speed]);

  return { displayedText, isTyping };
};

// Typewriter message component
const TypewriterMessage = ({ 
  content, 
  color, 
  style,
  messageId
}: { 
  content: string; 
  color: string; 
  style?: any;
  messageId: string | number;
}) => {
  const { displayedText, isTyping } = useTypewriter(content, 15);
  const [cursorOpacity] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isTyping) {
      const blinkAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(cursorOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(cursorOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      blinkAnimation.start();
      return () => blinkAnimation.stop();
    } else {
      cursorOpacity.setValue(0);
    }
  }, [isTyping]);

  return (
    <Text style={[style, { color }]}>
      {displayedText}
      {isTyping && (
        <Animated.Text 
          style={{ 
            opacity: cursorOpacity,
            color: color,
            fontWeight: 'bold',
          }}
        >
          ▊
        </Animated.Text>
      )}
    </Text>
  );
};

// Typing indicator component
const TypingIndicator = ({ color }: { color: string }) => {
  const [dot1] = useState(new Animated.Value(0));
  const [dot2] = useState(new Animated.Value(0));
  const [dot3] = useState(new Animated.Value(0));

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = [
      animateDot(dot1, 0),
      animateDot(dot2, 200),
      animateDot(dot3, 400),
    ];

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, []);

  const opacity1 = dot1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const opacity2 = dot2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const opacity3 = dot3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.typingDot, { backgroundColor: color, opacity: opacity1 }]} />
      <Animated.View style={[styles.typingDot, { backgroundColor: color, opacity: opacity2 }]} />
      <Animated.View style={[styles.typingDot, { backgroundColor: color, opacity: opacity3 }]} />
    </View>
  );
};

export default function ChatScreen() {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const isReading = currentTheme === 'reading';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your health and nutrition assistant. I can help you with:\n\n• Healthy eating and nutrition advice\n• Food and meal planning\n• Diet recommendations\n• Exercise and fitness guidance\n• Gym workouts and training\n• Weight management\n\nWhat would you like to know?',
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputHeight = useRef(new Animated.Value(48)).current;

  // Professional theme colors with modern gradients
  const gradientColors: [string, string, string] = isDark 
    ? ["#1a1a2e", "#16213e", "#0f3460"] 
    : isReading 
    ? ["#f5f1e8", "#faf8f3", "#fdfcf9"]
    : ["#f8fafc", "#f1f5f9", "#e2e8f0"];
  
  const headerGradient: [string, string] = isDark 
    ? ["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.05)"]
    : isReading
    ? ["rgba(139, 115, 85, 0.2)", "rgba(139, 115, 85, 0.05)"]
    : ["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.7)"];
  
  const textColor = isDark ? "#ffffff" : isReading ? "#3e2723" : "#1e293b";
  const iconColor = isDark ? "#ffffff" : isReading ? "#5d4037" : "#475569";
  const secondaryTextColor = isDark ? "#94a3b8" : isReading ? "#8d6e63" : "#64748b";
  
  const inputBgColor = isDark 
    ? "rgba(255, 255, 255, 0.1)" 
    : isReading 
    ? "rgba(255, 255, 255, 0.8)"
    : "rgba(255, 255, 255, 0.95)";
  
  const inputBorderColor = isDark 
    ? "rgba(255, 255, 255, 0.2)" 
    : isReading 
    ? "rgba(139, 115, 85, 0.3)"
    : "rgba(148, 163, 184, 0.3)";
  
  const inputTextColor = isDark ? "#ffffff" : isReading ? "#3e2723" : "#0f172a";
  
  // Modern gradient for user messages
  const userBubbleGradient: [string, string] = isDark 
    ? ["#10b981", "#059669"]
    : ["#22c55e", "#16a34a"];
  
  const assistantBubbleBg = isDark 
    ? "rgba(255, 255, 255, 0.08)" 
    : isReading 
    ? "rgba(255, 255, 255, 0.9)"
    : "rgba(255, 255, 255, 0.95)";
  
  const assistantTextColor = isDark ? "#e2e8f0" : isReading ? "#3e2723" : "#1e293b";
  
  // Shadow colors
  const shadowColor = isDark ? "#000000" : "rgba(0, 0, 0, 0.1)";

  // Menu functions
  const handleClearChat = () => {
    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to clear all messages? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setShowMenu(false),
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setMessages([
              {
                role: 'assistant',
                content: 'Hello! I\'m your health and nutrition assistant. I can help you with:\n\n• Healthy eating and nutrition advice\n• Food and meal planning\n• Diet recommendations\n• Exercise and fitness guidance\n• Gym workouts and training\n• Weight management\n\nWhat would you like to know?',
              },
            ]);
            setShowMenu(false);
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About Health Assistant",
      "Your AI-powered health and nutrition assistant.\n\nPowered by advanced AI to provide personalized health, nutrition, and fitness guidance.\n\nVersion 1.0.0",
      [
        {
          text: "OK",
          onPress: () => setShowMenu(false),
        },
      ]
    );
  };

  useEffect(() => {
    // Scroll to bottom when new message is added
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputText.trim(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      // Get all messages including the new user message
      const allMessages: ChatMessage[] = [...messages, userMessage];
      const response = await ChatService.sendMessage(allMessages);

      if (response.error) {
        // Format error message based on error type
        let errorMessage = response.error;
        if (response.error.includes('quota') || response.error.includes('billing') || response.error.includes('rate limit') || response.error.includes('429')) {
          errorMessage = `⚠️ Rate Limit Exceeded\n\nYour Groq API has reached the rate limit. To continue using the chatbot:\n\n1. Visit https://console.groq.com\n2. Check your API usage and limits\n3. Wait for the rate limit to reset or upgrade your plan\n\nAlternatively, you can update the API key in the code if you have a different account.`;
        } else if (response.error.includes('Invalid API key') || response.error.includes('API key') || response.error.includes('authentication') || response.error.includes('401')) {
          errorMessage = `⚠️ Invalid API Key\n\nThe Groq API key in the code appears to be invalid or expired. Please update it with a valid API key from https://console.groq.com`;
        } else if (response.error.includes('rate limit') || response.error.includes('429')) {
          errorMessage = `⏳ Rate Limit Reached\n\nToo many requests. Please wait a moment and try again.`;
        } else {
          errorMessage = `⚠️ Error: ${response.error}\n\nPlease try again in a moment.`;
        }
        
        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: errorMessage,
          },
        ]);
      } else {
        // Add assistant response
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: response.message,
          },
        ]);
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Professional Header with Glassmorphism */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={22} color={iconColor} />
              </TouchableOpacity>
              
              <View style={styles.headerTitleContainer}>
                <View style={[styles.avatarContainer, { backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)' }]}>
                  <LinearGradient
                    colors={userBubbleGradient}
                    style={styles.avatarGradient}
                  >
                    <Ionicons name="medical-outline" size={20} color="#ffffff" />
                  </LinearGradient>
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={[styles.headerTitle, { color: textColor }]}>
                    Health Assistant
                  </Text>
                  <Text style={[styles.headerSubtitle, { color: secondaryTextColor }]}>
                    AI Nutrition Expert
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                onPress={() => setShowMenu(true)}
                style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                activeOpacity={0.7}
              >
                <Ionicons name="ellipsis-vertical" size={20} color={iconColor} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Messages Container */}
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageWrapper,
                  msg.role === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper,
                ]}
              >
                {msg.role === 'assistant' && (
                  <View style={[styles.messageAvatar, { backgroundColor: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)' }]}>
                    <Ionicons name="medical-outline" size={16} color={isDark ? '#10b981' : '#22c55e'} />
                  </View>
                )}
                
                {msg.role === 'user' ? (
                  <LinearGradient
                    colors={userBubbleGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.messageBubble, styles.userBubble]}
                  >
                    <Text style={[styles.messageText, styles.userMessageText]}>
                      {msg.content}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View
                    style={[
                      styles.messageBubble,
                      styles.assistantBubble,
                      {
                        backgroundColor: assistantBubbleBg,
                        shadowColor: shadowColor,
                      },
                    ]}
                  >
                    <TypewriterMessage
                      content={msg.content}
                      color={assistantTextColor}
                      style={styles.messageText}
                      messageId={index}
                    />
                  </View>
                )}
                
                {msg.role === 'user' && (
                  <View style={[styles.messageAvatar, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)' }]}>
                    <Ionicons name="person" size={16} color={isDark ? '#ffffff' : '#475569'} />
                  </View>
                )}
              </View>
            ))}
            
            {loading && (
              <View style={[styles.messageWrapper, styles.assistantMessageWrapper]}>
                <View style={[styles.messageAvatar, { backgroundColor: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)' }]}>
                  <Ionicons name="medical-outline" size={16} color={isDark ? '#10b981' : '#22c55e'} />
                </View>
                <View
                  style={[
                    styles.messageBubble,
                    styles.assistantBubble,
                    {
                      backgroundColor: assistantBubbleBg,
                      shadowColor: shadowColor,
                    },
                  ]}
                >
                  <TypingIndicator color={assistantTextColor} />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Professional Input Area */}
          <View style={[styles.inputContainer, { 
            borderTopColor: inputBorderColor,
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : isReading ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          }]}>
            <View style={[styles.inputWrapper, { 
              backgroundColor: inputBgColor,
              borderColor: inputBorderColor,
            }]}>
              <TextInput
                style={[styles.input, { color: inputTextColor }]}
                placeholder="Ask about health, nutrition, diet, exercise..."
                placeholderTextColor={secondaryTextColor}
                value={inputText}
                onChangeText={(text) => {
                  setInputText(text);
                  // Animate input height
                  const height = Math.min(Math.max(48, text.split('\n').length * 24 + 24), 120);
                  Animated.spring(inputHeight, {
                    toValue: height,
                    useNativeDriver: false,
                  }).start();
                }}
                multiline
                maxLength={500}
                editable={!loading}
                textAlignVertical="center"
              />
              {inputText.length > 0 && (
                <Text style={[styles.charCount, { color: secondaryTextColor }]}>
                  {inputText.length}/500
                </Text>
              )}
            </View>
            
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim() || loading}
              activeOpacity={0.8}
              style={[
                styles.sendButton,
                (!inputText.trim() || loading) && styles.sendButtonDisabled,
              ]}
            >
              <LinearGradient
                colors={(!inputText.trim() || loading) 
                  ? ["#94a3b8", "#64748b"] 
                  : userBubbleGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Ionicons name="send" size={20} color="#ffffff" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Menu Modal */}
        <Modal
          visible={showMenu}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowMenu(false)}
        >
          <TouchableOpacity
            style={styles.menuOverlay}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          >
            <View
              style={[
                styles.menuContainer,
                {
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  shadowColor: shadowColor,
                },
              ]}
              onStartShouldSetResponder={() => true}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleClearChat}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={22} color={isDark ? '#ef4444' : '#dc2626'} />
                <Text style={[styles.menuItemText, { color: textColor }]}>
                  Clear Chat History
                </Text>
              </TouchableOpacity>

              <View style={[styles.menuDivider, { backgroundColor: inputBorderColor }]} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleAbout}
                activeOpacity={0.7}
              >
                <Ionicons name="information-circle-outline" size={22} color={iconColor} />
                <Text style={[styles.menuItemText, { color: textColor }]}>
                  About
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
  headerContainer: {
    paddingBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 8 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
    gap: 12,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
    letterSpacing: 0.2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 32,
  },
  messageWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
    gap: 8,
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
  },
  assistantMessageWrapper: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userBubble: {
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  userMessageText: {
    color: "#ffffff",
    fontWeight: "500",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 4,
    minHeight: 48,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    lineHeight: 22,
  },
  charCount: {
    fontSize: 11,
    paddingRight: 8,
    fontWeight: "500",
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
    paddingHorizontal: 20,
  },
  menuContainer: {
    borderRadius: 16,
    paddingVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
  },
});

