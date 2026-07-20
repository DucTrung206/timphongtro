"use client";

import React, { useEffect, useRef } from "react";

interface GSAPScrollManagerProps {
  children?: React.ReactNode;
}

// Helper function to dynamically load script from CDN
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });
}

/**
 * GSAPScrollManager
 * Sets up Lenis Smooth Scroll and links it with GSAP ScrollTrigger via CDN.
 * Bypasses local compile constraints and runs seamlessly on client-side.
 */
export default function GSAPScrollManager({ children }: GSAPScrollManagerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let lenisInst: any = null;
    let ScrollTriggerInst: any = null;

    const initAnimations = async () => {
      try {
        // Load GSAP, ScrollTrigger, and Lenis from CDN
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js");

        const gsap = (window as any).gsap;
        const ScrollTrigger = (window as any).ScrollTrigger;
        const Lenis = (window as any).Lenis;

        if (!gsap || !ScrollTrigger || !Lenis) {
          console.warn("GSAP, ScrollTrigger or Lenis could not be resolved from CDN.");
          return;
        }

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        ScrollTriggerInst = ScrollTrigger;

        // 1. Initialize Lenis Smooth Scroll
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
          infinite: false,
        });

        lenisInst = lenis;

        // Sync Lenis scroll events with ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        // Tell GSAP to use Lenis' requestAnimationFrame loop
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });

        // Disable lag smoothing in GSAP to keep tick alignment perfect
        gsap.ticker.lagSmoothing(0);

        // ====== 2. HERO PARALLAX ANIMATION ======
        const heroBg = document.querySelector(".gsap-hero-bg");
        const heroContent = document.querySelector(".gsap-hero-content");

        if (heroBg) {
          gsap.to(heroBg, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
              trigger: "#hero-section",
              start: "top top",
              end: "bottom top",
              scrub: true
            }
          });
        }

        if (heroContent) {
          gsap.to(heroContent, {
            opacity: 0,
            y: -50,
            ease: "power1.out",
            scrollTrigger: {
              trigger: "#hero-section",
              start: "top top",
              end: "bottom 30%",
              scrub: true
            }
          });
        }

        // ====== 3. STAGGERED CARDS REVEAL ======
        const cardsGrid = document.querySelector(".gsap-cards-grid");
        if (cardsGrid) {
          const cards = cardsGrid.querySelectorAll(".gsap-card-stagger");
          if (cards.length > 0) {
            gsap.fromTo(
              cards,
              {
                opacity: 0,
                y: 60,
                scale: 0.95
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.15,
                scrollTrigger: {
                  trigger: cardsGrid,
                  start: "top 80%",
                  toggleActions: "play none none none"
                }
              }
            );
          }
        }

        // ====== 4. SECTION OVERLAP TRANSITION ======
        const overlapSection = document.querySelector(".gsap-section-overlap");
        if (overlapSection) {
          gsap.fromTo(
            overlapSection,
            {
              clipPath: "ellipse(150% 0% at 50% 100%)",
              y: 100
            },
            {
              clipPath: "ellipse(150% 100% at 50% 50%)",
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: overlapSection,
                start: "top 95%",
                end: "top 60%",
                scrub: true
              }
            }
          );
        }
      } catch (err) {
        console.warn("Failed to initialize GSAP or Lenis from CDN:", err);
      }
    };

    initAnimations();

    // Cleanup on unmount
    return () => {
      if (lenisInst) {
        lenisInst.destroy();
      }
      if (ScrollTriggerInst) {
        ScrollTriggerInst.getAll().forEach((trigger: any) => trigger.kill());
      }
    };
  }, []);

  return (
    <div ref={scrollContainerRef} className="relative w-full">
      {children}
    </div>
  );
}

/**
 * FloatingAccents
 * Pure CSS floating elements for background interest (doesn't hit performance).
 */
export function FloatingAccents() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Sparkle 1 */}
      <div 
        className="absolute top-[15%] left-[8%] w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-500/20 animate-float"
        style={{ animationDelay: "0s", animationDuration: "6s" }}
      >
        <span className="text-blue-500 text-lg opacity-60">🔑</span>
      </div>

      {/* Sparkle 2 */}
      <div 
        className="absolute top-[45%] right-[10%] w-14 h-14 bg-orange-500/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-orange-500/20 animate-float"
        style={{ animationDelay: "2s", animationDuration: "8s" }}
      >
        <span className="text-orange-500 text-xl opacity-60">⭐</span>
      </div>

      {/* Sparkle 3 */}
      <div 
        className="absolute top-[75%] left-[5%] w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-emerald-500/20 animate-float"
        style={{ animationDelay: "4s", animationDuration: "7s" }}
      >
        <span className="text-emerald-500 text-2xl opacity-60">🛡️</span>
      </div>

      {/* Styling for floating keyframe */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
