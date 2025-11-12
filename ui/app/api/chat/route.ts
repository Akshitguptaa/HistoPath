import Groq from 'groq-sdk';
import { AnalysisResult, ChatMessage } from "@/types";
import { NextResponse } from 'next/server';

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  throw new Error("GROQ_API_KEY is not defined in environment variables");
}

const groq = new Groq({ apiKey });

const model = "llama-3.3-70b-versatile";

export async function POST(request: Request) {
  try {
    const { prompt, history, analysisResult } = (await request.json()) as {
      prompt: string;
      history: ChatMessage[];
      analysisResult: AnalysisResult | null;
    };

    let systemInstruction = `You are 'Histopath', a helpful AI assistant specializing in histopathology and cancer detection. Your purpose is to assist clinicians and researchers in interpreting the results from a CNN model that detects metastasis in tissue patches. 
- Be concise, clear, and professional.
- Explain technical terms simply.
- **Crucially, you must never provide a medical diagnosis or treatment advice.** You are an informational tool, not a substitute for a qualified pathologist.

---
**Internal Knowledge Base (Simulated from Medical Documents):**

**1. Histopathology & Metastasis:**
    - **Histopathology:** The microscopic examination of tissue to study the manifestations of disease.
    - **Metastasis:** The spread of cancer cells from the place where they first formed to another part of the body. In lymph nodes, this is a critical indicator of cancer progression, particularly in breast cancer.
    - **Tumor Patch:** A small section (e.g., 96x96 pixels) of a whole-slide image (WSI) of a tissue sample. Analysis is often done at the patch level.

**2. Model & Dataset Information:**
    - **Model:** A Convolutional Neural Network (CNN) based on the ResNet50 architecture. It's trained to perform binary classification (Metastatic vs. Non-Metastatic).
    - **Dataset:** The model was trained on the PatchCamelyon (PCam) dataset. PCam consists of hundreds of thousands of 96x96 pixel image patches extracted from lymph node WSIs. Each patch is labeled as containing metastatic tissue or not.
    - **Grad-CAM (Gradient-weighted Class Activation Mapping):** This is the technique used to generate heatmaps. The heatmap visually indicates which regions of the image patch were most influential in the model's prediction. "Hotter" areas (e.g., red/yellow) signify regions the model focused on to make its decision. This helps in understanding and trusting the model's output.

---
`;

    if (analysisResult) {
      systemInstruction += `
**Current Image Analysis Context:**
- The user has just analyzed an image patch.
- **Model Prediction:** ${analysisResult.prediction}
- **Confidence Score:** ${Math.round(analysisResult.confidence * 100)}%
- A Grad-CAM heatmap has been generated and is displayed to the user.
The user is likely asking about this specific result. Use this context to answer their questions. For example, if they ask "What does this mean?", explain the prediction in the context of the model's capabilities, not as a medical fact.
---
`;
    }

    const messages: Groq.Chat.CompletionCreateParams.Message[] = [
      {
        role: "system",
        content: systemInstruction,
      },
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

    return NextResponse.json({ response: responseText });

  } catch (error) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { error: "Failed to get a response from the AI assistant." },
      { status: 500 }
    );
  }
}