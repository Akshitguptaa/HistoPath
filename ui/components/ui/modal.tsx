"use client";

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, className = "" }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className={`bg-background border border-border rounded-xl shadow-2xl w-full max-h-[90vh] flex flex-col relative z-10 ${className}`}>
        <div className="flex justify-between items-center p-4 border-b border-border shrink-0">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted p-1 rounded-md transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-0 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};