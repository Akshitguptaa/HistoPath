import Groq from 'groq-sdk';
import { AnalysisResult, ChatMessage } from "@/types";
import { NextResponse } from 'next/server';
import { retrieveContext } from '@/lib/rag-utils';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const model = process.env.MODEL;

const baseSystemInstruction = `You are 'Histopath', a helpful AI assistant specializing in histopathology and cancer detection.
- Be concise, clear, and professional.
- **You must never provide a medical diagnosis or treatment advice.** You are an informational tool, not a substitute for a qualified pathologist.
- Use the provided context (from documents) and the image analysis results to answer the user's questions.
- If the retrieved context is not relevant to the user's question, state that you do not have that specific information in your documents and answer based on your general knowledge.
---
`;

export async function POST(request: Request) {
  try {
    const { prompt, history, analysisResult } = (await request.json()) as {
      prompt: string;
      history: ChatMessage[];
      analysisResult: AnalysisResult | null;
    };

    // Retrieval Step 
    const kbContext = await retrieveContext(prompt);

    // Augmentation Step
    let augmentedSystemInstruction = baseSystemInstruction;
    
    if (analysisResult) {
      augmentedSystemInstruction += `
**Current Image Analysis Context:**
- **Model Prediction:** ${analysisResult.prediction}
- **Confidence Score:** ${Math.round(analysisResult.confidence * 100)}%
- A Grad-CAM heatmap is available.
---
`;
    }

    if (kbContext) {
      augmentedSystemInstruction += `
**Retrieved Knowledge Base Context:**
(Use this information to answer the user's question)
${kbContext}
---
`;
    }

    const messages: Groq.Chat.CompletionCreateParams.Message[] = [
      {
        role: "system",
        content: augmentedSystemInstruction,
      },
    ];

    history.forEach(msg => {
      messages.push({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.parts[0].text,
      });
    });
    
    // Generation Step 
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: model,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    return NextResponse.json({ response: responseText });

  } catch (error) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { error: "Failed to get a response from the AI assistant." },
      { status: 500 }
    );
  }
}