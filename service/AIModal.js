// Use import instead of require
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Vite uses import.meta.env for environment variables
const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;

// Initialize the GoogleGenerativeAI with the API key
const genAI = new GoogleGenerativeAI(apiKey);

// Set up the generative model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Configuration for the generation process
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Export the AIChatSession with the configured model
export const AIChatSession = model.startChat({
  generationConfig,
  // safetySettings: Adjust safety settings
  // See https://ai.google.dev/gemini-api/docs/safety-settings
  history: [],
});
