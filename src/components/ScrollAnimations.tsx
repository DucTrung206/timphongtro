"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

// ============================================
// 1. useScrollReveal — Hook dùng IntersectionObserver
//    Hiệu suất cao (GPU compositing), không dùng scroll event listener
// ============================================
export function useScrollReveal(options?: {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options?.triggerOnce !== false) {
            observer.unobserve(el);
          }
        } else if (options?.triggerOnce === false) {
          setIsVisible(false);
        }
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? "0px 0px -60px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin, options?.triggerOnce]);

  return { ref, isVisible };
}

// ============================================
// 2. RevealOnScroll — Component wrapper cho fade-in-up
// ============================================
interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
  direction?: "up" | "down" | "left" | "right";
  distance?: number; // px
  duration?: number; // ms
}

export function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 40,
  duration = 700,
}: RevealOnScrollProps) {
  const { ref, isVisible } = useScrollReveal();

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case "up": return `translateY(${distance}px)`;
        case "down": return `translateY(-${distance}px)`;
        case "left": return `translateX(${distance}px)`;
        case "right": return `translateX(-${distance}px)`;
      }
    }
    return "translate(0, 0)";
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

// ============================================
// 3. StaggeredGrid — Lưới hiệu ứng stagger cho room cards
//    Mỗi card hiện ra lần lượt với delay tăng dần
// ============================================
interface StaggeredGridProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number; // ms giữa mỗi item
  itemClassName?: string;
}

export function StaggeredGrid({
  children,
  className = "",
  staggerDelay = 100,
  itemClassName = "",
}: StaggeredGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll("[data-stagger-item]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(
              (entry.target as HTMLElement).dataset.staggerIndex
            );
            // Delay based on index for stagger effect
            setTimeout(() => {
              setVisibleItems((prev) => new Set(prev).add(index));
            }, index * staggerDelay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [children.length, staggerDelay]);

  return (
    <div ref={containerRef} className={className}>
      {React.Children.map(children, (child, i) => (
        <div
          data-stagger-item
          data-stagger-index={i}
          className={itemClassName}
          style={{
            opacity: visibleItems.has(i) ? 1 : 0,
            transform: visibleItems.has(i)
              ? "translateY(0) scale(1)"
              : "translateY(30px) scale(0.97)",
            transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)`,
            willChange: "opacity, transform",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// ============================================
// 4. ScrollToTopButton — Nút cuộn lên đầu trang
//    Hiện ra khi cuộn > 500px, có hiệu ứng pulse khi hover
// ============================================
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Cuộn lên đầu trang"
      className="scroll-to-top-btn"
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 900,
        width: "52px",
        height: "52px",
        borderRadius: "16px",
        border: "none",
        background: "linear-gradient(135deg, #0E77FF 0%, #3b82f6 100%)",
        color: "white",
        boxShadow: visible
          ? "0 8px 32px rgba(14, 119, 255, 0.35), 0 0 0 0 rgba(14, 119, 255, 0)"
          : "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transform: visible
          ? isHovered
            ? "translateY(-4px) scale(1.08)"
            : "translateY(0) scale(1)"
          : "translateY(20px) scale(0.8)",
        pointerEvents: visible ? "auto" : "none",
        transition:
          "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease",
        animation: isHovered ? "scrollTopPulse 1.5s ease-in-out infinite" : "none",
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}

// ============================================
// 5. RippleButton — Component nút bấm với hiệu ứng Ripple
// ============================================
interface RippleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  rippleColor?: string;
}

export function RippleButton({
  children,
  rippleColor = "rgba(255, 255, 255, 0.4)",
  className = "",
  onClick,
  ...props
}: RippleButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: ${rippleColor};
      border-radius: 50%;
      transform: scale(0);
      animation: rippleAnim 0.6s ease-out forwards;
      pointer-events: none;
    `;

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);

    onClick?.(e);
  };

  return (
    <button
      ref={btnRef}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
