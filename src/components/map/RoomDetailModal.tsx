"use client";

import { X, Star, MapPin, Navigation, Phone, ShieldCheck, CheckCircle2, Sofa, Bed, Wifi, Tv, Edit, Check, Ban } from "lucide-react";
import { useState, useEffect } from "react";
import { RoomData } from "./RoomCard";
import RoomPostForm, { RoomPostData } from "@/components/landlord/RoomPostForm";

interface RoomDetailModalProps {
  room: RoomData;
  isOpen: boolean;
  onClose: () => void;
}

export default function RoomDetailModal({ room, isOpen, onClose }: RoomDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(room.status);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  useEffect(() => {
    setRole(localStorage.getItem("currentUserRole"));
    
    const statuses = JSON.parse(localStorage.getItem("roomStatuses") || "{}");
    if (statuses[room.id]) {
      setCurrentStatus(statuses[room.id]);
    }

    const handleStatusUpdate = () => {
      const updatedStatuses = JSON.parse(localStorage.getItem("roomStatuses") || "{}");
      if (updatedStatuses[room.id]) {
        setCurrentStatus(updatedStatuses[room.id]);
      }
    };
    window.addEventListener("roomStatusUpdated", handleStatusUpdate);
    return () => window.removeEventListener("roomStatusUpdated", handleStatusUpdate);
  }, [room.id, isOpen]);

  const updateStatus = (newStatus: "Mở cửa" | "Đóng") => {
    const statuses = JSON.parse(localStorage.getItem("roomStatuses") || "{}");
    statuses[room.id] = newStatus;
    localStorage.setItem("roomStatuses", JSON.stringify(statuses));
    setCurrentStatus(newStatus);
    window.dispatchEvent(new Event("roomStatusUpdated"));
  };

  if (!isOpen) return null;

  // Mock data for images and types since we don't have them in RoomData yet
  const mockImages = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1502672260266-1c1cd2cb94bd?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1505691938895-1758d7def515?auto=format&fit=crop&q=80&w=800"
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Modal Container */}
      <div 
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: Images section */}
          <div className="w-full lg:w-[55%] flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-gray-900 block lg:hidden mb-2">{room.name}</h2>
            
            {/* Main Image */}
            <div 
              className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative group cursor-pointer"
              onClick={() => setIsFullscreen(true)}
            >
              <img 
                src={mockImages[selectedImage]} 
                alt={room.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-800 flex items-center gap-1.5 shadow-sm">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                {room.rating} ({Math.floor(Math.random() * 50) + 10} đánh giá)
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium text-gray-800 shadow-sm pointer-events-none">
                  Phóng to ảnh
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {mockImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? "border-red-500 opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Room Features */}
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Cam kết phòng chuẩn</h4>
                <p className="text-sm text-blue-700">Thông tin phòng trọ đã được xác thực, hình ảnh chụp thực tế 100%. Hoàn tiền cọc nếu sai thông tin.</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Details section */}
          <div className="w-full lg:w-[45%] flex flex-col">
            <div className="hidden lg:block mb-4">
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">{room.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-gray-800 font-medium">{room.rating}</span>
                  (24 đánh giá)
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${room.lat},${room.lng}&travelmode=driving`;
                    window.open(url, "_blank");
                  }}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Xem bản đồ
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">Giá thuê từ</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-red-600">{room.price}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block mb-1">Tình trạng</span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  currentStatus === "Mở cửa" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                }`}>
                  {currentStatus === "Mở cửa" ? "Còn phòng" : "Hết phòng"}
                </span>
              </div>
            </div>

            {/* Room Amenities */}
            <div className="border border-blue-200 rounded-xl overflow-hidden mb-6">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-200 flex items-center justify-between">
                <h3 className="font-semibold text-blue-900 text-sm flex items-center gap-2">
                  <Sofa className="w-4 h-4" />
                  Nội thất & Tiện ích trong phòng
                </h3>
              </div>
              <div className="p-4 bg-white grid grid-cols-2 gap-y-4 gap-x-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Bed className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Giường, nệm</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Tv className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Tivi thông minh</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Tủ lạnh</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Điều hoà</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Bình nóng lạnh</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Wifi className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Wifi tốc độ cao</span>
                </div>
              </div>
            </div>

            {/* Info list */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{room.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Navigation className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Cách bạn {room.distance} - Khoảng {room.travelTime} di chuyển</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-auto">
              {role === 'landlord' ? (
                <>
                  <button 
                    onClick={() => updateStatus("Mở cửa")}
                    className={`flex-1 flex flex-col items-center justify-center rounded-xl py-3 border-2 transition-all ${
                      currentStatus === "Mở cửa" 
                        ? "bg-green-50 border-green-500 text-green-700 shadow-sm" 
                        : "bg-white border-gray-200 hover:border-green-300 text-gray-600"
                    }`}
                  >
                    <Check className="w-5 h-5 mb-1" />
                    <span className="font-bold text-sm">Còn phòng</span>
                  </button>
                  <button 
                    onClick={() => updateStatus("Đóng")}
                    className={`flex-1 flex flex-col items-center justify-center rounded-xl py-3 border-2 transition-all ${
                      currentStatus === "Đóng" 
                        ? "bg-gray-100 border-gray-400 text-gray-700 shadow-sm" 
                        : "bg-white border-gray-200 hover:border-gray-400 text-gray-600"
                    }`}
                  >
                    <Ban className="w-5 h-5 mb-1" />
                    <span className="font-bold text-sm">Hết phòng</span>
                  </button>
                  <button
                    onClick={() => setIsEditFormOpen(true)}
                    className="flex-1 bg-blue-50 border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-100 text-blue-700 flex flex-col items-center justify-center rounded-xl py-3 transition-colors"
                  >
                    <Edit className="w-5 h-5 mb-1" />
                    <span className="font-bold text-sm">Chỉnh sửa</span>
                  </button>
                </>
              ) : (
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 flex flex-col items-center justify-center transition-colors shadow-lg shadow-blue-600/20">
                  <span className="font-bold text-base flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    GỌI CHỦ NHÀ
                  </span>
                  <span className="text-xs text-blue-100">{room.phone}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Fullscreen Image View */}
    {isFullscreen && (
      <div 
        className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center backdrop-blur-md"
        onClick={() => setIsFullscreen(false)}
      >
        <button 
          className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[70]"
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen(false);
          }}
        >
          <X className="w-8 h-8" />
        </button>
        <img 
          src={mockImages[selectedImage]} 
          alt={room.name}
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    )}

    {/* Edit Form Modal */}
    <RoomPostForm
      isOpen={isEditFormOpen}
      onClose={() => setIsEditFormOpen(false)}
      onSubmit={(data) => {
        console.log("Room updated:", data);
        setIsEditFormOpen(false);
      }}
      editData={{
        id: room.id,
        images: [],
        deposit: "",
        address: room.address,
        roomPrice: room.price,
        rentPrice: room.price,
        furniture: ["bed", "fridge", "tv"],
        amenities: ["wifi", "ac", "hotwater"],
        status: currentStatus === "Mở cửa" ? "available" : "unavailable",
        description: "",
        area: "",
        roomType: "Phòng trọ",
      }}
    />
    </>
  );
}
