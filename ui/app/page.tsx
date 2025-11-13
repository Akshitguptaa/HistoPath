"use client"; 

import React, { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { ImageAnalyzer } from '@/components/ImageAnalyzer';
import { Chatbot } from '@/components/Chatbot';
import { AnalysisResult, ChatMessage } from '@/types';

const Home: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleAnalysisComplete = useCallback((result: AnalysisResult) => {
    setAnalysisResult(result);
    setChatMessages(prevMessages => [
        ...prevMessages,
        {
            role: 'model',
            parts: [{ text: `Analysis complete. The model predicts: **${result.prediction}** with ${Math.round(result.confidence * 100)}% confidence. Feel free to ask me any questions about this result or general histopathology.` }]
        }
    ]);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 w-full flex-1 min-h-0">
          
          <div className="lg:w-1/2 flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-foreground shrink-0">Image Analysis</h2>
            <ImageAnalyzer onAnalysisComplete={handleAnalysisComplete} />
          </div>

          <div className="lg:w-1/2 flex flex-col min-h-0">
            <h2 className="text-2xl font-bold mb-4 text-foreground shrink-0">Chat Assistant</h2>
            <Chatbot
              analysisResult={analysisResult}
              messages={chatMessages}
              setMessages={setChatMessages}
              isLoading={isChatLoading}
              setIsLoading={setIsChatLoading}
            />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm shrink-0">
        <p>&copy; 2025 HistoPath. AI for medical imaging.</p>
      </footer>
    </div>
  );
};

export default Home;