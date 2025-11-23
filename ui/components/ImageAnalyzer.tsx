"use client";

import React, { useState, useCallback, useRef } from 'react';
import { AnalysisResult } from '@/types';
import { analyzeImage } from '@/services/analysisService';
import { PhotoIcon } from '@/components/icons/PhotoIcon';
import { ExclamationTriangleIcon } from '@/components/icons/ExclamationTriangleIcon';
import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon';
import { Modal } from '@/components/ui/modal';

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

  const [showOverlay, setShowOverlay] = useState(true);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
      setShowOverlay(true);
    }
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setShowOverlay(true);

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
      setShowOverlay(true);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <>
      <div className="flex flex-col bg-linear-to-br from-card/95 to-card/80 backdrop-blur-xl text-card-foreground p-8 rounded-2xl shadow-2xl border border-border/50 space-y-8 overflow-y-scroll transition-all duration-300 hover:shadow-3xl">
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="group flex justify-center items-center w-full min-h-40 px-6 transition-all duration-300 bg-linear-to-br from-muted/40 to-muted/20 border-2 border-border border-dashed rounded-2xl appearance-none cursor-pointer hover:border-brand-primary-500 hover:bg-brand-primary-500/5 focus:outline-none hover:scale-[1.01] active:scale-[0.99]"
        >
          <span className="flex flex-col items-center space-y-2">
            <PhotoIcon className="w-10 h-10 text-muted-foreground/80 group-hover:text-brand-primary-500 transition-all duration-300 group-hover:scale-110" />
            <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center">
              Drop tissue patch, or{' '}
              <span className="text-brand-primary-600 dark:text-brand-primary-400 underline hover:text-brand-primary-700 dark:hover:text-brand-primary-300 font-semibold" onClick={triggerFileSelect}>
                browse
              </span>
            </span>
          </span>
          <input ref={fileInputRef} type="file" name="file_upload" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
        </label>

        {previewUrl && !result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div
              className="relative rounded-2xl overflow-hidden border-2 border-border/50 bg-black/50 shadow-xl flex justify-center max-h-[300px] cursor-zoom-in group"
              onClick={() => setExpandedImage(previewUrl)}
            >
              <img src={previewUrl} alt="Patch preview" className="h-full w-auto object-contain max-h-[300px] transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-white font-medium px-3 py-1 bg-black/50 rounded-full backdrop-blur-sm">Click to expand</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2 p-4 bg-destructive/10 border border-destructive/50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <ExclamationTriangleIcon className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-destructive text-sm font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={handleAnalyzeClick}
          disabled={!image || isLoading}
          className="group relative w-full inline-flex justify-center items-center px-6 py-4 border border-transparent text-base font-semibold rounded-xl shadow-lg text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="animate-pulse">Analyzing Tissue Sample...</span>
            </>
          ) : (
            <>
              <span>Analyze Image</span>
              <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

            <div className={`p-6 rounded-2xl space-y-4 shadow-xl border-2 backdrop-blur-sm ${result.prediction === 'Metastatic'
              ? 'bg-linear-to-br from-destructive/15 to-destructive/5 border-destructive/50'
              : 'bg-linear-to-br from-green-500/15 to-green-500/5 border-green-500/50'
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {result.prediction === 'Metastatic' ? (
                    <div className="p-2 bg-destructive/20 rounded-xl">
                      <ExclamationTriangleIcon className="h-7 w-7 text-destructive" />
                    </div>
                  ) : (
                    <div className="p-2 bg-green-500/20 rounded-xl">
                      <CheckCircleIcon className="h-7 w-7 text-green-500" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Prediction</p>
                    <h3 className={`text-2xl font-bold ${result.prediction === 'Metastatic' ? 'text-destructive' : 'text-green-600'}`}>
                      {result.prediction}
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Confidence</p>
                  <p className="text-2xl font-mono font-bold text-foreground">{Math.round(result.confidence * 100)}%</p>
                </div>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ease-out ${result.prediction === 'Metastatic'
                    ? 'bg-linear-to-r from-destructive to-red-600'
                    : 'bg-linear-to-r from-green-500 to-green-600'
                    } shadow-lg`}
                  style={{ width: `${Math.round(result.confidence * 100)}%` }}
                ></div>
              </div>

              <button
                onClick={() => setShowResultModal(true)}
                className="w-full mt-2 py-2 text-sm font-medium text-brand-primary-600 hover:text-brand-primary-500 hover:bg-brand-primary-500/5 rounded-lg transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                View Detailed Analysis Report
              </button>
            </div>

            {result.gradcam && result.gradcam.overlay && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm font-semibold text-foreground">
                  <div className="w-1 h-4 bg-linear-to-b from-brand-primary-500 to-brand-primary-700 rounded-full" />
                  <span>Grad-CAM Analysis Components</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { title: 'Original', src: result.gradcam.original, color: 'brand-primary' },
                    { title: 'Heatmap', src: result.gradcam.heatmap, color: 'yellow' },
                    { title: 'Overlay', src: result.gradcam.overlay, color: 'purple' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col space-y-2 group cursor-pointer" onClick={() => setExpandedImage(item.src)}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">{item.title}</p>
                      <div className={`relative rounded-xl overflow-hidden border-2 border-border/50 bg-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-${item.color}-500/50 aspect-square`}>
                        <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.gradcam && result.gradcam.overlay && (
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm font-semibold text-foreground">
                    <div className="w-1 h-4 bg-linear-to-b from-brand-primary-500 to-brand-primary-700 rounded-full" />
                    <span>Detailed Inspection</span>
                  </div>
                  <div className="flex bg-muted p-1 rounded-lg">
                    <button
                      onClick={() => setShowOverlay(false)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${!showOverlay ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Original
                    </button>
                    <button
                      onClick={() => setShowOverlay(true)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${showOverlay ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Overlay
                    </button>
                  </div>
                </div>

                <div
                  className="relative rounded-2xl overflow-hidden border-2 border-border/50 bg-black shadow-2xl cursor-zoom-in group"
                  onClick={() => setExpandedImage(showOverlay ? result.gradcam.overlay : result.gradcam.original)}
                >
                  <img
                    src={showOverlay ? result.gradcam.overlay : result.gradcam.original}
                    alt="Detailed View"
                    className="w-full h-auto object-contain min-h-[400px]"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-medium text-white">
                    {showOverlay ? 'Grad-CAM Overlay' : 'Original Image'}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                    <span className="text-white font-medium px-4 py-2 bg-black/50 rounded-full backdrop-blur-sm">Click to expand</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {expandedImage && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setExpandedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setExpandedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={expandedImage}
            alt="Expanded view"
            className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {result && (
        <Modal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          title="Detailed Analysis Report"
          className="max-w-4xl h-[85vh]"
        >
          <div className="p-6 space-y-8">
            <div className={`p-6 rounded-xl border ${result.prediction === 'Metastatic'
              ? 'bg-destructive/5 border-destructive/20'
              : 'bg-green-500/5 border-green-500/20'
              }`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Diagnostic Prediction</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.prediction === 'Metastatic'
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-green-500/10 text-green-600'
                  }`}>
                  {result.prediction}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Confidence Score</span>
                  <span className="font-mono font-medium">{Math.round(result.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${result.prediction === 'Metastatic' ? 'bg-destructive' : 'bg-green-500'
                      }`}
                    style={{ width: `${Math.round(result.confidence * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center">
                <div className="w-1 h-5 bg-brand-primary-500 rounded-full mr-2" />
                Visual Evidence (Grad-CAM)
              </h4>
              <p className="text-sm text-muted-foreground">
                Gradient-weighted Class Activation Mapping (Grad-CAM) highlights the regions of the image that were most important for the model's prediction.
              </p>

              {result.gradcam && result.gradcam.overlay && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-center text-muted-foreground">Original Tissue Patch</p>
                    <div className="rounded-xl overflow-hidden border border-border bg-black/5">
                      <img src={result.gradcam.original} alt="Original" className="w-full h-auto" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-center text-muted-foreground">Heatmap Overlay</p>
                    <div className="rounded-xl overflow-hidden border border-border bg-black/5">
                      <img src={result.gradcam.overlay} alt="Overlay" className="w-full h-auto" />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <p className="text-sm font-medium text-center text-muted-foreground">Activation Heatmap</p>
                    <div className="rounded-xl overflow-hidden border border-border bg-black/5 max-w-md mx-auto">
                      <img src={result.gradcam.heatmap} alt="Heatmap" className="w-full h-auto" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
