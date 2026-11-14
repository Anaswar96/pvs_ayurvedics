"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Testimonial } from "@/lib/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex] || testimonials[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="ayur-card p-6 sm:p-8 flex flex-col justify-between h-full min-h-[340px] relative overflow-hidden bg-white">
      {/* Decorative Quote Icon in background */}
      <Quote className="w-20 h-20 text-emerald-900/5 absolute top-4 right-4 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold tracking-widest text-emerald-800 uppercase">
            Testimonials
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: current.rating || 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#0d3b27] font-serif-ayur mb-4">
          What Our Customers Say
        </h3>

        <blockquote className="text-stone-700 text-sm italic leading-relaxed mb-6 line-clamp-4">
          &ldquo;{current.quote}&rdquo;
        </blockquote>
      </div>

      {/* Author Info & Navigation Controls */}
      <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-emerald-100 border border-emerald-200 flex-shrink-0">
            <Image
              src={current.author_image || "/images/testimonials/anjali.svg"}
              alt={current.author_name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0d3b27] leading-tight">
              {current.author_name}
            </h4>
            <p className="text-[11px] text-stone-500">{current.location}</p>
          </div>
        </div>

        {/* Carousel Prev/Next & Dots */}
        {testimonials.length > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 px-1">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentIndex === idx ? "w-4 bg-[#0d3b27]" : "w-1.5 bg-stone-300"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
