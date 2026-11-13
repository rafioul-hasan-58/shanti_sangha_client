"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { X, Plus, Minus, Check, RotateCcw } from "lucide-react";
import { DEFAULT_ASPECT_RATIO } from "@/lib/image/compress";

export interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  aspectRatio?: number;
  onClose: () => void;
  onConfirm: (croppedAreaPixels: Area) => void;
  isProcessing?: boolean;
}

export function ImageCropModal({
  isOpen,
  imageSrc,
  aspectRatio = DEFAULT_ASPECT_RATIO,
  onClose,
  onConfirm,
  isProcessing = false,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Reset coordinates whenever modal opens or imageSrc changes
  useEffect(() => {
    if (isOpen) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      previousActiveElement.current = document.activeElement as HTMLElement | null;

      // Trap initial focus inside modal
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }, 50);
    } else {
      // Restore focus on close
      previousActiveElement.current?.focus();
    }
  }, [isOpen, imageSrc]);

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, currentCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(currentCroppedAreaPixels);
    },
    []
  );

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(3, Number((prev + 0.1).toFixed(2))));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(1, Number((prev - 0.1).toFixed(2))));
  }, []);

  const handleReset = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const handleConfirm = useCallback(() => {
    if (croppedAreaPixels && !isProcessing) {
      onConfirm(croppedAreaPixels);
    }
  }, [croppedAreaPixels, isProcessing, onConfirm]);

  // Keyboard navigation & Shortcuts (Esc, Enter, +/-, Arrow keys)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus Trap logic
      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length > 0) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Enter" && !e.shiftKey) {
        // Prevent enter on cancel or reset from triggering confirm
        const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (targetTag !== "button") {
          e.preventDefault();
          handleConfirm();
        }
        return;
      }

      // Zoom keys
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoomIn();
        return;
      }
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        handleZoomOut();
        return;
      }

      // Arrow keys to nudge image crop position
      const STEP_PX = 10;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCrop((prev) => ({ ...prev, y: prev.y - STEP_PX }));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setCrop((prev) => ({ ...prev, y: prev.y + STEP_PX }));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCrop((prev) => ({ ...prev, x: prev.x - STEP_PX }));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCrop((prev) => ({ ...prev, x: prev.x + STEP_PX }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleConfirm, handleZoomIn, handleZoomOut]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm transition-opacity duration-200"
    >
      <div
        ref={modalRef}
        className="w-full h-full sm:h-auto sm:max-h-[94vh] sm:max-w-xl sm:rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-100 flex flex-col shadow-2xl overflow-hidden motion-reduce:transition-none transition-all duration-200"
      >
        {/* Header: Close (X) on left, Title in the center */}
        <header className="relative flex items-center justify-between px-4 py-3.5 border-b border-neutral-800 bg-neutral-900/90 z-20">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            aria-label="Close modal / বন্ধ করুন"
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705]"
          >
            <X className="w-5 h-5" />
          </button>

          <h2
            id="crop-modal-title"
            className="absolute left-1/2 -translate-x-1/2 text-center text-sm sm:text-base font-semibold text-neutral-100 select-none leading-relaxed px-12"
          >
            Drag the image to adjust / ছবি সরিয়ে ঠিক করুন
          </h2>

          <div className="w-9" aria-hidden="true" />
        </header>

        {/* Crop Area */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[420px] bg-neutral-950 overflow-hidden select-none">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            cropShape="rect"
            showGrid={true}
            zoomWithScroll={true}
            minZoom={1}
            maxZoom={3}
            zoomSpeed={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteCallback}
            classes={{
              containerClassName: "w-full h-full",
              cropAreaClassName:
                "!border-2 !border-[#f2b705] !rounded-lg !shadow-[0_0_0_9999px_rgba(0,0,0,0.72)]",
            }}
          />

          {/* Round + and − buttons on the right side */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3 || isProcessing}
              aria-label="Zoom in / জুম বড় করুন"
              title="Zoom in (+)"
              className="w-10 h-10 rounded-full bg-neutral-900/90 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center border border-white/20 shadow-lg backdrop-blur-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705] active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 1 || isProcessing}
              aria-label="Zoom out / জুম ছোট করুন"
              title="Zoom out (-)"
              className="w-10 h-10 rounded-full bg-neutral-900/90 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center border border-white/20 shadow-lg backdrop-blur-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705] active:scale-95"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slim Zoom Slider */}
        <div className="px-5 py-2.5 bg-neutral-900 border-t border-neutral-800/80 flex items-center gap-3 select-none">
          <span className="text-xs font-medium text-neutral-400">1x</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            disabled={isProcessing}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Zoom slider / জুম নিয়ন্ত্রণ"
            className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#f2b705] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705]"
          />
          <span className="text-xs font-medium text-neutral-400">3x</span>
          <span className="text-xs font-mono font-semibold text-[#f2b705] min-w-[36px] text-right">
            {zoom.toFixed(1)}x
          </span>
        </div>

        {/* Footer Actions: Reset on left, Cancel and Round Confirm on right */}
        <footer className="px-4 py-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isProcessing}
            aria-label="Reset position and zoom / অবস্থান রিসেট করুন"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705]"
          >
            <RotateCcw className="w-4 h-4 text-[#f2b705]" />
            <span>Reset / রিসেট</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705]"
            >
              Cancel / বাতিল
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!croppedAreaPixels || isProcessing}
              aria-label="Confirm crop and proceed / ক্রপ নিশ্চিত করুন"
              title="Confirm (Enter)"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#006a4e] hover:bg-[#004d38] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705]"
            >
              <Check className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
