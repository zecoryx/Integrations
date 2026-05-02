import { useEffect, useRef, useState, useCallback } from "react";
import jsQR from "jsqr";

interface UseQRScannerOptions {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
}

interface UseQRScannerReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isScanning: boolean;
  startScanning: () => Promise<void>;
  stopScanning: () => void;
  error: string | null;
}

export const useQRScanner = ({ onScan, onError }: UseQRScannerOptions): UseQRScannerReturn => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastScannedRef = useRef<string | null>(null);

  const scan = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animFrameRef.current = requestAnimationFrame(scan);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code && code.data !== lastScannedRef.current) {
      lastScannedRef.current = code.data;
      onScan(code.data);
    }

    animFrameRef.current = requestAnimationFrame(scan);
  }, [onScan]);

  const startScanning = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsScanning(true);
      lastScannedRef.current = null;
      animFrameRef.current = requestAnimationFrame(scan);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Kamera xatosi";
      setError(msg);
      onError?.(msg);
    }
  }, [scan, onError]);

  const stopScanning = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsScanning(false);
  }, []);

  useEffect(() => () => stopScanning(), [stopScanning]);

  return { videoRef, canvasRef, isScanning, startScanning, stopScanning, error };
};
