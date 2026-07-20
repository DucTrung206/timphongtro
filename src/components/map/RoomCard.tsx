"use client";

import { Phone, Clock, Star, Navigation, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import RoomDetailModal from "./RoomDetailModal";

export interface RoomData {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: string;
  travelTime: string;
  phone: string;
  hours: string;
  rating: number;
  status: "Mở cửa" | "Đóng";
  price: string;
}

interface RoomCardProps {
  room: RoomData;
}

export default function RoomCard({ room }: RoomCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(room.status);

  useEffect(() => {
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
  }, [room.id]);

  // Mở Google Maps chỉ đường trực tiếp
  const openGoogleMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${room.lat},${room.lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group cursor-pointer"
      >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-[15px] truncate group-hover:text-blue-700 transition-colors">
            {room.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 truncate">{room.address}</p>
        </div>
        <span
          className={`ml-3 shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${
            currentStatus === "Mở cửa"
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-red-50 text-red-500 border border-red-200"
          }`}
        >
          {currentStatus === "Mở cửa" ? "Còn phòng" : "Hết phòng"}
        </span>
      </div>

      {/* Distance + Travel time */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-bold text-blue-600">{room.distance}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Navigation className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-semibold text-orange-600">{room.travelTime}</span>
        </div>
        <div className="ml-auto">
          <span className="text-sm font-extrabold text-[#0E77FF]">{room.price}</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5" />
          <span>{room.phone}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{room.hours}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="font-bold text-gray-700">{room.rating}</span>
        </div>
      </div>

      {/* Chỉ đường → mở Google Maps */}
      <button
        onClick={openGoogleMaps}
        className="w-full bg-[#0E77FF] hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        <Navigation className="w-4 h-4" />
        Chỉ đường
      </button>
    </div>

    <RoomDetailModal 
      room={room} 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
    />
    </>
  );
}
