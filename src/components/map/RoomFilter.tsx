"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  X,
  DollarSign,
  Maximize2,
  Bed,
  Sofa,
  Wifi,
  Tv,
  Wind,
  Droplets,
  Car,
  Shield,
  Home,
  Sparkles,
  WashingMachine,
  UtensilsCrossed,
  Zap,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";

// ====== CẤU HÌNH BỘ LỌC ======
// Bạn có thể chỉnh sửa các giá trị dưới đây để thay đổi bộ lọc

/** Khoảng giá phòng (VNĐ/tháng) */
export const PRICE_RANGES = [
  { key: "all", label: "Tất cả mức giá", min: 0, max: Infinity },
  { key: "under-2m", label: "Dưới 2 triệu", min: 0, max: 2000000 },
  { key: "2m-3m", label: "2 - 3 triệu", min: 2000000, max: 3000000 },
  { key: "3m-5m", label: "3 - 5 triệu", min: 3000000, max: 5000000 },
  { key: "5m-7m", label: "5 - 7 triệu", min: 5000000, max: 7000000 },
  { key: "7m-10m", label: "7 - 10 triệu", min: 7000000, max: 10000000 },
  { key: "over-10m", label: "Trên 10 triệu", min: 10000000, max: Infinity },
];

/** Khoảng diện tích (m²) */
export const AREA_RANGES = [
  { key: "all", label: "Tất cả diện tích", min: 0, max: Infinity },
  { key: "under-20", label: "Dưới 20 m²", min: 0, max: 20 },
  { key: "20-30", label: "20 - 30 m²", min: 20, max: 30 },
  { key: "30-50", label: "30 - 50 m²", min: 30, max: 50 },
  { key: "50-80", label: "50 - 80 m²", min: 50, max: 80 },
  { key: "over-80", label: "Trên 80 m²", min: 80, max: Infinity },
];

/** Nội thất & tiện ích có thể lọc */
export const FURNITURE_FILTER_OPTIONS = [
  { key: "bed", label: "Giường, nệm", icon: Bed },
  { key: "wardrobe", label: "Tủ quần áo", icon: Home },
  { key: "desk", label: "Bàn làm việc", icon: Sofa },
  { key: "sofa", label: "Sofa", icon: Sofa },
  { key: "fridge", label: "Tủ lạnh", icon: Sparkles },
  { key: "washing", label: "Máy giặt", icon: WashingMachine },
  { key: "tv", label: "Tivi", icon: Tv },
  { key: "kitchen", label: "Bếp / Nấu ăn", icon: UtensilsCrossed },
  { key: "wifi", label: "Wifi", icon: Wifi },
  { key: "ac", label: "Điều hoà", icon: Wind },
  { key: "hotwater", label: "Nước nóng", icon: Droplets },
  { key: "parking", label: "Chỗ để xe", icon: Car },
  { key: "security", label: "An ninh 24/7", icon: Shield },
  { key: "elevator", label: "Thang máy", icon: Home },
  { key: "balcony", label: "Ban công", icon: Home },
  { key: "pet", label: "Nuôi thú cưng", icon: Sparkles },
];

/** Loại phòng */
export const ROOM_TYPE_OPTIONS = [
  "Phòng trọ",
  "Căn hộ mini",
  "Căn hộ dịch vụ",
  "Nhà nguyên căn",
  "Ký túc xá",
  "Phòng ở ghép",
];

/** Khoảng giá điện (VNĐ/kWh) */
export const ELECTRICITY_RANGES = [
  { key: "all", label: "Tất cả", min: 0, max: Infinity },
  { key: "under-3k", label: "Dưới 3.000đ", min: 0, max: 3000 },
  { key: "3k-4k", label: "3.000 - 4.000đ", min: 3000, max: 4000 },
  { key: "over-4k", label: "Trên 4.000đ", min: 4000, max: Infinity },
];

/** Khoảng giá nước (VNĐ/m³) */
export const WATER_RANGES = [
  { key: "all", label: "Tất cả", min: 0, max: Infinity },
  { key: "under-20k", label: "Dưới 20.000đ", min: 0, max: 20000 },
  { key: "20k-30k", label: "20.000 - 30.000đ", min: 20000, max: 30000 },
  { key: "over-30k", label: "Trên 30.000đ", min: 30000, max: Infinity },
];

// ====== FILTER STATE TYPE ======
export interface RoomFilterState {
  priceRange: string;
  areaRange: string;
  selectedFurniture: string[];
  roomType: string;
  electricityRange: string;
  waterRange: string;
  keyword: string;
}

export const DEFAULT_FILTER: RoomFilterState = {
  priceRange: "all",
  areaRange: "all",
  selectedFurniture: [],
  roomType: "all",
  electricityRange: "all",
  waterRange: "all",
  keyword: "",
};

// ====== HELPER: Parse price string to number ======
export function parsePriceToNumber(priceStr: string): number {
  if (!priceStr) return 0;
  
  // Chuẩn hóa chuỗi (chuyển chữ thường, cắt khoảng trắng)
  let str = priceStr.toLowerCase().trim();

  // Loại bỏ dấu phân tách hàng nghìn: dấu chấm/phẩy theo sau bởi đúng 3 chữ số
  // Ví dụ: "2.500.000" -> "2500000", "1.500k" -> "1500k"
  str = str.replace(/[.,](\d{3})(?!\d)/g, "$1");

  // 1. Kiểm tra hậu tố hàng triệu ("tr", "triệu")
  if (str.includes("triệu") || str.includes("tr")) {
    let cleaned = str.replace(/[^\d.,]/g, "").trim();
    cleaned = cleaned.replace(/,/g, "."); // chuyển phẩy thành chấm nếu có
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num * 1000000;
  }

  // 2. Kiểm tra hậu tố hàng nghìn ("k", "nghìn")
  if (str.includes("nghìn") || str.includes("k")) {
    let cleaned = str.replace(/[^\d.,]/g, "").trim();
    cleaned = cleaned.replace(/,/g, ".");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num * 1000;
  }

  // 3. Phân tích số thuần (không có hậu tố triệu/nghìn)
  let hasSeparators = /[.,]/.test(str);
  
  // Chỉ lấy các chữ số
  let cleanedDigits = str.replace(/[^\d]/g, "");
  let num = parseFloat(cleanedDigits);

  if (isNaN(num)) return 0;

  // Nếu chuỗi gốc có dấu phân cách nhưng số thu được quá nhỏ (< 100),
  // chứng tỏ đó là số thập phân (ví dụ: "2.5" hoặc "2,5" triệu).
  if (hasSeparators && num < 100) {
    let decimalStr = str.replace(/[^\d.,]/g, "").replace(/,/g, ".");
    let decimalNum = parseFloat(decimalStr);
    if (!decimalNum) return 0;
    return decimalNum * 1000000;
  }

  // Nếu số phân tích được rất nhỏ (< 100) kể cả không có dấu phân cách (nhập "2" hoặc "3"),
  // tự động mặc định hiểu là hàng triệu (2 triệu, 3 triệu) vì giá phòng trọ không bao giờ dưới 100 VNĐ.
  if (num < 100) {
    return num * 1000000;
  }

  return num;
}

// ====== FILTER FUNCTION ======
export function applyRoomFilters(
  rooms: {
    roomPrice: string;
    area?: string;
    furniture: string[];
    amenities: string[];
    roomType?: string;
    description?: string;
    address: string;
    electricityPrice?: string;
    waterPrice?: string;
  }[],
  filter: RoomFilterState
) {
  return rooms.filter((room) => {
    // 1. Lọc theo giá phòng
    if (filter.priceRange !== "all") {
      const range = PRICE_RANGES.find((r) => r.key === filter.priceRange);
      if (range) {
        const price = parsePriceToNumber(room.roomPrice);
        if (price <= 0) return false; // Không có giá hợp lệ -> Bỏ qua
        if (price < range.min || price >= range.max) return false;
      }
    }

    // 2. Lọc theo diện tích
    if (filter.areaRange !== "all") {
      const range = AREA_RANGES.find((r) => r.key === filter.areaRange);
      if (range) {
        const area = parseFloat(room.area || "0");
        if (area <= 0) return false; // Không có diện tích hợp lệ
        if (area < range.min || area >= range.max) return false;
      }
    }

    // 3. Lọc theo nội thất & tiện ích (phòng phải CÓ TẤT CẢ các mục đã chọn)
    if (filter.selectedFurniture.length > 0) {
      const allItems = [...(room.furniture || []), ...(room.amenities || [])];
      const hasAll = filter.selectedFurniture.every((key) => allItems.includes(key));
      if (!hasAll) return false;
    }

    // 4. Lọc theo loại phòng
    if (filter.roomType !== "all") {
      if (room.roomType !== filter.roomType) return false;
    }

    // 5. Lọc theo giá điện
    if (filter.electricityRange !== "all") {
      const range = ELECTRICITY_RANGES.find((r) => r.key === filter.electricityRange);
      if (range && room.electricityPrice) {
        const price = parsePriceToNumber(room.electricityPrice);
        if (price <= 0) return false;
        if (price < range.min || price >= range.max) return false;
      }
    }

    // 6. Lọc theo giá nước
    if (filter.waterRange !== "all") {
      const range = WATER_RANGES.find((r) => r.key === filter.waterRange);
      if (range && room.waterPrice) {
        const price = parsePriceToNumber(room.waterPrice);
        if (price <= 0) return false;
        if (price < range.min || price >= range.max) return false;
      }
    }

    // 7. Lọc theo từ khóa (tìm trong mô tả, địa chỉ, loại phòng)
    if (filter.keyword.trim()) {
      const kw = filter.keyword.toLowerCase();
      const searchIn = [
        room.description || "",
        room.address || "",
        room.roomType || "",
      ]
        .join(" ")
        .toLowerCase();
      if (!searchIn.includes(kw)) return false;
    }

    return true;
  });
}

// ====== COMPONENT ======
interface RoomFilterProps {
  filter: RoomFilterState;
  onChange: (filter: RoomFilterState) => void;
  totalRooms: number;
  filteredCount: number;
}

export default function RoomFilter({
  filter,
  onChange,
  totalRooms,
  filteredCount,
}: RoomFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFurniture, setShowFurniture] = useState(false);

  const hasActiveFilter =
    filter.priceRange !== "all" ||
    filter.areaRange !== "all" ||
    filter.selectedFurniture.length > 0 ||
    filter.roomType !== "all" ||
    filter.electricityRange !== "all" ||
    filter.waterRange !== "all" ||
    filter.keyword.trim() !== "";

  const activeFilterCount = [
    filter.priceRange !== "all",
    filter.areaRange !== "all",
    filter.selectedFurniture.length > 0,
    filter.roomType !== "all",
    filter.electricityRange !== "all",
    filter.waterRange !== "all",
    filter.keyword.trim() !== "",
  ].filter(Boolean).length;

  const handleReset = () => {
    onChange(DEFAULT_FILTER);
  };

  const updateFilter = (partial: Partial<RoomFilterState>) => {
    onChange({ ...filter, ...partial });
  };

  const toggleFurnitureItem = (key: string) => {
    const current = filter.selectedFurniture;
    const updated = current.includes(key)
      ? current.filter((k) => k !== key)
      : [...current, key];
    updateFilter({ selectedFurniture: updated });
  };

  return (
    <div className="mb-6">
      {/* Toggle Bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all border ${
          isExpanded || hasActiveFilter
            ? "bg-blue-50 border-blue-200 text-blue-700"
            : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-4.5 h-4.5" />
          <span>Bộ lọc nâng cao</span>
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          {hasActiveFilter && (
            <span className="text-xs text-blue-500 font-medium">
              ({filteredCount}/{totalRooms} phòng)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilter && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Xóa lọc
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Filter Panel */}
      {isExpanded && (
        <div className="mt-3 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 space-y-5">
            {/* Row 1: Giá phòng + Diện tích */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Giá phòng */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  Giá phòng
                </label>
                <select
                  value={filter.priceRange}
                  onChange={(e) => updateFilter({ priceRange: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none cursor-pointer"
                >
                  {PRICE_RANGES.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Diện tích */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                  <Maximize2 className="w-4 h-4 text-purple-500" />
                  Diện tích
                </label>
                <select
                  value={filter.areaRange}
                  onChange={(e) => updateFilter({ areaRange: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none cursor-pointer"
                >
                  {AREA_RANGES.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Loại phòng + Từ khóa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Loại phòng */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                  <Home className="w-4 h-4 text-blue-500" />
                  Loại phòng
                </label>
                <select
                  value={filter.roomType}
                  onChange={(e) => updateFilter({ roomType: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none cursor-pointer"
                >
                  <option value="all">Tất cả loại phòng</option>
                  {ROOM_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tìm theo mô tả */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                  <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                  Tìm theo mô tả
                </label>
                <input
                  type="text"
                  value={filter.keyword}
                  onChange={(e) => updateFilter({ keyword: e.target.value })}
                  placeholder="VD: gần trường, có ban công..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Row 3: Giá điện + Giá nước */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Giá điện */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Giá điện (VNĐ/kWh)
                </label>
                <select
                  value={filter.electricityRange}
                  onChange={(e) =>
                    updateFilter({ electricityRange: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none cursor-pointer"
                >
                  {ELECTRICITY_RANGES.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Giá nước */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  Giá nước (VNĐ/m³)
                </label>
                <select
                  value={filter.waterRange}
                  onChange={(e) =>
                    updateFilter({ waterRange: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none cursor-pointer"
                >
                  {WATER_RANGES.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Nội thất & Tiện ích */}
            <div>
              <button
                onClick={() => setShowFurniture(!showFurniture)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
              >
                <span className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-violet-500" />
                  Nội thất & Tiện ích
                  {filter.selectedFurniture.length > 0 && (
                    <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {filter.selectedFurniture.length} đã chọn
                    </span>
                  )}
                </span>
                {showFurniture ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {showFurniture && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {FURNITURE_FILTER_OPTIONS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = filter.selectedFurniture.includes(item.key);
                    return (
                      <button
                        key={item.key}
                        onClick={() => toggleFurnitureItem(item.key)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-violet-50 border-violet-400 text-violet-700 shadow-sm"
                            : "bg-white border-gray-200 text-gray-600 hover:border-violet-300 hover:bg-violet-50/50"
                        }`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? "text-violet-600" : "text-gray-400"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Active filters summary */}
            {hasActiveFilter && (
              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  Đang lọc:
                </span>

                {filter.priceRange !== "all" && (
                  <FilterTag
                    label={PRICE_RANGES.find((r) => r.key === filter.priceRange)?.label || ""}
                    onRemove={() => updateFilter({ priceRange: "all" })}
                  />
                )}
                {filter.areaRange !== "all" && (
                  <FilterTag
                    label={AREA_RANGES.find((r) => r.key === filter.areaRange)?.label || ""}
                    onRemove={() => updateFilter({ areaRange: "all" })}
                  />
                )}
                {filter.roomType !== "all" && (
                  <FilterTag
                    label={filter.roomType}
                    onRemove={() => updateFilter({ roomType: "all" })}
                  />
                )}
                {filter.electricityRange !== "all" && (
                  <FilterTag
                    label={`Điện: ${ELECTRICITY_RANGES.find((r) => r.key === filter.electricityRange)?.label || ""}`}
                    onRemove={() => updateFilter({ electricityRange: "all" })}
                  />
                )}
                {filter.waterRange !== "all" && (
                  <FilterTag
                    label={`Nước: ${WATER_RANGES.find((r) => r.key === filter.waterRange)?.label || ""}`}
                    onRemove={() => updateFilter({ waterRange: "all" })}
                  />
                )}
                {filter.keyword.trim() && (
                  <FilterTag
                    label={`"${filter.keyword}"`}
                    onRemove={() => updateFilter({ keyword: "" })}
                  />
                )}
                {filter.selectedFurniture.map((key) => {
                  const item = FURNITURE_FILTER_OPTIONS.find((f) => f.key === key);
                  return item ? (
                    <FilterTag
                      key={key}
                      label={item.label}
                      onRemove={() => toggleFurnitureItem(key)}
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ====== SUB-COMPONENT: Filter Tag ======
function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-200">
      {label}
      <button
        onClick={onRemove}
        className="w-3.5 h-3.5 rounded-full bg-blue-200 hover:bg-blue-300 flex items-center justify-center transition-colors"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}
