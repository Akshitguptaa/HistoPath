"use client";

import React, { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { ImageAnalyzer } from '@/components/ImageAnalyzer';
import { Chatbot } from '@/components/Chatbot';
import { AnalysisResult, ChatMessage } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Home: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const [chatMessages, setChatMessages, clearChatMessages] = useLocalStorage<ChatMessage[]>('chat-history', []);

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
  }, [setChatMessages]);

  return (
    <div className="h-screen flex flex-col bg-linear-to-br from-background via-background to-muted/20">
      <Header />
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 w-full flex-1 min-h-0">


          <div className="lg:w-1/2 flex flex-col">
            <div className="flex items-center space-x-3 mb-5 shrink-0">
              <div className="w-1 h-8 bg-linear-to-b from-brand-primary-500 to-brand-primary-700 rounded-full" />
              <h2 className="text-3xl font-bold text-foreground">Image Analysis</h2>
            </div>
            <ImageAnalyzer onAnalysisComplete={handleAnalysisComplete} />
          </div>


          <div className="lg:w-1/2 flex flex-col min-h-0">
            <div className="flex items-center space-x-3 mb-5 shrink-0">
              <div className="w-1 h-8 bg-linear-to-b from-purple-500 to-purple-700 rounded-full" />
              <h2 className="text-3xl font-bold text-foreground">AI Assistant</h2>
            </div>
            <Chatbot
              analysisResult={analysisResult}
              messages={chatMessages}
              setMessages={setChatMessages}
              isLoading={isChatLoading}
              setIsLoading={setIsChatLoading}
              onClearHistory={clearChatMessages}
            />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm shrink-0 border-t border-border/50">
        <p className="font-medium">&copy; 2025 HistoPath - Advanced Tissue Analysis Platform</p>
      </footer>
    </div>
  );
};

export default Home;