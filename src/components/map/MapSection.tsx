"use client";

import { RefreshCw, PlusCircle, Home, MapPin, SearchX, Crosshair, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import TenantRoomCard from "./TenantRoomCard";
import { SkeletonRoomGrid } from "./SkeletonRoomCard";
import RoomFilter, { RoomFilterState, DEFAULT_FILTER, applyRoomFilters } from "./RoomFilter";
import PostedRoomCard from "@/components/landlord/PostedRoomCard";
import { RoomPostData } from "@/components/landlord/RoomPostForm";
import { StaggeredGrid, RevealOnScroll } from "@/components/ScrollAnimations";

// Danh sách quận để lọc
const DISTRICTS = [
  { key: "all", label: "Tất cả" },
  { key: "Thanh Xuân", label: "Thanh Xuân" },
  { key: "Đống Đa", label: "Đống Đa" },
  { key: "Cầu Giấy", label: "Cầu Giấy" },
  { key: "Hoàn Kiếm", label: "Hoàn Kiếm" },
  { key: "Ba Đình", label: "Ba Đình" },
  { key: "Long Biên", label: "Long Biên" },
  { key: "Hoàng Mai", label: "Hoàng Mai" },
  { key: "Nam Từ Liêm", label: "Nam Từ Liêm" },
  { key: "Hai Bà Trưng", label: "Hai Bà Trưng" },
];

// Dữ liệu mock phòng trọ ở Hà Nội
const MOCK_ROOMS = [
  { id: 1, name: "Phòng trọ Hoàn Kiếm", address: "Số 12 Ngõ Hàng Bạc, Hoàn Kiếm, Hà Nội", lat: 21.0335, lng: 105.8530, distance: "1.2 km", travelTime: "4 phút", phone: "(024) 3826 1234", hours: "06:00 - 22:00", rating: 4.8, status: "Mở cửa", price: "3.5tr/th" },
  { id: 2, name: "Trọ sinh viên Cầu Giấy", address: "Số 88 Xuân Thủy, Cầu Giấy, Hà Nội", lat: 21.0365, lng: 105.7823, distance: "2.4 km", travelTime: "8 phút", phone: "(024) 3793 4567", hours: "24/7", rating: 4.6, status: "Mở cửa", price: "2.0tr/th" },
  { id: 3, name: "Căn hộ mini Thanh Xuân", address: "Số 201 Nguyễn Trãi, Thanh Xuân, Hà Nội", lat: 21.0000, lng: 105.8167, distance: "3.8 km", travelTime: "12 phút", phone: "(024) 3568 7890", hours: "07:00 - 22:30", rating: 4.7, status: "Mở cửa", price: "4.2tr/th" },
  { id: 4, name: "Phòng trọ Đống Đa", address: "Số 56 Tây Sơn, Đống Đa, Hà Nội", lat: 21.0140, lng: 105.8310, distance: "2.1 km", travelTime: "7 phút", phone: "(024) 3857 1111", hours: "24/7", rating: 4.5, status: "Mở cửa", price: "2.8tr/th" },
  { id: 5, name: "Trọ cao cấp Ba Đình", address: "Số 33 Đội Cấn, Ba Đình, Hà Nội", lat: 21.0347, lng: 105.8210, distance: "3.2 km", travelTime: "10 phút", phone: "(024) 3762 5432", hours: "06:00 - 23:00", rating: 4.9, status: "Mở cửa", price: "5.5tr/th" },
  { id: 6, name: "Ký túc xá Long Biên", address: "Số 15 Ngọc Lâm, Long Biên, Hà Nội", lat: 21.0455, lng: 105.8730, distance: "4.5 km", travelTime: "15 phút", phone: "(024) 3652 9876", hours: "24/7", rating: 4.3, status: "Đóng", price: "1.5tr/th" },
  { id: 7, name: "Trọ Hoàng Mai", address: "Số 78 Giải Phóng, Hoàng Mai, Hà Nội", lat: 20.9933, lng: 105.8615, distance: "3.0 km", travelTime: "9 phút", phone: "(024) 3641 2345", hours: "06:00 - 22:00", rating: 4.4, status: "Mở cửa", price: "2.5tr/th" },
  { id: 8, name: "Phòng trọ Nam Từ Liêm", address: "Số 102 Mễ Trì, Nam Từ Liêm, Hà Nội", lat: 21.0155, lng: 105.7730, distance: "5.1 km", travelTime: "18 phút", phone: "(024) 3795 6789", hours: "07:00 - 21:30", rating: 4.2, status: "Mở cửa", price: "3.0tr/th" },
];

// Helper: normalize Vietnamese for comparison
function normalizeVN(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
}

// Helper: extract searchable location string (removes administrative prefixes)
function getSearchableLocation(str: string) {
  let norm = normalizeVN(str);
  norm = norm.replace(/\b(quan|huyen|thi xa|xa|phuong|thanh pho|tinh)\b/g, "").replace(/\s+/g, " ").trim();
  return norm;
}

export default function MapSection() {
  const [role, setRole] = useState<string | null>(null);
  const [postedRooms, setPostedRooms] = useState<RoomPostData[]>([]);
  const [deletedMockRooms, setDeletedMockRooms] = useState<number[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [currentDistrict, setCurrentDistrict] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [notification, setNotification] = useState<{ message: string; visible: boolean } | null>(null);
  const [roomFilter, setRoomFilter] = useState<RoomFilterState>(DEFAULT_FILTER);
  const [isLoading, setIsLoading] = useState(true);

  const loadPostedRooms = useCallback(() => {
    try {
      setPostedRooms(JSON.parse(localStorage.getItem("postedRooms") || "[]"));
      setDeletedMockRooms(JSON.parse(localStorage.getItem("deletedMockRooms") || "[]"));
    } catch { 
      setPostedRooms([]); 
      setDeletedMockRooms([]);
    }
  }, []);

  // Detect current district via geolocation
  const detectCurrentDistrict = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1&accept-language=vi`,
            { headers: { "User-Agent": "TimPhongTro/1.0" } }
          );
          const data = await res.json();
          if (data.address) {
            const district = data.address.suburb || data.address.city_district || data.address.district || data.address.county || "";
            if (district) setCurrentDistrict(district);
          }
        } catch { /* ignore */ }
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    setRole(localStorage.getItem("currentUserRole"));
    loadPostedRooms();
    detectCurrentDistrict();
    // Show skeleton loading briefly
    const loadTimer = setTimeout(() => setIsLoading(false), 800);
    const handler = () => loadPostedRooms();
    window.addEventListener("roomsUpdated", handler);
    return () => {
      window.removeEventListener("roomsUpdated", handler);
      clearTimeout(loadTimer);
    };
  }, [loadPostedRooms, detectCurrentDistrict]);

  // Listen to search actions from Hero Search Bar
  useEffect(() => {
    const handleHeroSearch = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setRoomFilter((prev) => ({
        ...prev,
        keyword: detail.address || "",
        priceRange: detail.priceRange || "all",
        roomType: detail.roomType || "all",
      }));
    };
    window.addEventListener("heroSearchApplied", handleHeroSearch);
    return () => window.removeEventListener("heroSearchApplied", handleHeroSearch);
  }, []);

  const handleDeleteRoom = (id: number) => {
    if (id <= 1000) {
      const updatedDeleted = [...deletedMockRooms, id];
      localStorage.setItem("deletedMockRooms", JSON.stringify(updatedDeleted));
      setDeletedMockRooms(updatedDeleted);
    }
    const updated = postedRooms.filter((r) => r.id !== id);
    localStorage.setItem("postedRooms", JSON.stringify(updated));
    setPostedRooms(updated);
    window.dispatchEvent(new Event("roomsUpdated"));
  };

  const handleUpdateRoom = (data: RoomPostData) => {
    const updated = postedRooms.map((r) => (r.id === data.id ? data : r));
    // If updating a mock room for the first time, it won't be in postedRooms yet
    if (!updated.some(r => r.id === data.id)) {
      updated.push(data);
    }
    localStorage.setItem("postedRooms", JSON.stringify(updated));
    setPostedRooms(updated);
    window.dispatchEvent(new Event("roomsUpdated"));
  };

  // ===== DATA MERGING LOGIC =====

  // 1. Base list: Merge MOCK_ROOMS and postedRooms into RoomPostData format
  const allRooms = useMemo(() => {
    const postedMap = new Map(postedRooms.map((r) => [r.id, r]));
    
    // Process active mock rooms
    const activeMocksAsPostData: RoomPostData[] = MOCK_ROOMS
      .filter((r) => !deletedMockRooms.includes(r.id))
      .map((r) => {
        if (postedMap.has(r.id)) return postedMap.get(r.id)!;
        return {
          id: r.id,
          images: [],
          coordinates: `${r.lat}, ${r.lng}`,
          address: r.address,
          phone: r.phone,
          roomPrice: r.price,
          furniture: ["bed", "wardrobe", "ac"],
          amenities: ["wifi", "parking"],
          status: r.status === "Mở cửa" ? "available" : "unavailable",
          description: r.name,
          area: "25",
          roomType: "Phòng trọ",
        };
      });

    const mockIds = new Set(MOCK_ROOMS.map(r => r.id));
    const newPosted = postedRooms.filter(r => !mockIds.has(r.id!));

    return [...activeMocksAsPostData, ...newPosted];
  }, [postedRooms, deletedMockRooms]);

  // Landlord sees all rooms (available & unavailable)
  const allLandlordRooms = allRooms;

  // Tenant sees only available rooms
  const allAvailableRooms = useMemo(() => allRooms.filter(r => r.status === "available"), [allRooms]);

  // Resolve the actual filter keyword
  const activeFilter = useMemo(() => {
    if (selectedDistrict === "current" && currentDistrict) return currentDistrict;
    return selectedDistrict;
  }, [selectedDistrict, currentDistrict]);

  // Filter tenant rooms based on selected district
  const filteredTenantRooms = useMemo(() => {
    if (activeFilter === "all") return allAvailableRooms;
    const filterStr = getSearchableLocation(activeFilter);
    return allAvailableRooms.filter((r) => r.address && getSearchableLocation(r.address).includes(filterStr));
  }, [allAvailableRooms, activeFilter]);

  // Apply advanced filters on top of district filter
  const advancedFilteredRooms = useMemo(() => {
    return applyRoomFilters(filteredTenantRooms, roomFilter);
  }, [filteredTenantRooms, roomFilter]);

  // Count rooms per district for badges
  const districtCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    DISTRICTS.forEach((d) => {
      if (d.key === "all") {
        counts[d.key] = allAvailableRooms.length;
      } else {
        const filterStr = getSearchableLocation(d.key);
        counts[d.key] = allAvailableRooms.filter((r) => r.address && getSearchableLocation(r.address).includes(filterStr)).length;
      }
    });
    // Count for current location
    if (currentDistrict) {
      const filterStr = getSearchableLocation(currentDistrict);
      counts["current"] = allAvailableRooms.filter((r) => r.address && getSearchableLocation(r.address).includes(filterStr)).length;
    }
    return counts;
  }, [allAvailableRooms, currentDistrict]);

  const stateRef = useRef({ currentDistrict, districtCounts });
  useEffect(() => {
    stateRef.current = { currentDistrict, districtCounts };
  }, [currentDistrict, districtCounts]);

  useEffect(() => {
    const handleFindRoomNearMe = () => {
      const { currentDistrict: dist, districtCounts: counts } = stateRef.current;
      if (!dist) {
        setNotification({ message: "Chưa xác định được vị trí", visible: true });
        return;
      }
      const count = counts["current"] || 0;
      if (count > 0) {
        setNotification({ message: `Đã tìm thấy ${count} phòng`, visible: true });
        setSelectedDistrict("current");
        document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" });
      } else {
        setNotification({ message: "Không tìm thấy phòng nào", visible: true });
      }
    };
    window.addEventListener("findRoomNearMe", handleFindRoomNearMe);
    return () => window.removeEventListener("findRoomNearMe", handleFindRoomNearMe);
  }, []);

  const isLandlord = role === "landlord";

  return (
    <section className="bg-gray-50 py-8" id="map-section">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <RevealOnScroll delay={0} direction="up" distance={25}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {isLandlord ? "Phòng trọ đã đăng" : "Phòng trọ gần nhất"}{" "}
            <span className="text-blue-600">
              ({isLandlord ? allLandlordRooms.length : advancedFilteredRooms.length})
            </span>
          </h2>
          <button onClick={loadPostedRooms} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-blue-300 transition-all shadow-sm">
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </button>
        </div>
        </RevealOnScroll>

        {/* ===== TENANT: District Filter Chips ===== */}
        {!isLandlord && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-700">Lọc theo khu vực:</span>
            <div className="flex overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap gap-2 items-center text-xs sm:text-sm">
              {/* Nút Khu vực hiện tại */}
              {(!currentDistrict || isLocating || (districtCounts["current"] || 0) > 0) && (
                <button
                  onClick={() => {
                    if (!currentDistrict && !isLocating) detectCurrentDistrict();
                    setSelectedDistrict("current");
                  }}
                  className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                    selectedDistrict === "current"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/20"
                      : "bg-white text-gray-600 border border-green-300 hover:border-green-400 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {isLocating ? (
                    <Loader2 className={`w-3.5 h-3.5 animate-spin ${selectedDistrict === "current" ? "text-green-200" : "text-green-500"}`} />
                  ) : (
                    <Crosshair className={`w-3.5 h-3.5 ${selectedDistrict === "current" ? "text-green-200" : "text-green-500"}`} />
                  )}
                  {isLocating ? "Đang định vị..." : currentDistrict ? `Gần tôi (${currentDistrict})` : "Khu vực hiện tại"}
                  {currentDistrict && !isLocating && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      selectedDistrict === "current" ? "bg-white/20 text-white" : "bg-green-100 text-green-600"
                    }`}>
                      {districtCounts["current"] || 0}
                    </span>
                  )}
                </button>
              )}

              {/* Các quận */}
              {DISTRICTS.map((d) => {
                const isActive = selectedDistrict === d.key;
                const count = districtCounts[d.key] || 0;
                
                if (d.key !== "all" && count === 0) return null;
                
                return (
                  <button
                    key={d.key}
                    onClick={() => setSelectedDistrict(d.key)}
                    className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {d.key !== "all" && <MapPin className={`w-3.5 h-3.5 ${isActive ? "text-blue-200" : "text-gray-400"}`} />}
                    {d.label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== TENANT: Advanced Filter ===== */}
        {!isLandlord && (
          <RoomFilter
            filter={roomFilter}
            onChange={setRoomFilter}
            totalRooms={filteredTenantRooms.length}
            filteredCount={advancedFilteredRooms.length}
          />
        )}

        {/* ===== LANDLORD VIEW ===== */}
        {isLandlord ? (
          allLandlordRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allLandlordRooms.map((room) => (
                <PostedRoomCard key={room.id} room={room} onDelete={handleDeleteRoom} onUpdate={handleUpdateRoom} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
                <Home className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Bạn chưa đăng phòng nào</h3>
              <p className="text-gray-500 max-w-md mb-6">Đăng phòng trọ của bạn ngay để tiếp cận hàng ngàn người thuê tiềm năng!</p>
              <button onClick={() => window.dispatchEvent(new Event("openPostForm"))} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 transform hover:scale-[1.02]">
                <PlusCircle className="w-5 h-5" />
                Đăng phòng ngay
              </button>
            </div>
          )
        ) : (
          /* ===== TENANT VIEW ===== */
          isLoading ? (
            <SkeletonRoomGrid count={8} />
          ) : advancedFilteredRooms.length > 0 ? (
            <StaggeredGrid
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gsap-cards-grid"
              staggerDelay={100}
            >
              {advancedFilteredRooms.map((room) => (
                <div key={room.id} className="gsap-card-stagger">
                  <TenantRoomCard room={room} />
                </div>
              ))}
            </StaggeredGrid>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                <SearchX className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy phòng trọ</h3>
              <p className="text-gray-500 max-w-md mb-6">
                Không có phòng trọ nào phù hợp với bộ lọc hiện tại. Hãy thử thay đổi bộ lọc hoặc chọn khu vực khác.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setRoomFilter(DEFAULT_FILTER)}
                  className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Xóa bộ lọc
                </button>
                <button onClick={() => setSelectedDistrict("all")} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                  Xem tất cả
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Notification Modal */}
      {notification?.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setNotification({ ...notification, visible: false })}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center transform transition-all animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              notification.message.includes("Đã tìm thấy") ? "bg-green-100 text-green-600" :
              notification.message.includes("Không tìm thấy") ? "bg-red-100 text-red-600" :
              "bg-yellow-100 text-yellow-600"
            }`}>
              {notification.message.includes("Đã tìm thấy") ? <MapPin className="w-8 h-8" /> :
               notification.message.includes("Không tìm thấy") ? <SearchX className="w-8 h-8" /> :
               <Crosshair className="w-8 h-8" />}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{notification.message}</h3>
            <button 
              onClick={() => setNotification({ ...notification, visible: false })}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
