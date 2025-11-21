"use client";

import React from 'react';
import { Modal } from '@/components/ui/modal';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
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
  );
};