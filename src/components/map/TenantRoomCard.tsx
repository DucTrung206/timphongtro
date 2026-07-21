"use client";

import {
  MapPin,
  DollarSign,
  Phone,
  Eye,
  CheckCircle2,
  XCircle,
  Bed,
  Wifi,
  Tv,
  Sofa,
  Wind,
  Droplets,
  Car,
  Shield,
  Home,
  Sparkles,
  WashingMachine,
  UtensilsCrossed,
  ImageIcon,
  X,
  Star,
  ShieldCheck,
  Navigation,
  MessageCircle,
  Heart,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { RoomPostData } from "@/components/landlord/RoomPostForm";

// Map furniture/amenity keys to labels + icons
const ITEM_MAP: Record<string, { label: string; icon: typeof Bed }> = {
  bed: { label: "Giường, nệm", icon: Bed },
  wardrobe: { label: "Tủ quần áo", icon: Home },
  desk: { label: "Bàn làm việc", icon: Sofa },
  sofa: { label: "Sofa", icon: Sofa },
  fridge: { label: "Tủ lạnh", icon: CheckCircle2 },
  washing: { label: "Máy giặt", icon: WashingMachine },
  tv: { label: "Tivi", icon: Tv },
  kitchen: { label: "Bếp / Nấu ăn", icon: UtensilsCrossed },
  wifi: { label: "Wifi", icon: Wifi },
  ac: { label: "Điều hoà", icon: Wind },
  hotwater: { label: "Nước nóng", icon: Droplets },
  parking: { label: "Để xe", icon: Car },
  security: { label: "An ninh 24/7", icon: Shield },
  elevator: { label: "Thang máy", icon: Home },
  balcony: { label: "Ban công", icon: Home },
  pet: { label: "Thú cưng", icon: Sparkles },
};

interface TenantRoomCardProps {
  room: RoomPostData;
}

export default function TenantRoomCard({ room }: TenantRoomCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [heartAnimate, setHeartAnimate] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Check if room is favorited on mount
  useEffect(() => {
    const favorites: number[] = JSON.parse(localStorage.getItem("favoriteRooms") || "[]");
    if (room.id !== undefined && favorites.includes(room.id)) {
      setIsFavorited(true);
    }
  }, [room.id]);

  const toggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (room.id === undefined) return;

    const favorites: number[] = JSON.parse(localStorage.getItem("favoriteRooms") || "[]");
    let newFavorites: number[];

    if (favorites.includes(room.id)) {
      newFavorites = favorites.filter((id) => id !== room.id);
      setIsFavorited(false);
    } else {
      newFavorites = [...favorites, room.id];
      setIsFavorited(true);
      setHeartAnimate(true);
      setTimeout(() => setHeartAnimate(false), 600);
    }

    localStorage.setItem("favoriteRooms", JSON.stringify(newFavorites));
    window.dispatchEvent(new Event("favoritesUpdated"));
  }, [room.id]);

  const handleCopyPhone = () => {
    if (room.phone) {
      navigator.clipboard.writeText(room.phone);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  const isAvailable = room.status === "available";
  const allItems = [...(room.furniture || []), ...(room.amenities || [])];

  return (
    <>
      {/* ===== CARD ===== */}
      <div
        onClick={() => setIsDetailOpen(true)}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden room-card-hover group flex flex-col cursor-pointer"
      >
        {/* Ảnh phòng */}
        <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
          {room.images && room.images.length > 0 ? (
            <img
              src={room.images[0]}
              alt={room.roomType || "Phòng trọ"}
              className="w-full h-full object-cover room-card-image"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-400">
              <ImageIcon className="w-10 h-10 mb-2" />
              <span className="text-xs font-medium">Chưa có ảnh</span>
            </div>
          )}

          {/* Badge count ảnh */}
          {room.images && room.images.length > 1 && (
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              {room.images.length} ảnh
            </span>
          )}

          {/* Trạng thái */}
          <span
            className={`absolute top-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm ${
              isAvailable
                ? "bg-green-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            {isAvailable ? "Còn phòng" : "Hết phòng"}
          </span>

          {/* Loại phòng */}
          {room.roomType && (
            <span className="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-lg bg-white/90 text-gray-700 backdrop-blur-sm shadow-sm">
              {room.roomType}
            </span>
          )}

          {/* Nút yêu thích */}
          <button
            onClick={toggleFavorite}
            className={`absolute bottom-2 left-2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
              isFavorited
                ? "bg-red-500 text-white scale-100"
                : "bg-white/90 text-gray-500 hover:text-red-500 hover:bg-white"
            } ${heartAnimate ? "animate-[heartBeat_0.6s_ease-in-out]" : ""}`}
            title={isFavorited ? "Bỏ lưu" : "Lưu phòng"}
            aria-label={isFavorited ? "Bỏ lưu phòng" : "Lưu phòng"}
          >
            <Heart className={`w-4.5 h-4.5 ${isFavorited ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Nội dung */}
        <div className="p-4 flex flex-col flex-1">
          {/* Địa chỉ */}
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 font-medium line-clamp-2 leading-snug">
              {room.address || "Chưa có địa chỉ"}
            </p>
          </div>

          {/* Giá */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-lg font-extrabold text-blue-600">
                {room.roomPrice || "—"}
              </span>
              <span className="text-xs text-gray-400">/tháng</span>
            </div>
          </div>

          {/* Diện tích */}
          {room.area && (
            <div className="text-xs text-gray-500 mb-3">
              Diện tích:{" "}
              <span className="font-semibold text-gray-700">
                {room.area} m²
              </span>
            </div>
          )}

          {/* Nội thất & tiện ích tags */}
          {allItems.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {allItems.slice(0, 4).map((key) => {
                const item = ITEM_MAP[key];
                if (!item) return null;
                const Icon = item.icon;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 border border-gray-100 rounded-md px-2 py-1"
                  >
                    <Icon className="w-3 h-3 text-blue-500" />
                    {item.label}
                  </span>
                );
              })}
              {allItems.length > 4 && (
                <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-medium">
                  +{allItems.length - 4} khác
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-2 mt-auto pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailOpen(true);
              }}
              className="flex-1 bg-[#0E77FF] hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <Eye className="w-4 h-4" />
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>

      {/* ===== DETAIL MODAL ===== */}
      {isDetailOpen && mounted && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative custom-scrollbar shadow-2xl animate-scale-in-fade"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setIsDetailOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
              {/* LEFT: Images */}
              <div className="w-full lg:w-[55%] flex flex-col gap-4">
                {/* Main Image */}
                <div
                  className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative group cursor-pointer"
                  onClick={() => {
                    if (room.images && room.images.length > 0)
                      setIsImageViewerOpen(true);
                  }}
                >
                  {room.images && room.images.length > 0 ? (
                    <>
                      <img
                        src={room.images[selectedImageIdx] || room.images[0]}
                        alt={room.roomType || "Phòng trọ"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium text-gray-800 shadow-sm pointer-events-none">
                          Phóng to ảnh
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-400">
                      <ImageIcon className="w-14 h-14 mb-3" />
                      <span className="text-sm font-medium">Chưa có ảnh</span>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {room.images && room.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    {room.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIdx(idx)}
                        className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIdx === idx
                            ? "border-blue-500 opacity-100"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Cam kết */}
                <div className="mt-2 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Cam kết phòng chuẩn
                    </h4>
                    <p className="text-sm text-blue-700">
                      Thông tin phòng trọ đã được xác thực, hình ảnh chụp thực
                      tế 100%.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT: Details */}
              <div className="w-full lg:w-[45%] flex flex-col">
                {/* Room type title + Favorite */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                    {room.roomType || "Phòng trọ"}
                  </h1>
                  <button
                    onClick={toggleFavorite}
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                      isFavorited
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "bg-gray-50 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                    } ${heartAnimate ? "animate-[heartBeat_0.6s_ease-in-out]" : ""}`}
                    title={isFavorited ? "Bỏ lưu" : "Lưu phòng"}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full ${
                      isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isAvailable ? "Còn phòng" : "Hết phòng"}
                  </span>
                  {room.area && (
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {room.area} m²
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Mới
                  </span>
                </div>

                {/* Price */}
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                  <div>
                    <p className="text-sm font-semibold text-red-800 mb-0.5">Giá phòng</p>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-extrabold text-red-600">
                        {room.roomPrice || "—"}
                      </span>
                      <span className="text-sm text-red-500 font-medium mb-1">/tháng</span>
                    </div>
                  </div>
                </div>

                {/* Mô tả */}
                {room.description && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">
                      Mô tả
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {room.description}
                    </p>
                  </div>
                )}

                {/* Nội thất + Tiện ích */}
                {allItems.length > 0 && (
                  <div className="border border-blue-200 rounded-xl overflow-hidden mb-6">
                    <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
                      <h3 className="font-semibold text-blue-900 text-sm flex items-center gap-2">
                        <Sofa className="w-4 h-4" />
                        Nội thất & Tiện ích
                      </h3>
                    </div>
                    <div className="p-4 bg-white grid grid-cols-2 gap-y-3 gap-x-2">
                      {allItems.map((key) => {
                        const item = ITEM_MAP[key];
                        if (!item) return null;
                        const Icon = item.icon;
                        return (
                          <div
                            key={key}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <span className="text-gray-700">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Địa chỉ */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">
                      {room.address || "Chưa có địa chỉ"}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col gap-3 mt-auto">
                  <button
                    onClick={() => {
                      const locationQuery = room.coordinates && room.coordinates.trim() !== "" ? room.coordinates : room.address;
                      if (locationQuery) {
                        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`;
                        window.open(url, "_blank");
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    <Navigation className="w-5 h-5" />
                    <span className="font-bold">Chỉ đường Google Maps</span>
                  </button>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={handleCopyPhone}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-600/20"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="font-bold whitespace-nowrap">
                        {room.phone || "Gọi điện"}
                      </span>
                    </button>
                    
                    <button 
                      onClick={() => {
                        if (room.phone) {
                          const cleanPhone = room.phone.replace(/[^0-9]/g, '');
                          window.open(`https://zalo.me/${cleanPhone}`, "_blank");
                        }
                      }}
                      className="flex-1 bg-[#0068FF] hover:bg-[#0055D4] text-white rounded-xl py-3 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-bold">Zalo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notification Overlay */}
            {copySuccess && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-4 rounded-2xl flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-200 z-50 shadow-2xl">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <p className="font-bold text-lg">Đã sao chép SĐT!</p>
                <p className="text-sm text-gray-300">Bạn có thể dán vào ứng dụng gọi điện</p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* ===== FULLSCREEN IMAGE VIEWER ===== */}
      {isImageViewerOpen && room.images && room.images.length > 0 && mounted && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center backdrop-blur-md"
          onClick={() => setIsImageViewerOpen(false)}
        >
          <button
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[70]"
            onClick={(e) => {
              e.stopPropagation();
              setIsImageViewerOpen(false);
            }}
          >
            <XCircle className="w-8 h-8" />
          </button>
          <img
            src={room.images[selectedImageIdx] || room.images[0]}
            alt="Ảnh phòng"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {room.images.length > 1 && (
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 p-2 rounded-xl backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {room.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIdx === idx
                      ? "border-white opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}

    </>
  );
}
