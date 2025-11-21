"use client";

import React from 'react';
import { Modal } from '@/components/ui/modal';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Model Performance Statistics"
      className="max-w-3xl"
    >
      <div className="p-6 space-y-8">
        
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-brand-primary-600 flex items-center">
            1. ROC Curve (Receiver Operating Characteristic)
          </h4>
          <div className="p-4 bg-muted/30 rounded-lg border border-border flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 bg-white rounded-md overflow-hidden shadow-sm">
                <img src="/roc_curve.png" alt="ROC Curve Graph" className="w-full h-auto object-cover" />
            </div>
            <div className="w-full md:w-1/2 text-sm text-muted-foreground leading-relaxed">
              <p>
                The <strong>ROC Curve</strong> illustrates the diagnostic ability of the binary classifier system.
              </p>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>It plots the <strong>True Positive Rate</strong> (Sensitivity) against the <strong>False Positive Rate</strong> (1 - Specificity).</li>
                <li>The <strong>AUC (Area Under the Curve)</strong> represents the overall performance. An AUC of 1.0 is perfect, while 0.5 is random guessing.</li>
                <li>Our model targets a high AUC to ensure it catches metastasis without raising too many false alarms.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-brand-primary-600 flex items-center">
            2. Confusion Matrix
          </h4>
          <div className="p-4 bg-muted/30 rounded-lg border border-border flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 bg-white rounded-md overflow-hidden shadow-sm">
                <img src="/confusion_matrix.png" alt="Confusion Matrix" className="w-full h-auto object-cover" />
            </div>
            <div className="w-full md:w-1/2 text-sm text-muted-foreground leading-relaxed">
              <p>
                The <strong>Confusion Matrix</strong> provides a detailed breakdown of the model's predictions on the test set.
              </p>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li><strong>True Positives (TP):</strong> Correctly identified metastatic tissue.</li>
                <li><strong>True Negatives (TN):</strong> Correctly identified healthy tissue.</li>
                <li><strong>False Negatives (FN):</strong> Cancerous tissue missed by the model (Critical error).</li>
                <li><strong>False Positives (FP):</strong> Healthy tissue incorrectly flagged as cancer.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-brand-primary-600 flex items-center">
            3. Predicted Probability Distribution
          </h4>
          <div className="p-4 bg-muted/30 rounded-lg border border-border flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 bg-white rounded-md overflow-hidden shadow-sm">
                <img src="/predicted_probability.png" alt="Predicted Probability" className="w-full h-auto object-cover" />
            </div>
            <div className="w-full md:w-1/2 text-sm text-muted-foreground leading-relaxed">
              <p>
                This histogram shows the distribution of the model's <strong>confidence scores</strong>.
              </p>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>The X-axis represents the predicted probability of being metastatic (0 to 1).</li>
                <li>A strong model will have peaks near <strong>0 (Confident Normal)</strong> and <strong>1 (Confident Tumor)</strong>.</li>
                <li>Predictions in the middle (0.4 - 0.6) indicate uncertainty, where human review is most critical.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </Modal>
  );
};