"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, MapPin } from "lucide-react";

export default function ImageSlider({ images, onExpand }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
        <MapPin size={48} className="mb-2 opacity-50" />
        <span className="text-sm font-medium">No images</span>
      </div>
    );
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const hasMultiple = images.length > 1;

  return (
    <div className="relative w-full h-full bg-gray-100 group overflow-hidden">
      <img
        src={images[currentIndex]}
        alt="Space"
        className="w-full h-full object-cover transition-opacity duration-300"
      />
      
      {/* Expand Button */}
      {onExpand && (
        <button
          onClick={(e) => { e.stopPropagation(); onExpand(images, currentIndex); }}
          className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 hover:bg-black/80 transition-all z-10"
          title="See Full Size"
        >
          <Maximize2 size={16} />
        </button>
      )}

      {/* Navigation Controls */}
      {hasMultiple && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110 transition-all z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110 transition-all z-10"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                  idx === currentIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
