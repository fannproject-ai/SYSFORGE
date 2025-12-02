import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Standard chat model for quick interactions
export const createChatSession = (systemInstruction: string): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
  });
};

export const sendMessageToChat = async (chat: Chat, message: string) => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

// Thinking model for complex configuration generation
export const generateComplexConfig = async (prompt: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Konteks: ${context}\n\nTugas: ${prompt}`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    return response.text || "Tidak ada respons yang dihasilkan.";
  } catch (error) {
    console.error("Error generating complex config:", error);
    return "Gagal membuat konfigurasi. Silakan coba lagi.";
  }
};

export const explainCommand = async (command: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Jelaskan perintah Linux berikut secara singkat dan jelas dalam Bahasa Indonesia untuk administrator sistem. Jelaskan flag/opsi kuncinya.\n\nPerintah:\n${command}`,
    });
    return response.text || "Tidak dapat menjelaskan perintah.";
  } catch (error) {
    console.error("Error explaining command:", error);
    return "Gagal mengambil penjelasan.";
  }
}