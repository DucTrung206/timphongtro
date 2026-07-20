"use client";

import React, { useState, useEffect } from "react";
import { Heart, MapPin, Sparkles, ShieldCheck } from "lucide-react";
import { RoomPostData } from "@/components/landlord/RoomPostForm";

interface ModernRoomCardProps {
  room: RoomPostData;
  onOpenDetail?: () => void;
}

/**
 * ModernRoomCard — Airbnb-style Minimalist Room Card
 * Highlights price and location details. Fully responsive and supports click interactions.
 */
export default function ModernRoomCard({ room, onOpenDetail }: ModernRoomCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [heartAnimate, setHeartAnimate] = useState(false);

  // Check initial favorites state from localStorage
  useEffect(() => {
    if (room.id !== undefined) {
      const favorites = JSON.parse(localStorage.getItem("favoriteRooms") || "[]");
      setIsFavorited(favorites.includes(room.id));
    }
  }, [room.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (room.id === undefined) return;

    const favorites = JSON.parse(localStorage.getItem("favoriteRooms") || "[]");
    let newFavorites: number[];

    if (favorites.includes(room.id)) {
      newFavorites = favorites.filter((id: number) => id !== room.id);
      setIsFavorited(false);
    } else {
      newFavorites = [...favorites, room.id];
      setIsFavorited(true);
      setHeartAnimate(true);
      setTimeout(() => setHeartAnimate(false), 600);
    }

    localStorage.setItem("favoriteRooms", JSON.stringify(newFavorites));
    // Dispatch event to sync other favorite states (e.g. in header)
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const isAvailable = room.status === "available";

  return (
    <div
      onClick={onOpenDetail}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100/80 shadow-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer w-full"
    >
      {/* 1. PHẦN ẢNH (Tỉ lệ 4:3) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
        {room.images && room.images.length > 0 ? (
          <img
            src={room.images[0]}
            alt={room.roomType || "Phòng trọ"}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50/50 to-indigo-50/50 text-gray-400">
            <span className="text-3xl mb-1">🏠</span>
            <span className="text-[11px] font-semibold tracking-wide uppercase opacity-75">Chưa có hình ảnh</span>
          </div>
        )}

        {/* Nút Trái tim (Top Right) */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-black/20 hover:bg-black/35 backdrop-blur-sm text-white ${
            isFavorited ? "text-red-500" : "text-white"
          } ${heartAnimate ? "animate-[heartBeat_0.6s_ease-in-out]" : ""}`}
          title={isFavorited ? "Bỏ lưu phòng" : "Lưu phòng"}
        >
          <Heart className={`w-4.5 h-4.5 transition-colors ${isFavorited ? "fill-current" : ""}`} />
        </button>

        {/* Badge trạng thái (Bottom Left) */}
        <div className="absolute bottom-3 left-3 flex gap-1.5 items-center">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-md shadow-sm text-white ${
              isAvailable ? "bg-green-600/90" : "bg-red-500/90"
            }`}
          >
            {isAvailable ? "Còn phòng" : "Hết phòng"}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-600/90 backdrop-blur-md text-white flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3 h-3 text-white" />
            Đã xác minh
          </span>
        </div>
      </div>

      {/* 2. PHẦN NỘI DUNG (Padding 16px) */}
      <div className="p-4 flex flex-col flex-grow text-left">
        {/* Dòng 1: Tên phòng / Loại phòng */}
        <h3 className="font-extrabold text-base text-gray-900 leading-snug line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
          {room.description || `${room.roomType || "Phòng trọ"} chất lượng cao`}
        </h3>

        {/* Dòng 2: Địa chỉ cụ thể */}
        <div className="flex items-center gap-1.5 text-gray-400 mb-2">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <p className="text-xs font-semibold text-gray-500 truncate">
            {room.address || "Chưa cập nhật địa chỉ"}
          </p>
        </div>

        {/* Dòng 3: Cụm giá tiền (Màu cam nổi bật) */}
        <div className="flex items-baseline gap-0.5 mt-auto mb-3">
          <span className="text-lg font-black text-orange-500">
            {room.roomPrice}
          </span>
          <span className="text-[11px] font-bold text-gray-400">/tháng</span>
        </div>

        {/* Divider nét mảnh */}
        <div className="w-full h-[1px] bg-gray-100 mb-3" />

        {/* Dòng 4: Danh sách ngang chứa 2-3 tiện ích */}
        <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
          {room.area && (
            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
              <span className="text-sm">📐</span>
              <span>{room.area} m²</span>
            </div>
          )}
          {room.furniture && room.furniture.includes("ac") && (
            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
              <span className="text-sm">❄️</span>
              <span>Điều hoà</span>
            </div>
          )}
          {room.amenities && room.amenities.includes("wifi") && (
            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
              <span className="text-sm">🌐</span>
              <span>Wifi</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
