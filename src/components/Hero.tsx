import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ThreeDCore } from './ThreeDCore';
import { TiltCard3D } from './TiltCard3D';

interface HeroProps {
  onStart: () => void;
  onSeeHowItWorks: () => void;
  themeColor?: string;
}

export const Hero: React.FC<HeroProps> = ({ onStart, onSeeHowItWorks, themeColor }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  // Cinematic video controller with 0.5s fade-in, 0.5s fade-out, 100ms reset
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animFrameId: number;
    let isTransitioning = false;

    const checkVideoFades = () => {
      if (video.duration && !isTransitioning) {
        const currentTime = video.currentTime;
        const duration = video.duration;

        // 0.5s fade-in at start
        if (currentTime < 0.5) {
          const opacity = Math.min(0.2, (currentTime / 0.5) * 0.2);
          video.style.opacity = opacity.toString();
        }
        // 0.5s fade-out before end
        else if (duration - currentTime <= 0.5) {
          const remaining = duration - currentTime;
          const opacity = Math.max(0, (remaining / 0.5) * 0.2);
          video.style.opacity = opacity.toString();
        }
        // Steady state: low visual dominance
        else {
          video.style.opacity = '0.2';
        }

        // Loop reset 0.1s before end to ensure 100ms pause replay
        if (duration - currentTime <= 0.05) {
          isTransitioning = true;
          video.style.opacity = '0';
          setTimeout(() => {
            video.currentTime = 0;
            video.play().catch(() => {});
            isTransitioning = false;
          }, 100);
        }
      }

      animFrameId = requestAnimationFrame(checkVideoFades);
    };

    animFrameId = requestAnimationFrame(checkVideoFades);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [videoLoaded]);

  const activeColor = themeColor || '#0a0a0a';

  return (
    <section className="relative min-h-[calc(100vh-140px)] flex flex-col justify-center items-center px-6 sm:px-8 py-16 sm:py-24 overflow-hidden bg-white">
      {/* Subtle Background Video Layer */}
      {!videoFailed && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            loop
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoFailed(true)}
            className="w-full h-full object-cover opacity-0 transition-opacity duration-500 scale-105 filter grayscale contrast-75 brightness-110"
            style={{ willChange: 'opacity' }}
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-in-slow-motion-41221-large.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white" />
        </div>
      )}

      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="max-w-6xl mx-auto h-full border-x border-editorial-borderSubtle flex justify-between">
          <div className="w-[1px] h-full bg-editorial-borderSubtle/60 hidden md:block" />
          <div className="w-[1px] h-full bg-editorial-borderSubtle/60 hidden md:block" />
        </div>
      </div>

      {/* Interactive 3D WebGL Reasoning Core Ambient Background Position */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-75 pointer-events-none scale-125 sm:scale-150">
        <ThreeDCore themeColor={themeColor} />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center my-auto">
        {/* Subtle Category Pill */}
        <div className="animate-fade-rise mb-6">
          <div
            className="inline-flex items-center gap-2 border bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-sans tracking-widest uppercase shadow-2xs transition-colors duration-300"
            style={{
              borderColor: themeColor ? `${themeColor}40` : '#e2e0d8',
              color: themeColor || '#404040',
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: activeColor }}
            />
            <span className="font-medium">Reverse Verification Protocol</span>
          </div>
        </div>

        {/* Large Editorial Headline - Harmonized entirely with themeColor */}
        <h1
          className="animate-fade-rise font-serif text-5xl sm:text-7xl md:text-8xl leading-[1.04] tracking-tight mb-8 max-w-3xl transition-colors duration-500"
          style={{ color: activeColor }}
        >
          <span className="italic font-normal opacity-75">Don’t ask AI</span>{' '}
          <span className="opacity-90">if you understand.</span>
          <br />
          <span className="font-normal italic tracking-normal">
            Prove it.
          </span>
        </h1>

        {/* Supporting Statement */}
        <p
          className="animate-fade-rise-delay font-sans text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mb-12 transition-colors duration-300"
          style={{
            color: themeColor ? `${themeColor}cc` : '#525252',
          }}
        >
          Explain a concept in your own words. ExplainItBack analyzes your reasoning,
          finds what you’re missing, and challenges you where your understanding breaks.
        </p>

        {/* Action Buttons with 3D Tilt */}
        <div className="animate-fade-rise-delay-2 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <TiltCard3D maxTilt={6} scale={1.03}>
            <button
              onClick={onStart}
              style={{ backgroundColor: activeColor }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-white text-sm font-medium tracking-wide uppercase px-8 py-4 rounded-sm hover:opacity-90 transition-all active:scale-[0.98] shadow-md group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 opacity-90" />
              <span>Test my understanding</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </TiltCard3D>

          <TiltCard3D maxTilt={6} scale={1.03}>
            <button
              onClick={onSeeHowItWorks}
              style={{
                borderColor: themeColor ? `${themeColor}60` : '#d4d2cb',
                color: activeColor,
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border bg-white/80 backdrop-blur-sm text-sm font-medium tracking-wide px-7 py-4 rounded-sm hover:bg-white transition-all active:scale-[0.98] shadow-2xs cursor-pointer"
            >
              <span>See how it works</span>
            </button>
          </TiltCard3D>
        </div>
      </div>
    </section>
  );
};
