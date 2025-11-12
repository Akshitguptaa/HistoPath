export interface AnalysisResult {
  prediction: 'Metastatic' | 'Non-Metastatic';
  confidence: number;
  heatmapUrl: string;
}

export interface ChatMessagePart {
    text: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatMessagePart[];
}