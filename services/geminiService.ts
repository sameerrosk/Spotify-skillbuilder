import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AssistantResponse } from '../types';

// Initialize Gemini Client
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const assistantSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    intentDetected: { type: Type.STRING, description: "The intent identified from user query" },
    confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" },
    uncertaintyExplanation: { type: Type.STRING, description: "Explanation if confidence is low" },
    stepByStepFlow: {
      type: Type.ARRAY,
      description: "A list of steps if the user needs a workflow",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          expectedScreen: { type: Type.STRING },
        }
      }
    },
    checklist: {
      type: Type.ARRAY,
      description: "A checklist for the user to follow",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          hints: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    },
    suggestedActions: {
      type: Type.ARRAY,
      description: "Actions the user can take immediately",
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          actionType: { type: Type.STRING },
          payload: { type: Type.STRING } // Keeping simplified as string for this demo
        }
      }
    },
    followUpQuestions: {
      type: Type.ARRAY,
      description: "2-3 follow up questions to keep conversation going",
      items: { type: Type.STRING }
    }
  }
};

export const getAssistantResponse = async (
  userMessage: string,
  context: any
): Promise<AssistantResponse> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini.");
    return {
      intentDetected: "NO_API_KEY",
      confidence: 0,
      uncertaintyExplanation: "API Key is missing. Please set process.env.API_KEY.",
      suggestedActions: []
    };
  }

  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `You are the SpotifyLearn Assistant. 
    Context: The user is currently on screen: ${context.screen}. 
    Goal: ${context.goalTitle || 'None selected'}. 
    Day: ${context.dayNumber || 0}.
    
    Your role is to help the user with their learning journey, troubleshoot issues, or explain concepts from the audio pack.
    Always return a structured JSON response matching the schema provided.
    If the user asks about the specific content of the lesson, use your general knowledge to simulate a helpful answer about the topics: ${context.topics || 'General learning'}.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: userMessage,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: assistantSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as AssistantResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      intentDetected: "ERROR",
      confidence: 0,
      uncertaintyExplanation: "I encountered an error processing your request.",
      suggestedActions: [{ label: "Retry", actionType: "RETRY", payload: "" }]
    };
  }
};