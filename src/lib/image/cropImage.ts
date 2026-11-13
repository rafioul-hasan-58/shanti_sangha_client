/**
 * HTML5 Canvas Crop Helper for react-easy-crop
 * Handles pixel-level cropping and resizing (never upscaling)
 */

import type { Area } from "react-easy-crop";

/**
 * Loads an HTMLImageElement asynchronously with crossOrigin support.
 */
export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

/**
 * Crops the image source to an HTMLCanvasElement based on pixelCrop coordinates.
 * Resizes the output so the width is at most `maxWidthPx` (default 800) and never upscales.
 */
export async function getCroppedCanvas(
  imageSrc: string,
  pixelCrop: Area,
  maxWidthPx = 800
): Promise<HTMLCanvasElement> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D rendering context is not available.");
  }

  const sourceWidth = Math.max(1, Math.round(pixelCrop.width));
  const sourceHeight = Math.max(1, Math.round(pixelCrop.height));

  // Determine output dimensions: never upscale beyond source width or maxWidthPx
  let targetWidth = sourceWidth;
  let targetHeight = sourceHeight;

  if (targetWidth > maxWidthPx) {
    const scaleRatio = maxWidthPx / targetWidth;
    targetWidth = maxWidthPx;
    targetHeight = Math.max(1, Math.round(sourceHeight * scaleRatio));
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // High quality interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  return canvas;
}

/**
 * Converts a cropped canvas into a Blob.
 */
export async function getCroppedBlob(
  imageSrc: string,
  pixelCrop: Area,
  maxWidthPx = 800,
  mimeType = "image/webp",
  quality = 0.92
): Promise<Blob> {
  const canvas = await getCroppedCanvas(imageSrc, pixelCrop, maxWidthPx);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob conversion failed."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

/**
 * Converts a cropped canvas into a standard File object.
 */
export async function getCroppedFile(
  imageSrc: string,
  pixelCrop: Area,
  fileName = "profile-cropped.webp",
  maxWidthPx = 800,
  mimeType = "image/webp"
): Promise<File> {
  const blob = await getCroppedBlob(imageSrc, pixelCrop, maxWidthPx, mimeType);
  return new File([blob], fileName, {
    type: blob.type || mimeType,
    lastModified: Date.now(),
  });
}

