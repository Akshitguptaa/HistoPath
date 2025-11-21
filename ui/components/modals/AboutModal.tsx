"use client";

import React from 'react';
import { Modal } from '@/components/ui/modal';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
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
                      <p className="text-xs text-muted-foreground">Project Mentor</p>
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
  );
};