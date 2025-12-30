import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model: mobilenet.MobileNet | null = null;

export async function loadModel() {
  if (!model) {
    model = await mobilenet.load();
  }
  return model;
}

export async function detectTrash(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<boolean> {
  const net = await loadModel();
  const predictions = await net.classify(imageElement);
  
  // MobileNet won't have a "trash" class specifically in many cases, 
  // but we can look for keywords or simulate the logic for the mockup.
  // In a real scenario, we'd use a custom model.
  const trashKeywords = ['trash', 'garbage', 'waste', 'plastic', 'bottle', 'scrap', 'junk', 'refuse', 'litter'];
  
  console.log('Predictions:', predictions);
  
  return predictions.some(p => 
    trashKeywords.some(k => p.className.toLowerCase().includes(k)) || p.probability > 0.5
  );
}

export async function verifyCleanliness(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<boolean> {
  const net = await loadModel();
  const predictions = await net.classify(imageElement);
  
  // For "clean", we look for absence of trash or presence of "pavement", "street", "park", etc.
  const trashKeywords = ['trash', 'garbage', 'waste', 'junk'];
  const isTrashPresent = predictions.some(p => 
    trashKeywords.some(k => p.className.toLowerCase().includes(k)) && p.probability > 0.2
  );
  
  return !isTrashPresent;
}
