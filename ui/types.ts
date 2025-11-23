export interface AnalysisResult {
  prediction: 'Metastatic' | 'Non-Metastatic';
  confidence: number;
  gradcam: {
    original: string;
    heatmap: string;
    overlay: string;
  };
}

export interface ChatMessagePart {
  text: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatMessagePart[];
}