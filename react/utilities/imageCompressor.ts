// @ts-nocheck

// This file contains utility functions for image compression.

// This utility relies on the 'browser-image-compression' library.
// Ensure it is installed in your project:
// `npm install browser-image-compression` or `yarn add browser-image-compression`
import imageCompression from 'browser-image-compression';

interface ImageCompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  maxIteration?: number;
  exifOrientationFn?: Function;
  fileType?: string;
  onProgress?: Function;
  signal?: AbortSignal;
}

// Compresses an image file according to the given options.

// @param imageFile The image file (File or Blob) to compress.
// @param options Compression options like maxSizeMB, maxWidthOrHeight, etc.
// @returns A promise that resolves with the compressed image file (Blob).
export const compressImage = async (
  imageFile: File | Blob,
  options: ImageCompressionOptions = {
    maxSizeMB: 1, // (max file size in MB)
    maxWidthOrHeight: 1920, // (max width or height)
    useWebWorker: true, // (use web worker for faster compression)
  }
): Promise<File | Blob> => {
  try {
    const compressedFile = await imageCompression(imageFile as File, options);
    return compressedFile;
  } catch (error) {
    console.error('Error during image compression:', error);
    throw error;
  }
};