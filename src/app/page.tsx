"use client";

import { useEffect, useState, useRef } from "react";
import { Zap, BarChart3, Crosshair, PlusCircle, List } from "lucide-react";
import MapSection from "@/components/map/MapSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoomPostForm, { RoomPostData } from "@/components/landlord/RoomPostForm";
import { RevealOnScroll, ScrollToTopButton } from "@/components/ScrollAnimations";
import HeroSearchBar from "@/components/HeroSearchBar";
import GSAPScrollManager, { FloatingAccents } from "@/components/GSAPScrollManager";

export default function HomePage() {
  const [role, setRole] = useState<string | null>(null);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setRole(localStorage.getItem("currentUserRole"));

    // Listen for header "Đăng phòng" button click
    const handleOpenPostForm = () => setIsPostFormOpen(true);
    window.addEventListener("openPostForm", handleOpenPostForm);
    return () => window.removeEventListener("openPostForm", handleOpenPostForm);
  }, []);

  // Parallax effect for hero section — GPU optimized with rAF
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const hero = heroRef.current;
          if (hero) {
            const rect = hero.getBoundingClientRect();
            // Only calculate when hero is visible
            if (rect.bottom > 0) {
              setParallaxY(window.scrollY * 0.35);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRoomSubmit = (_data: RoomPostData) => {
    // Data is saved to localStorage inside the form component
  };

  return (
    <GSAPScrollManager>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans page-fade-in">
        {/* Header với vị trí hiện tại */}
        <Header />

        {/* Main Content Area — Hero with Parallax */}
        <main
          id="hero-section"
          ref={heroRef}
          className="flex-1 bg-gradient-to-br from-[#0b132b] via-[#10224d] to-[#1a3673] flex flex-col justify-center relative overflow-hidden"
        >
          {/* Floating Accents */}
          <FloatingAccents />
          {/* Background glow effects — parallax layer */}
          <div
            className="absolute inset-0 parallax-hero gsap-hero-bg"
            style={{ transform: `translate3d(0, ${parallaxY * 0.5}px, 0)` }}
          >
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-400 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
        </div>

          <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 w-full flex flex-col items-center text-center z-10 gsap-hero-content">
            
            {/* Centered Content Wrapper */}
            <div className="w-full flex flex-col items-center space-y-10 text-white">
              <RevealOnScroll delay={0} direction="up" distance={50}>
                <h2 className="text-5xl md:text-6.5xl font-extrabold tracking-tight leading-[1.15]">
                  Tìm phòng trọ{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse">
                    gần nhất ngay
                  </span>
                </h2>
              </RevealOnScroll>
              
              <RevealOnScroll delay={150} direction="up" distance={40}>
                <p className="text-lg text-blue-100 max-w-2xl leading-relaxed opacity-90 mx-auto">
                  Định vị chính xác, so sánh giá phòng thực tế, xem đánh giá chi tiết và chỉ đường tối ưu đến phòng trọ. Tiết kiệm thời gian, tiết kiệm chi phí.
                </p>
              </RevealOnScroll>

              <RevealOnScroll className="relative z-30 w-full" delay={300} direction="up" distance={30}>
                {role === 'landlord' ? (
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                    <button
                      onClick={() => setIsPostFormOpen(true)}
                      className="flex items-center justify-center gap-2 bg-[#0E77FF] hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-[0_0_20px_rgba(14,119,255,0.4)] transition-all transform hover:scale-[1.02] btn-glow relative overflow-hidden"
                    >
                      <PlusCircle className="w-5 h-5" />
                      Đăng phòng
                    </button>
                    <button
                      onClick={() => {
                        const el = document.getElementById("map-section");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold backdrop-blur-sm transition-all transform hover:scale-[1.02]"
                    >
                      <List className="w-5 h-5" />
                      Xem phòng đã đăng
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 w-full">
                    <HeroSearchBar />
                  </div>
                )}
              </RevealOnScroll>

              {/* Feature Blocks — Centered and Staggered */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 w-full max-w-3xl mx-auto">
                <RevealOnScroll delay={400} direction="up" distance={30}>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:border-white/20 hover:translate-y-[-2px] flex flex-col items-center text-center">
                    <Crosshair className="w-7 h-7 text-cyan-400 mb-2" />
                    <h3 className="font-semibold text-white mb-1 text-sm">Chính xác</h3>
                    <p className="text-xs text-blue-200">100% định vị</p>
                  </div>
                </RevealOnScroll>
                <RevealOnScroll delay={500} direction="up" distance={30}>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:border-white/20 hover:translate-y-[-2px] flex flex-col items-center text-center">
                    <Zap className="w-7 h-7 text-blue-400 mb-2" />
                    <h3 className="font-semibold text-white mb-1 text-sm">Nhanh</h3>
                    <p className="text-xs text-blue-200">Dữ liệu Real-time</p>
                  </div>
                </RevealOnScroll>
                <RevealOnScroll delay={600} direction="up" distance={30}>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:border-white/20 hover:translate-y-[-2px] flex flex-col items-center text-center">
                    <BarChart3 className="w-7 h-7 text-purple-400 mb-2" />
                    <h3 className="font-semibold text-white mb-1 text-sm">Chi tiết</h3>
                    <p className="text-xs text-blue-200">So sánh mức giá</p>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
      </main>

      {/* Map + Room List Section */}
      <MapSection />

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTopButton />

      {/* Room Post Form Modal */}
      <RoomPostForm
        isOpen={isPostFormOpen}
        onClose={() => setIsPostFormOpen(false)}
        onSubmit={handleRoomSubmit}
      />
      </div>
    </GSAPScrollManager>
  );
}
