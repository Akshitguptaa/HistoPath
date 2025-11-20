"use client";

import React, { useState } from 'react';
import { ModeToggle } from '@/components/ThemeSwitcher';
import { SparklesIcon } from '@/components/icons/SparklesIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Modal = ({ isOpen, onClose, title, children, className = "" }: ModalProps) => {
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

export const Header: React.FC = () => {
  const [showReport, setShowReport] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-8 w-8 text-brand-primary-500" />
              <h1 className="text-2xl font-bold text-foreground">
                HistoPath
              </h1>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-6">
              <nav className="hidden sm:flex items-center space-x-6 text-sm font-medium">
                <button 
                  onClick={() => setShowReport(true)} 
                  className="text-muted-foreground hover:text-brand-primary-600 transition-colors"
                >
                  View Report
                </button>
                <button 
                  onClick={() => setShowAbout(true)} 
                  className="text-muted-foreground hover:text-brand-primary-600 transition-colors"
                >
                  About
                </button>
              </nav>

              <div className="h-6 w-px bg-border hidden sm:block" />
              
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      <Modal 
        isOpen={showReport} 
        onClose={() => setShowReport(false)} 
        title="Minor Report"
        className="max-w-4xl h-[800px]"
      >
        <div className="w-full h-full bg-muted/30 p-1">
            <iframe 
                src="/Report.pdf" 
                className="w-full h-full rounded-b-lg border-none"
                title="Project Report PDF"
            />
        </div>
      </Modal>

      <Modal 
        isOpen={showAbout} 
        onClose={() => setShowAbout(false)} 
        title="About HistoPath"
        className="max-w-2xl"
      >
        <div className="p-6 space-y-6">
            <div>
                <p className="text-muted-foreground leading-relaxed">
                    <strong>HistoPath</strong> is a specialized AI decision-support system designed to automate the detection of metastasis in lymph node histopathology. 
                    By leveraging a custom Convolutional Neural Network (CNN) trained on the PatchCamelyon dataset, it classifies tissue patches with high precision to identify cancerous regions. 
                    The platform integrates an intelligent RAG-based chatbot to provide context-aware explanations, aiming to streamline the diagnostic workflow and reduce manual workload for pathologists.
                </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-muted/40 rounded-lg border border-border">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-primary-600 mb-3">
                        Project Developers
                    </h4>
                    <ul className="space-y-2 text-sm text-foreground">
                        <li className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary-400"/>
                                <span>Akshit Gupta</span>
                            </div>
                            <span className="text-muted-foreground font-mono text-xs">23103077</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary-400"/>
                                <span>Prish Keshari</span>
                            </div>
                            <span className="text-muted-foreground font-mono text-xs">23103082</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary-400"/>
                                <span>Arjun Gupta</span>
                            </div>
                            <span className="text-muted-foreground font-mono text-xs">23103022</span>
                        </li>
                    </ul>
                </div>

                <div className="p-4 bg-muted/40 rounded-lg border border-border">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-primary-600 mb-3">
                        Supervision
                    </h4>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Dr. Amit Mishra</p>
                        <p className="text-xs text-muted-foreground">Under SuperVision Of</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground font-medium">
                            Jaypee Institute of Information Technology
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </Modal>
    </>
  );
};