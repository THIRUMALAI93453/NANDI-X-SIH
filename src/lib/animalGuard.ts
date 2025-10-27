// Lightweight on-device guard to ensure only cattle/buffalo images proceed
// Uses TensorFlow.js COCO-SSD to detect "cow" objects. Buffalo often maps to "cow" in COCO.

let modelPromise: Promise<any> | null = null;

async function loadModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      await import('@tensorflow/tfjs');
      const cocoSsd = await import('@tensorflow-models/coco-ssd');
      // Use lite base for smaller, faster model
      const model = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
      return model;
    })();
  }
  return modelPromise;
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('IMAGE_LOAD_FAILED'));
    };
    img.src = url;
  });
}

export type AnimalGuardResult = {
  ok: boolean;
  reason?: string;
  label?: string;
  score?: number;
};

export async function isCattleOrBuffalo(file: File): Promise<AnimalGuardResult> {
  try {
    const [model, img] = await Promise.all([loadModel(), loadImageFromFile(file)]);
    const predictions: Array<{ class: string; score: number }> = await model.detect(img);

    // Accept if any high-confidence prediction is a cow
    const cow = predictions
      .filter(p => p.class.toLowerCase() === 'cow')
      .sort((a, b) => b.score - a.score)[0];

    if (cow && cow.score >= 0.5) {
      return { ok: true, label: 'cow', score: cow.score };
    }

    // Otherwise, reject to be safe (avoid false positives on other animals)
    return { ok: false, reason: 'NON_CATTLE_DETECTED' };
  } catch (e) {
    // On any unexpected failure, be safe and reject
    return { ok: false, reason: e instanceof Error ? e.message : 'UNKNOWN_ERROR' };
  }
}
