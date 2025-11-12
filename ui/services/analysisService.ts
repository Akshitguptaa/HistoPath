import { AnalysisResult } from '@/types';
export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> =>{ 
  
  const base64Response = await fetch(base64Image);
  const blob = await base64Response.blob();

  const formData = new FormData();
  formData.append('file', blob, 'image.jpg');

  try {
    const response = await fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze image');
    }

    const result: AnalysisResult = await response.json();
    
    if (!result.heatmapUrl) {
      result.heatmapUrl = generateFakeHeatmap(result.prediction === 'Metastatic');
    }

    return result;

  } catch (error) {
    console.error("Error calling analysis API:", error);
    throw new Error('Failed to connect to the analysis service.');
  }
};

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