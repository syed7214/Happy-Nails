import React, { useState, useEffect } from 'react';
import { Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TESTIMONIALS } from '../data/salonData';

interface TestimonialsCarouselProps {
  onBookService: (serviceId: string) => void;
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  onBookService,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const total = TESTIMONIALS.length;

  // Hands-free automatic cycling every 4.5s
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, total]);

  const current = TESTIMONIALS[activeIndex] || TESTIMONIALS[0];
  // Duplicate array for seamless infinite marquee glide
  const marqueeItems = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div
      className="relative pt-12 sm:pt-16"
      role="region"
      aria-label="Client testimonials and reviews"
    >
      {/* Floating Glass Badge — Top Right */}
      <div className="hidden md:flex items-center gap-2.5 frosted-pill px-4 py-2.5 rounded-2xl absolute -top-3 right-8 z-20 animate-float-slow">
        <div className="flex items-center gap-0.5 text-[#0B3B2E]">
          <Star className="w-3.5 h-3.5 fill-[#0B3B2E]" />
          <Star className="w-3.5 h-3.5 fill-[#0B3B2E]" />
          <Star className="w-3.5 h-3.5 fill-[#0B3B2E]" />
          <Star className="w-3.5 h-3.5 fill-[#0B3B2E]" />
          <Star className="w-3.5 h-3.5 fill-[#0B3B2E]" />
        </div>
        <span className="text-xs font-semibold text-[#0B3B2E] tabular-nums">
          4.9 / 5.0 · 420+ Kingston Guests
        </span>
      </div>

      {/* Main Sanctuary Review Panel */}
      <div
        className="relative z-10 frosted-card rounded-[2.25rem] p-6 sm:p-10 lg:p-12 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Header & Live Auto-Progress Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#0B3B2E]/10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#3F6B58]">
            <span className="uppercase tracking-[0.22em] font-semibold text-[#0B3B2E] inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#3F6B58]" />
              Guest Stories · Live Stream
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-[#0B3B2E]/75">
              Hover any review below to spotlight
            </span>
          </div>

          {/* Hands-Free Auto-Advancing Progress Bars (Hover to switch without clicking) */}
          <div className="flex items-center gap-2" aria-hidden="true">
            {TESTIMONIALS.map((item, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className="h-1.5 rounded-full bg-[#0B3B2E]/15 overflow-hidden cursor-pointer transition-all duration-300"
                  style={{ width: isCurrent ? 44 : 14 }}
                >
                  {isCurrent && (
                    <motion.div
                      key={`${activeIndex}-${isHovered}`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{
                        duration: isHovered ? 0.2 : 4.5,
                        ease: 'linear',
                      }}
                      className="h-full bg-[#0B3B2E] rounded-full"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Auto-Morphing Editorial Spotlight (Compositor-Only Opacity & Y Transform) */}
        <div className="py-8 sm:py-10 min-h-[230px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#3F6B58]">
                  <span className="font-mono text-[#0B3B2E]/60 tabular-nums">
                    0{activeIndex + 1} / 0{total}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[#0B3B2E]">
                    {current.outcomeHighlight}
                  </span>
                </div>

                <blockquote className="font-serif text-2xl sm:text-3xl lg:text-[2.15rem] text-[#0B3B2E] leading-[1.32] italic">
                  “{current.quote}”
                </blockquote>
              </div>

              <div className="lg:col-span-4 lg:border-l border-[#0B3B2E]/10 lg:pl-8 flex flex-col justify-between space-y-5">
                <div className="space-y-1">
                  <p className="font-serif text-2xl font-semibold text-[#0B3B2E]">
                    {current.authorName}
                  </p>
                  <p className="text-xs text-[#0B3B2E]/75">
                    {current.authorContext}
                  </p>
                  <p className="text-xs text-[#3F6B58] pt-0.5 tabular-nums">
                    {current.dateLabel} · {current.visitCount}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F6F0E9]/80 border border-[#0B3B2E]/10 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#3F6B58] font-semibold">
                      {current.serviceName}
                    </p>
                    <p className="text-xs text-[#0B3B2E]/75">
                      By {current.artistName}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBookService(current.serviceId)}
                    className="btn-luxury inline-flex items-center gap-1.5 bg-[#0B3B2E] text-[#F6F0E9] px-4 py-2.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Book</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Continuous Hands-Free Marquee Stream */}
        <div className="pt-6 border-t border-[#0B3B2E]/10 -mx-6 sm:-mx-10 lg:-mx-12 px-6 sm:px-10 lg:px-12 overflow-hidden">
          <div className="animate-marquee gap-5 py-2">
            {marqueeItems.map((item, idx) => {
              const originalIndex = idx % total;
              const isSpotlighted = originalIndex === activeIndex;

              return (
                <div
                  key={`${item.id}-${idx}`}
                  onMouseEnter={() => setActiveIndex(originalIndex)}
                  onClick={() => onBookService(item.serviceId)}
                  className={`w-[300px] sm:w-[340px] shrink-0 rounded-2xl p-5 transition-colors duration-200 cursor-pointer select-none ${
                    isSpotlighted
                      ? 'bg-[#0B3B2E] text-[#F6F0E9] shadow-md'
                      : 'bg-[#F6F0E9]/70 hover:bg-white text-[#0B3B2E] border border-[#0B3B2E]/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] mb-2">
                    <span
                      className={`uppercase tracking-[0.15em] font-semibold ${
                        isSpotlighted ? 'text-[#E9C9BE]' : 'text-[#3F6B58]'
                      }`}
                    >
                      {item.serviceName}
                    </span>
                    <span
                      className={`tabular-nums ${
                        isSpotlighted ? 'text-[#F6F0E9]/70' : 'text-[#0B3B2E]/50'
                      }`}
                    >
                      ★★★★★
                    </span>
                  </div>

                  <p
                    className={`font-serif text-base italic line-clamp-2 mb-3 leading-snug ${
                      isSpotlighted ? 'text-[#F6F0E9]' : 'text-[#0B3B2E]/90'
                    }`}
                  >
                    “{item.quote}”
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-current/10">
                    <span className="font-medium truncate">
                      {item.authorName}
                    </span>
                    <span
                      className={`text-[11px] ${
                        isSpotlighted ? 'text-[#E9C9BE]' : 'text-[#3F6B58]'
                      }`}
                    >
                      Stylist: {item.artistName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
