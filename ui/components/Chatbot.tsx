"use client";

import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult, ChatMessage } from '@/types';
import { PaperAirplaneIcon } from '@/components/icons/PaperAirplaneIcon';
import { SparklesIcon } from '@/components/icons/SparklesIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';

interface ChatbotProps {
  analysisResult: AnalysisResult | null;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onClearHistory?: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  analysisResult,
  messages,
  setMessages,
  isLoading,
  setIsLoading,
  onClearHistory
}) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: messageText }] };

    setMessages(prev => [...prev, userMessage]);

    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const historyForApi = [...messages, userMessage].slice(-10);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageText,
          history: historyForApi,
          analysisResult: analysisResult,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        throw new Error("Authentication session expired. Please sign in again.");
      }

      if (!response.ok) {
        let errorMessage = 'Failed to get response from server.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.response }] }]);

    } catch (err: any) {
      console.error('API fetch error:', err);
      setError(err.message || 'Sorry, I encountered an error. Please try again.');

      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: `Error: ${err.message || "Something went wrong. Please check your connection or sign in again."}` }]
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const renderMessageContent = (text: string) => {
    const parts = text.split(/(\*\*[\s\S]*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground rounded-lg shadow-md border border-border overflow-hidden relative">

      <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0 relative scroll-smooth">

        {messages.length > 0 && onClearHistory && (
          <div className="flex justify-end sticky top-0 z-10 pointer-events-none">
            <button
              onClick={onClearHistory}
              className="pointer-events-auto p-2 bg-background/80 backdrop-blur-sm hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-full border border-border shadow-sm transition-colors"
              title="Clear Chat History"
              type="button"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground opacity-70">
            <SparklesIcon className="w-12 h-12 mb-2 text-blue-500" />
            <p className="font-medium">Your AI Assistant</p>
            <p className="text-sm mt-1">Ask questions about the analysis results.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`
                    max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm 
                    whitespace-pre-wrap wrap-break-words leading-relaxed
                    ${msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-foreground rounded-bl-sm border border-border'
                }
                `}
            >
              {renderMessageContent(msg.parts[0].text)}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start w-full animate-pulse">
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-gray-100 dark:bg-gray-800 border border-border">
              <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center w-full my-2">
            <div className="px-4 py-2 rounded-lg bg-red-100 text-red-600 text-sm border border-red-200">
              {error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-muted/30 border-t border-border">
        <form onSubmit={handleFormSubmit} className="flex items-end space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 max-h-32 min-h-11 w-full px-4 py-3 text-sm text-foreground bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={isLoading}
            rows={1}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 mb-px text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200 shrink-0"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};