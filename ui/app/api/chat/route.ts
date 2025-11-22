import Groq from 'groq-sdk';
import { AnalysisResult, ChatMessage } from "@/types";
import { NextResponse } from 'next/server';
import { retrieveContext } from '@/lib/rag-utils';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

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
    if (!model) {
      return NextResponse.json(
        { error: "Model not configured." },
        { status: 500 }
      );
    }

    const { userId } = await auth();

    const { prompt, history, analysisResult } = (await request.json()) as {
      prompt: string;
      history: ChatMessage[];
      analysisResult: AnalysisResult | null;
    };

    let kbContext = null;
    try {
      kbContext = await retrieveContext(prompt);
    } catch (err) {
      console.warn("RAG Retrieval failed:", err);
    }

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

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: augmentedSystemInstruction },
    ];

    history.forEach(msg => {
      messages.push({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.parts[0].text,
      });
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: model,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    if (userId) {
      prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId, email: "pending_sync" }
      }).then(() => {
        return prisma.chat.create({
          data: {
            userId: userId,
            message: prompt,
            response: responseText
          }
        });
      }).catch(dbError => {
        console.error("Failed to save chat history (Non-fatal):", dbError);
      });
    }

    return NextResponse.json({ response: responseText });

  } catch (error) {
    console.error("Critical Error in chat API:", error);
    return NextResponse.json(
      { error: "An internal error occurred." },
      { status: 500 }
    );
  }
}