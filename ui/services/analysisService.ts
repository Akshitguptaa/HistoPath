import { AnalysisResult } from '@/types';

const generateFakeHeatmap = (isMetastatic: boolean): string => {
  const canvas = document.createElement('canvas');
  const size = 96; 
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error("Could not get 2D context from canvas");
    return '';
  }

  if (isMetastatic) {
    const centerX = size * (0.4 + Math.random() * 0.2);
    const centerY = size * (0.4 + Math.random() * 0.2);
    const radius = size * (0.3 + Math.random() * 0.15);

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.7)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0)'); 

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  
  return canvas.toDataURL();
};


export const analyzeImage = (base64Image: string): Promise<AnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isMetastatic = Math.random() > 0.5;
      const confidence = 0.75 + Math.random() * 0.24; 

      const heatmapUrl = generateFakeHeatmap(isMetastatic);

      const result: AnalysisResult = {
        prediction: isMetastatic ? 'Metastatic' : 'Non-Metastatic',
        confidence: confidence,
        heatmapUrl: heatmapUrl,
      };

      resolve(result);
    }, 1500 + Math.random() * 1000); 
  });
};