"use client";

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';

interface ResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResourcesModal: React.FC<ResourcesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'glossary' | 'faq'>('basics');

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Knowledge Resources"
      className="max-w-3xl h-[600px]"
    >
      <div className="flex flex-col h-full">
          <div className="flex border-b border-border">
              <button 
                  onClick={() => setActiveTab('basics')}
                  className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'basics' ? 'border-brand-primary-600 text-brand-primary-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                  Basics
              </button>
              <button 
                  onClick={() => setActiveTab('glossary')}
                  className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'glossary' ? 'border-brand-primary-600 text-brand-primary-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                  Glossary
              </button>
              <button 
                  onClick={() => setActiveTab('faq')}
                  className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'faq' ? 'border-brand-primary-600 text-brand-primary-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                  FAQ
              </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm leading-relaxed text-muted-foreground">
              
              {activeTab === 'basics' && (
                  <div className="space-y-6">
                      <section>
                          <h4 className="text-foreground font-semibold text-base mb-2">What is Histopathology?</h4>
                          <p>Histopathology is the microscopic examination of biological tissues to observe diseased cells in fine detail. It is the gold standard for diagnosing cancer.</p>
                      </section>
                      <section>
                          <h4 className="text-foreground font-semibold text-base mb-2">Whole-Slide Images (WSI) & Patches</h4>
                          <p>Digital pathology involves scanning glass slides into massive "Whole-Slide Images" (often gigabytes in size). To analyze these using AI, we break them down into small, manageable squares called <strong>patches</strong> (e.g., 96x96 pixels), which our model processes individually.</p>
                      </section>
                      <section>
                          <h4 className="text-foreground font-semibold text-base mb-2">Metastasis</h4>
                          <p>Metastasis is the spread of cancer cells from the primary tumor to other parts of the body (like lymph nodes). Detecting this early is critical for patient prognosis.</p>
                      </section>
                  </div>
              )}

              {activeTab === 'glossary' && (
                  <div className="grid gap-4">
                      {[
                          { t: "CNN (Convolutional Neural Network)", d: "A deep learning model designed specifically for analyzing visual images." },
                          { t: "False Negative", d: "A critical error where the model predicts 'Healthy' but the tissue is actually 'Cancerous'." },
                          { t: "AUC (Area Under Curve)", d: "A performance metric where 1.0 is a perfect model and 0.5 is random guessing." },
                          { t: "Precision vs. Recall", d: "Precision measures how many predicted tumors are actually tumors. Recall measures how many actual tumors the model managed to find." }
                      ].map((item, i) => (
                          <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border">
                              <span className="block text-foreground font-semibold mb-1">{item.t}</span>
                              <span>{item.d}</span>
                          </div>
                      ))}
                  </div>
              )}

              {activeTab === 'faq' && (
                  <div className="space-y-6">
                      <div className="space-y-2">
                          <h4 className="text-foreground font-medium">Can I use this for diagnosis?</h4>
                          <p className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md border border-red-100 dark:border-red-900/30">
                              <strong>Absolutely not.</strong> This is a research decision-support tool only. All findings must be verified by a qualified pathologist.
                          </p>
                      </div>
                      <div className="space-y-2">
                          <h4 className="text-foreground font-medium">How reliable is the AI?</h4>
                          <p>The model is trained on the PatchCamelyon dataset and provides a confidence score for each prediction. However, like all AI systems, it can make errors, particularly on ambiguous tissue samples.</p>
                      </div>
                  </div>
              )}
          </div>
      </div>
    </Modal>
  );
};