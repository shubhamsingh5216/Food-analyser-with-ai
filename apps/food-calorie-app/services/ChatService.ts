const API_URL = process.env.GROQ_API_URL;
const API_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.GROQ_MODEL; // Groq model (e.g., llama-3.1-70b-versatile)

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  error?: string;
}

const systemPrompt = `You are a helpful and knowledgeable health and nutrition assistant. You specialize in:
- Healthy eating and nutrition advice
- Food and meal planning
- Diet recommendations
- Exercise and fitness guidance
- Gym workouts and training
- Weight management
- Nutritional analysis

Always provide accurate, evidence-based advice. Be friendly, supportive, and concise in your responses. If asked about something outside your expertise, politely redirect to health-related topics.`;

export class ChatService {
  static async sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      // Validate API key
      if (!API_KEY || API_KEY.trim() === '') {
        throw new Error('API key is missing. Please set a valid Groq API key in your environment variables.');
      }

      // Filter out empty messages
      const validMessages = messages.filter(msg => msg.content?.trim());
      if (validMessages.length === 0) {
        throw new Error('No valid messages to send.');
      }

      // Format messages
      const formattedMessages = validMessages.map(msg => ({
        role: msg.role,
        content: msg.content.trim(),
      }));

      // Prepare request body
      const requestBody = {
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...formattedMessages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      };

      // Call Groq API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage =
          responseData.error?.message ||
          responseData.error?.type ||
          responseData.message ||
          `API Error: ${response.status} ${response.statusText}`;

        if (
          errorMessage.includes('API key') ||
          errorMessage.includes('invalid') ||
          errorMessage.includes('authentication') ||
          response.status === 401
        ) {
          throw new Error('Invalid API key. Please verify your Groq API key and permissions at https://console.groq.com.');
        } else if (
          errorMessage.includes('quota') ||
          errorMessage.includes('rate limit') ||
          errorMessage.includes('429')
        ) {
          throw new Error('Rate limit exceeded. Please wait and try again.');
        } else if (
          errorMessage.includes('billing') ||
          errorMessage.includes('payment')
        ) {
          throw new Error('Billing issue detected. Please check your Groq account.');
        }

        throw new Error(errorMessage);
      }

      const assistantMessage = responseData.choices?.[0]?.message?.content;
      if (!assistantMessage) {
        throw new Error('No response from assistant.');
      }

      return { message: assistantMessage.trim() };
    } catch (error: any) {
      console.error('Chat API Error:', error);
      return {
        message: '',
        error:
          error.message ||
          'Failed to get response from assistant. Please try again later.',
      };
    }
  }
}
