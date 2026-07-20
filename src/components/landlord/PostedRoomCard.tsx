"use client";

import { MapPin, DollarSign, Edit, Trash2, Eye, CheckCircle2, XCircle, Bed, Wifi, Tv, Sofa, Wind, Droplets, Car, Shield, Home, Sparkles, WashingMachine, UtensilsCrossed, ImageIcon } from "lucide-react";
import { useState } from "react";
import RoomPostForm, { RoomPostData } from "./RoomPostForm";

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
  security: { label: "An ninh", icon: Shield },
  elevator: { label: "Thang máy", icon: Home },
  balcony: { label: "Ban công", icon: Home },
  pet: { label: "Thú cưng", icon: Sparkles },
};

interface PostedRoomCardProps {
  room: RoomPostData;
  onDelete: (id: number) => void;
  onUpdate: (data: RoomPostData) => void;
}

export default function PostedRoomCard({ room, onDelete, onUpdate }: PostedRoomCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const isAvailable = room.status === "available";
  const allItems = [...(room.furniture || []), ...(room.amenities || [])];

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 group flex flex-col">
        {/* Ảnh phòng */}
        <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
          {room.images && room.images.length > 0 ? (
            <img
              src={room.images[0]}
              alt={room.roomType || "Phòng trọ"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onClick={() => {
                setSelectedImageIdx(0);
                setIsImageViewerOpen(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
              <ImageIcon className="w-12 h-12 mb-2" />
              <span className="text-sm">Chưa có ảnh</span>
            </div>
          )}

          {/* Badge count ảnh */}
          {room.images && room.images.length > 1 && (
            <button
              onClick={() => setIsImageViewerOpen(true)}
              className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1"
            >
              <ImageIcon className="w-3 h-3" />
              {room.images.length} ảnh
            </button>
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
            {room.coordinates && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md truncate max-w-[120px]">
                Tọa độ: {room.coordinates}
              </span>
            )}
          </div>

          {/* Diện tích */}
          {room.area && (
            <div className="text-xs text-gray-500 mb-3">
              Diện tích: <span className="font-semibold text-gray-700">{room.area} m²</span>
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

          {/* Action buttons */}
          <div className="flex gap-2 mt-auto pt-2">
            <button
              onClick={() => setIsDetailOpen(true)}
              className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors border border-gray-200"
            >
              <Eye className="w-4 h-4" />
              Xem
            </button>
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors border border-blue-200"
            >
              <Edit className="w-4 h-4" />
              Sửa
            </button>
            <button
              onClick={() => {
                if (room.id !== undefined && confirm("Bạn có chắc muốn xoá phòng này?")) {
                  onDelete(room.id);
                }
              }}
              className="px-3 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-sm font-medium flex items-center justify-center transition-colors border border-red-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      <RoomPostForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={(data) => {
          onUpdate(data);
          setIsEditOpen(false);
        }}
        editData={room}
      />

      {/* Detail View Modal */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl animate-scale-in-fade"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Chi tiết phòng đã đăng</h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Ảnh */}
            {room.images && room.images.length > 0 && (
              <div className="px-6 pt-4">
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={room.images[selectedImageIdx] || room.images[0]}
                    alt="Ảnh phòng"
                    className="w-full h-full object-cover"
                  />
                </div>
                {room.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {room.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIdx(idx)}
                        className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIdx === idx
                            ? "border-blue-500 opacity-100"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Thông tin chi tiết */}
            <div className="px-6 py-4 space-y-4">
              {/* Trạng thái + Loại */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isAvailable ? "Còn phòng" : "Hết phòng"}
                </span>
                {room.roomType && (
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {room.roomType}
                  </span>
                )}
                {room.area && (
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {room.area} m²
                  </span>
                )}
              </div>

              {/* Địa chỉ */}
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-gray-800 font-medium">{room.address || "Chưa có địa chỉ"}</p>
              </div>

              {/* Giá */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-0.5">Giá phòng</p>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-extrabold text-blue-600">
                      {room.roomPrice || "—"}
                    </span>
                    <span className="text-sm text-blue-500 font-medium mb-1">/tháng</span>
                  </div>
                </div>
              </div>

              {/* Mô tả */}
              {room.description && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Mô tả</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{room.description}</p>
                </div>
              )}

              {/* Nội thất */}
              {room.furniture && room.furniture.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Nội thất</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.furniture.map((key) => {
                      const item = ITEM_MAP[key];
                      if (!item) return null;
                      const Icon = item.icon;
                      return (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1.5 text-sm text-violet-700 bg-violet-50 border border-violet-100 rounded-lg px-3 py-1.5"
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tiện ích */}
              {room.amenities && room.amenities.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Tiện ích</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((key) => {
                      const item = ITEM_MAP[key];
                      if (!item) return null;
                      const Icon = item.icon;
                      return (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1.5 text-sm text-teal-700 bg-teal-50 border border-teal-100 rounded-lg px-3 py-1.5"
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setIsEditOpen(true);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa phòng
              </button>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-6 py-3 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image viewer */}
      {isImageViewerOpen && room.images && room.images.length > 0 && (
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
          {/* Thumbnails */}
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
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
