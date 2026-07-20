"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ImagePlus,
  MapPin,
  DollarSign,
  Sofa,
  Wifi,
  Tv,
  Bed,
  CheckCircle2,
  Trash2,
  Save,
  Loader2,
  ChevronDown,
  Sparkles,
  Home,
  Droplets,
  Wind,
  Car,
  Shield,
  UtensilsCrossed,
  WashingMachine,
  XCircle,
  Video,
} from "lucide-react";

// ====== TYPES ======
export interface RoomPostData {
  id?: number;
  images: string[];
  videos?: string[];
  coordinates?: string;
  address: string;
  phone: string;
  roomPrice: string;
  rentPrice?: string;
  furniture: string[];
  amenities: string[];
  status: "available" | "unavailable";
  description?: string;
  area?: string;
  roomType?: string;
}

interface RoomPostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoomPostData) => void;
  editData?: RoomPostData | null;
}

// ====== CONSTANTS ======
const FURNITURE_OPTIONS = [
  { key: "bed", label: "Giường, nệm", icon: Bed },
  { key: "wardrobe", label: "Tủ quần áo", icon: Home },
  { key: "desk", label: "Bàn làm việc", icon: Sofa },
  { key: "sofa", label: "Sofa", icon: Sofa },
  { key: "fridge", label: "Tủ lạnh", icon: CheckCircle2 },
  { key: "washing", label: "Máy giặt", icon: WashingMachine },
  { key: "tv", label: "Tivi", icon: Tv },
  { key: "kitchen", label: "Bếp / Nấu ăn", icon: UtensilsCrossed },
];

const AMENITY_OPTIONS = [
  { key: "wifi", label: "Wifi miễn phí", icon: Wifi },
  { key: "ac", label: "Điều hoà", icon: Wind },
  { key: "hotwater", label: "Nước nóng", icon: Droplets },
  { key: "parking", label: "Chỗ để xe", icon: Car },
  { key: "security", label: "An ninh 24/7", icon: Shield },
  { key: "elevator", label: "Thang máy", icon: Home },
  { key: "balcony", label: "Ban công", icon: Home },
  { key: "pet", label: "Nuôi thú cưng", icon: Sparkles },
];

const ROOM_TYPES = [
  "Phòng trọ",
  "Căn hộ mini",
  "Căn hộ dịch vụ",
  "Nhà nguyên căn",
  "Ký túc xá",
  "Phòng ở ghép",
];

// ====== COMPONENT ======
export default function RoomPostForm({
  isOpen,
  onClose,
  onSubmit,
  editData,
}: RoomPostFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  // Form state
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [roomPrice, setRoomPrice] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [roomType, setRoomType] = useState("Phòng trọ");
  const [furniture, setFurniture] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [status, setStatus] = useState<"available" | "unavailable">("available");

  // Validation state
  const [errorMsg, setErrorMsg] = useState("");

  // Pre-fill when editing
  useEffect(() => {
    if (editData) {
      setImages(editData.images || []);
      setVideos(editData.videos || []);
      setCoordinates(editData.coordinates || "");
      setAddress(editData.address || "");
      setPhone(editData.phone || "");
      setRoomPrice(editData.roomPrice || "");
      setDescription(editData.description || "");
      setArea(editData.area || "");
      setRoomType(editData.roomType || "Phòng trọ");
      setFurniture(editData.furniture || []);
      setAmenities(editData.amenities || []);
      setStatus(editData.status || "available");
    } else {
      resetForm();
    }
  }, [editData, isOpen]);

  const resetForm = () => {
    setImages([]);
    setVideos([]);
    setCoordinates("");
    setAddress("");
    setPhone("");
    setRoomPrice("");
    setDescription("");
    setArea("");
    setRoomType("Phòng trọ");
    setFurniture([]);
    setAmenities([]);
    setStatus("available");
    setActiveSection(0);
    setErrorMsg("");
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImages((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be re-uploaded
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle video upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Limit video size to 50MB
      if (file.size > 50 * 1024 * 1024) {
        setErrorMsg("Video không được vượt quá 50MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setVideos((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle furniture
  const toggleFurniture = (key: string) => {
    setFurniture((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Toggle amenity
  const toggleAmenity = (key: string) => {
    setAmenities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Handle submit
  const handleSubmit = async () => {
    setErrorMsg("");

    // Validation
    if (images.length === 0) {
      setErrorMsg("Vui lòng thêm ít nhất 1 ảnh phòng trọ.");
      setActiveSection(1);
      return;
    }
    if (!area.trim()) {
      setErrorMsg("Vui lòng nhập diện tích phòng.");
      setActiveSection(2);
      return;
    }
    if (!address.trim()) {
      setErrorMsg("Vui lòng nhập địa chỉ phòng.");
      setActiveSection(2);
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Vui lòng nhập số điện thoại liên hệ.");
      setActiveSection(2);
      return;
    }
    if (!description.trim()) {
      setErrorMsg("Vui lòng nhập mô tả phòng.");
      setActiveSection(2);
      return;
    }
    if (!roomPrice.trim()) {
      setErrorMsg("Vui lòng nhập giá phòng.");
      setActiveSection(3);
      return;
    }
    if (furniture.length === 0) {
      setErrorMsg("Vui lòng chọn ít nhất 1 nội thất.");
      setActiveSection(4);
      return;
    }
    if (amenities.length === 0) {
      setErrorMsg("Vui lòng chọn ít nhất 1 tiện ích.");
      setActiveSection(5);
      return;
    }

    setIsSubmitting(true);

    // Simulate async submission
    await new Promise((r) => setTimeout(r, 1200));

    const newId = editData?.id !== undefined ? editData.id : Date.now();
    const data: RoomPostData = {
      id: newId,
      images,
      videos,
      coordinates,
      address,
      phone,
      roomPrice,
      furniture,
      amenities,
      status,
      description,
      area,
      roomType,
    };

    // Save to localStorage
    const rooms: RoomPostData[] = JSON.parse(
      localStorage.getItem("postedRooms") || "[]"
    );
    if (editData?.id !== undefined) {
      // Editing existing room
      const idx = rooms.findIndex((r) => r.id === editData.id);
      if (idx !== -1) {
        rooms[idx] = data;
      } else {
        rooms.push(data);
      }
    } else {
      // New room
      rooms.push(data);
    }
    localStorage.setItem("postedRooms", JSON.stringify(rooms));
    window.dispatchEvent(new Event("roomsUpdated"));

    onSubmit(data);
    setIsSubmitting(false);
    resetForm();
    onClose();
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isEditing = !!editData;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 backdrop-blur-sm"
      data-lenis-prevent
    >
      <div className="min-h-full flex items-start justify-center py-8 px-4">
      <div
        className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col animate-scale-in-fade"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== HEADER (sticky) ===== */}
        <div className="sticky top-0 z-20 relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5 flex items-center justify-between rounded-t-3xl">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden rounded-t-3xl">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              {isEditing ? "Chỉnh sửa phòng trọ" : "Đăng phòng trọ mới"}
            </h2>
            <p className="text-sm text-blue-200 mt-0.5">
              {isEditing
                ? "Cập nhật thông tin phòng của bạn"
                : "Điền đầy đủ thông tin để đăng phòng"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===== FORM BODY ===== */}
        <div className="px-6 py-6 space-y-6">
          {/* --- Section 1: Ảnh & Video phòng --- */}
          <div className="space-y-3">
            <button
              onClick={() => setActiveSection(activeSection === 1 ? 0 : 1)}
              className="w-full flex items-center justify-between"
            >
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                Ảnh & Video phòng trọ
                <span className="text-xs text-gray-400 font-normal ml-1">
                  (Tối đa 10 ảnh + 3 video)
                </span>
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  activeSection === 1 ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Images grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {/* Uploaded images */}
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group"
                >
                  <img
                    src={img}
                    alt={`Ảnh ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Ảnh chính
                    </span>
                  )}
                </div>
              ))}

              {/* Add image button */}
              {images.length < 10 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 flex flex-col items-center justify-center gap-1 transition-all group"
                >
                  <ImagePlus className="w-7 h-7 text-blue-400 group-hover:text-blue-600 transition-colors" />
                  <span className="text-xs text-blue-500 font-medium">
                    Thêm ảnh
                  </span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Videos section */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-purple-500" />
                Video phòng trọ
                <span className="text-xs text-gray-400 font-normal">({videos.length}/3)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* Uploaded videos */}
                {videos.map((vid, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-xl overflow-hidden border-2 border-gray-200 group bg-black"
                  >
                    <video
                      src={vid}
                      className="w-full aspect-video object-contain"
                      controls
                      preload="metadata"
                    />
                    <button
                      onClick={() => removeVideo(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      Video {idx + 1}
                    </span>
                  </div>
                ))}

                {/* Add video button */}
                {videos.length < 3 && (
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    className="aspect-video rounded-xl border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 hover:border-purple-400 flex flex-col items-center justify-center gap-1 transition-all group"
                  >
                    <Video className="w-7 h-7 text-purple-400 group-hover:text-purple-600 transition-colors" />
                    <span className="text-xs text-purple-500 font-medium">
                      Thêm video
                    </span>
                    <span className="text-[10px] text-purple-400">
                      Tối đa 50MB
                    </span>
                  </button>
                )}

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* --- Section 2: Thông tin cơ bản --- */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                2
              </div>
              Thông tin cơ bản
            </h3>

            {/* Loại phòng + Diện tích */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Loại phòng
                </label>
                <div className="relative">
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none"
                  >
                    {ROOM_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Diện tích (m²)
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="VD: 25"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Địa chỉ và SĐT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Địa chỉ phòng
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="VD: Số 12, Ngõ 68 Trần Duy Hưng, Cầu Giấy"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <span className="text-blue-500 text-lg leading-none">📞</span>
                  Số điện thoại liên hệ
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="VD: 0912345678"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Mô tả phòng
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết về phòng trọ: vị trí thuận lợi, gần trường, gần chợ, giao thông thuận tiện..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* --- Section 3: Giá cả --- */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">
                3
              </div>
              Giá cả
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  Giá phòng (VNĐ/tháng)
                </label>
                <input
                  type="text"
                  value={roomPrice}
                  onChange={(e) => setRoomPrice(e.target.value)}
                  placeholder="VD: 3,500,000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  Tọa độ (Không bắt buộc)
                </label>
                <input
                  type="text"
                  value={coordinates}
                  onChange={(e) => setCoordinates(e.target.value)}
                  placeholder="VD: 21.0335, 105.8530"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* --- Section 4: Nội thất --- */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold">
                4
              </div>
              Nội thất trong phòng
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FURNITURE_OPTIONS.map((item) => {
                const Icon = item.icon;
                const isSelected = furniture.includes(item.key);
                return (
                  <button
                    key={item.key}
                    onClick={() => toggleFurniture(item.key)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-violet-50 border-violet-400 text-violet-700 shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-violet-300 hover:bg-violet-50/50"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-violet-100" : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isSelected ? "text-violet-600" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* --- Section 5: Tiện ích --- */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold">
                5
              </div>
              Tiện ích
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AMENITY_OPTIONS.map((item) => {
                const Icon = item.icon;
                const isSelected = amenities.includes(item.key);
                return (
                  <button
                    key={item.key}
                    onClick={() => toggleAmenity(item.key)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-teal-50 border-teal-400 text-teal-700 shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-teal-300 hover:bg-teal-50/50"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-teal-100" : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isSelected ? "text-teal-600" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* --- Section 6: Trạng thái phòng --- */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">
                6
              </div>
              Trạng thái phòng
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setStatus("available")}
                className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  status === "available"
                    ? "bg-green-50 border-green-400 text-green-700 shadow-sm shadow-green-100"
                    : "bg-white border-gray-200 text-gray-500 hover:border-green-300"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    status === "available" ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      status === "available"
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Còn phòng</p>
                  <p
                    className={`text-xs ${
                      status === "available"
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    Sẵn sàng cho thuê
                  </p>
                </div>
              </button>

              <button
                onClick={() => setStatus("unavailable")}
                className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  status === "unavailable"
                    ? "bg-red-50 border-red-400 text-red-700 shadow-sm shadow-red-100"
                    : "bg-white border-gray-200 text-gray-500 hover:border-red-300"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    status === "unavailable" ? "bg-red-100" : "bg-gray-100"
                  }`}
                >
                  <X
                    className={`w-5 h-5 ${
                      status === "unavailable"
                        ? "text-red-600"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Hết phòng</p>
                  <p
                    className={`text-xs ${
                      status === "unavailable"
                        ? "text-red-600"
                        : "text-gray-400"
                    }`}
                  >
                    Đã cho thuê hết
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {errorMsg && (
            <div className="w-full sm:w-auto flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl text-sm font-medium animate-in slide-in-from-bottom-2">
              <XCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}
          <div className="flex w-full sm:w-auto items-center justify-end gap-3 ml-auto">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Huỷ bỏ
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? "Cập nhật phòng" : "Đăng phòng"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
