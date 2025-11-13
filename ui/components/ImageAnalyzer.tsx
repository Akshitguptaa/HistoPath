"use client"; 

import React, { useState, useCallback, useRef } from 'react';
import { AnalysisResult } from '@/types';
import { analyzeImage } from '@/services/analysisService';
import { PhotoIcon } from '@/components/icons/PhotoIcon';
import { ExclamationTriangleIcon } from '@/components/icons/ExclamationTriangleIcon';
import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon';

interface ImageAnalyzerProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Image = await toBase64(image);
      const analysisResult = await analyzeImage(base64Image);
      setResult(analysisResult);
      onAnalysisComplete(analysisResult);
    } catch (err) {
      setError('Failed to analyze the image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [image, onAnalysisComplete]);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col bg-card text-card-foreground p-6 rounded-lg shadow-md border border-border space-y-4 h-full overflow-y-scroll">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex justify-center items-center w-full min-h-48 px-4 transition bg-muted/50 border-2 border-border border-dashed rounded-md appearance-none cursor-pointer hover:border-brand-primary-400 focus:outline-none"
      >
        <span className="flex items-center space-x-2">
           <PhotoIcon className="w-8 h-8 text-muted-foreground/80" />
          <span className="font-medium text-muted-foreground">
            Drop patch image here, or{' '}
            <span className="text-brand-primary-600 dark:text-brand-primary-400 underline" onClick={triggerFileSelect}>browse</span>
          </span>
        </span>
        <input ref={fileInputRef} type="file" name="file_upload" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
      </label>

      {previewUrl && (
        <div className="relative rounded-lg overflow-hidden border border-border">
          {/* 3. 'object-contain' is CORRECT. It ensures the
               full image is shown, scaled to fit the width.
           */}
          <img src={previewUrl} alt="Patch preview" className="w-full object-contain" />
          {result && (
            <img 
              src={result.heatmapUrl} 
              alt="Heatmap" 
              className="absolute top-0 left-0 w-full h-full object-contain opacity-50 mix-blend-multiply" 
            />
          )}
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}
      
      <button
        onClick={handleAnalyzeClick}
        disabled={!image || isLoading}
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary-600 hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900"
      >
        {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8
0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
            </>
        ) : 'Analyze Image'}
      </button>

      {result && (
        <div className={`p-4 rounded-lg space-y-3 ${
            result.prediction === 'Metastatic' 
            ? 'bg-destructive/10 border border-destructive/50' 
            : 'bg-green-500/10 border border-green-500/50'
        }`}>
          <div className="flex items-center space-x-2">
            {result.prediction === 'Metastatic' ? (
                <ExclamationTriangleIcon className="h-6 w-6 text-destructive" />
            ) : (
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
            )}
            <h3 className="text-lg font-semibold text-card-foreground">Analysis Result</h3>
          </div>

          <div>
             <p className="text-sm text-muted-foreground">Prediction</p>
             <p className={`text-2xl font-bold ${result.prediction === 'Metastatic' ? 'text-destructive' : 'text-green-600'}`}>
                {result.prediction}
             </p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Confidence</p>
            <div className="flex items-center space-x-2">
                <div className="w-full bg-muted rounded-full h-2.5">
                    <div className={`${result.prediction === 'Metastatic' ? 'bg-destructive' : 'bg-green-500'} h-2.5 rounded-full`} style={{ width: `${Math.round(result.confidence * 100)}%` }}></div>
                </div>
                <span className="font-mono text-sm text-foreground w-12 text-right">{Math.round(result.confidence * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};