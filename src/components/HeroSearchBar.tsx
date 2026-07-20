"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, DollarSign, Home, ChevronDown } from "lucide-react";
import { PRICE_RANGES, ROOM_TYPE_OPTIONS } from "./map/RoomFilter";

interface HeroSearchBarProps {
  onSearch?: (searchData: {
    address: string;
    priceRange: string;
    roomType: string;
  }) => void;
}

/**
 * Airbnb-style Hero Search Bar Component
 * Designed with modern minimalist glassmorphism, responsive, and highly interactive.
 */
export default function HeroSearchBar({ onSearch }: HeroSearchBarProps) {
  const [address, setAddress] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [roomType, setRoomType] = useState("all");
  
  // Dropdown open states
  const [priceOpen, setPriceOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  const priceRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (priceRef.current && !priceRef.current.contains(event.target as Node)) {
        setPriceOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setTypeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        address,
        priceRange,
        roomType,
      });
    } else {
      // Default behavior: dispatch custom event to alert MapSection filters
      const filterEvent = new CustomEvent("heroSearchApplied", {
        detail: { address, priceRange, roomType },
      });
      window.dispatchEvent(filterEvent);

      // Scroll smoothly to list section
      const mapSection = document.getElementById("map-section");
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Find active label for Price Range display
  const activePriceLabel = PRICE_RANGES.find(r => r.key === priceRange)?.label || "Tất cả mức giá";

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl sm:rounded-full p-2 sm:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(14,119,255,0.15)] font-sans"
    >
      {/* 1. Ô Nhập Địa Chỉ */}
      <div className="flex-1 min-w-[200px] flex items-center gap-3 px-4 py-3 sm:py-2 rounded-2xl sm:rounded-full hover:bg-gray-100/80 transition-all group cursor-text">
        <MapPin className="w-5 h-5 text-blue-600 shrink-0 transition-transform group-hover:scale-110" />
        <div className="flex-1 flex flex-col text-left">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Địa điểm</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Bạn muốn tìm phòng ở đâu?"
            className="bg-transparent border-none outline-none text-sm text-gray-800 font-semibold placeholder-gray-400 p-0 focus:ring-0 w-full"
          />
        </div>
      </div>

      <div className="hidden sm:block w-[1px] h-8 bg-gray-200" />

      {/* 2. Dropdown Chọn Mức Giá */}
      <div
        ref={priceRef}
        className="relative min-w-[170px] flex items-center justify-between gap-3 px-4 py-3 sm:py-2 rounded-2xl sm:rounded-full hover:bg-gray-100/80 transition-all cursor-pointer select-none"
        onClick={() => setPriceOpen(!priceOpen)}
      >
        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-orange-500 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mức giá</span>
            <span className="text-sm text-gray-800 font-semibold truncate max-w-[130px]">
              {activePriceLabel}
            </span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${priceOpen ? "rotate-180" : ""}`} />

        {/* Dropdown Menu */}
        {priceOpen && (
          <div className="absolute top-[115%] left-0 right-0 sm:min-w-[220px] bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {PRICE_RANGES.map((range) => (
              <button
                key={range.key}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPriceRange(range.key);
                  setPriceOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-gray-50 ${
                  priceRange === range.key ? "text-blue-600 bg-blue-50/50" : "text-gray-700"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hidden sm:block w-[1px] h-8 bg-gray-200" />

      {/* 3. Dropdown Chọn Loại Phòng */}
      <div
        ref={typeRef}
        className="relative min-w-[170px] flex items-center justify-between gap-3 px-4 py-3 sm:py-2 rounded-2xl sm:rounded-full hover:bg-gray-100/80 transition-all cursor-pointer select-none"
        onClick={() => setTypeOpen(!typeOpen)}
      >
        <div className="flex items-center gap-3">
          <Home className="w-5 h-5 text-blue-500 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Loại phòng</span>
            <span className="text-sm text-gray-800 font-semibold truncate max-w-[130px]">
              {roomType === "all" ? "Tất cả" : roomType}
            </span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${typeOpen ? "rotate-180" : ""}`} />

        {/* Dropdown Menu */}
        {typeOpen && (
          <div className="absolute top-[115%] left-0 right-0 sm:min-w-[220px] bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRoomType("all");
                setTypeOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-gray-50 ${
                roomType === "all" ? "text-blue-600 bg-blue-50/50" : "text-gray-700"
              }`}
            >
              Tất cả loại phòng
            </button>
            {ROOM_TYPE_OPTIONS.map((type) => (
              <button
                key={type}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setRoomType(type);
                  setTypeOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-gray-50 ${
                  roomType === type ? "text-blue-600 bg-blue-50/50" : "text-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Nút Tìm Kiếm */}
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl sm:rounded-full py-4 sm:py-3.5 px-6 sm:px-8 flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all w-full sm:w-auto"
      >
        <Search className="w-5 h-5 shrink-0" />
        <span className="sm:inline">Tìm kiếm</span>
      </button>
    </form>
  );
}
