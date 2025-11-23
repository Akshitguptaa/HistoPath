import { AnalysisResult } from '@/types';

export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {

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
    return result;

  } catch (error) {
    console.error("Error calling analysis API:", error);
    throw new Error('Failed to connect to the analysis service.');
  }
};