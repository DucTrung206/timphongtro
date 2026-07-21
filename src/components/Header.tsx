"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Home, Search, MapPin, Loader2, Navigation, LogOut, MessageCircle, PlusCircle, Map, X, Heart } from "lucide-react";

interface SearchSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export default function Header() {
  const [locationName, setLocationName] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Sticky header glassmorphism on scroll
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("currentUserRole");
    if (storedUsername) {
      setUsername(storedUsername);
      setUserRole(storedRole);
    }
  }, []);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteRooms, setFavoriteRooms] = useState<{ id: number; roomType?: string; address: string; roomPrice: string; images: string[] }[]>([]);
  const [favSearchQuery, setFavSearchQuery] = useState("");
  const favRef = useRef<HTMLDivElement>(null);

  // Load favorites count & listen for updates
  const loadFavorites = () => {
    const favIds: number[] = JSON.parse(localStorage.getItem("favoriteRooms") || "[]");
    setFavoriteCount(favIds.length);

    if (favIds.length > 0) {
      // Get room details from postedRooms + mockRooms in localStorage
      const allRooms = JSON.parse(localStorage.getItem("postedRooms") || "[]");
      const mockRooms = JSON.parse(localStorage.getItem("mockRooms") || "[]");
      const combined = [...allRooms, ...mockRooms];
      const favRooms = favIds
        .map((id) => combined.find((r: { id?: number }) => r.id === id))
        .filter(Boolean)
        .map((r: { id: number; roomType?: string; address: string; roomPrice: string; images: string[] }) => ({
          id: r.id,
          roomType: r.roomType,
          address: r.address,
          roomPrice: r.roomPrice,
          images: r.images || [],
        }));
      setFavoriteRooms(favRooms);
    } else {
      setFavoriteRooms([]);
    }
  };

  useEffect(() => {
    loadFavorites();
    const handler = () => loadFavorites();
    window.addEventListener("favoritesUpdated", handler);
    window.addEventListener("roomsUpdated", handler);
    return () => {
      window.removeEventListener("favoritesUpdated", handler);
      window.removeEventListener("roomsUpdated", handler);
    };
  }, []);

  // Close favorites dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (favRef.current && !favRef.current.contains(event.target as Node)) {
        setShowFavorites(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const removeFavorite = (roomId: number) => {
    const favIds: number[] = JSON.parse(localStorage.getItem("favoriteRooms") || "[]");
    const newFavs = favIds.filter((id) => id !== roomId);
    localStorage.setItem("favoriteRooms", JSON.stringify(newFavs));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const clearAllFavorites = () => {
    localStorage.setItem("favoriteRooms", "[]");
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const filteredFavorites = favoriteRooms.filter((r) => {
    const q = favSearchQuery.toLowerCase();
    return (
      (r.roomType || "").toLowerCase().includes(q) ||
      (r.address || "").toLowerCase().includes(q)
    );
  });

  // Lấy vị trí hiện tại và chuyển thành tên địa chỉ
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationName("Không hỗ trợ");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Dùng Nominatim (OpenStreetMap) để reverse geocode - miễn phí
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1&accept-language=vi`,
            { headers: { "User-Agent": "TimPhongTro/1.0" } }
          );
          const data = await res.json();

          if (data.address) {
            // Ưu tiên hiển thị: quận/huyện + thành phố
            const district =
              data.address.suburb ||
              data.address.city_district ||
              data.address.district ||
              data.address.county ||
              "";
            const city =
              data.address.city ||
              data.address.town ||
              data.address.state ||
              "";

            const display = district ? `${district}, ${city}` : city || data.display_name?.split(",").slice(0, 2).join(",");
            setLocationName(display);
          } else {
            setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch {
          setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }

        setIsLocating(false);
      },
      () => {
        setLocationName("Không xác định");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Tự động lấy vị trí khi vào trang
  useEffect(() => {
    getLocation();
  }, []);

  // Xử lý click ra ngoài để đóng search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce tìm kiếm địa điểm
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            searchQuery
          )}&countrycodes=vn&format=json&addressdetails=1&limit=5&accept-language=vi`,
          { headers: { "User-Agent": "TimPhongTro/1.0" } }
        );
        const data = await res.json();
        setSuggestions(data);
      } catch {
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <header className={`border-b border-gray-100 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ease-out px-3 sm:px-6 ${isScrolled ? 'header-glass py-2' : 'bg-white py-2.5 sm:py-3'}`}>
      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="bg-blue-600 text-white p-1.5 sm:p-2 rounded-xl shrink-0">
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h1 className="text-blue-700 font-bold text-base sm:text-lg leading-tight">Tìm Phòng Trọ</h1>
          <p className="text-[10px] sm:text-xs text-gray-500">Nhanh chóng, Uy tín</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="hidden md:flex flex-1 max-w-xl mx-8 relative" ref={searchRef}>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isSearching ? (
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Tìm theo khu vực, tên đường, trường đại học (tại VN)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              if (searchQuery.trim().length >= 2) setShowSuggestions(true);
            }}
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
            {suggestions.map((place) => (
              <button
                key={place.place_id}
                onClick={() => {
                  setSearchQuery(place.display_name.split(',')[0]);
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-0 transition-colors flex items-start gap-3"
              >
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {place.display_name.split(',')[0]}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                    {place.display_name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Nút Xem bản đồ */}
        <button
          onClick={() => setShowMapModal(true)}
          className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium transition-all border border-emerald-200 hover:border-emerald-300 hover:shadow-sm shrink-0"
          title="Xem bản đồ"
        >
          <Map className="w-4 h-4" />
          Xem bản đồ
        </button>
      </div>

      {/* Vị trí + Đăng nhập */}
      <div className="flex items-center gap-4">
        {/* Nút vị trí hiện tại */}
        <button
          onClick={getLocation}
          className="hidden md:flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium max-w-[220px]"
          title={locationName || "Bấm để định vị"}
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500 shrink-0" />
          ) : (
            <Navigation className="w-5 h-5 text-blue-500 shrink-0" />
          )}
          <span className="text-sm truncate">
            {isLocating
              ? "Đang định vị..."
              : locationName || "Vị trí"}
          </span>
        </button>

        {/* Đăng nhập / User Info */}
        {username ? (
          <div className="flex items-center gap-3">
            {/* Nút Đăng phòng (chỉ hiện cho chủ trọ) */}
            {userRole === "landlord" && (
              <>
                <button
                  onClick={() => window.dispatchEvent(new Event("openPostForm"))}
                  className="hidden md:flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  Đăng phòng
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("map-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hidden md:flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
                >
                  <Home className="w-4 h-4" />
                  Xem phòng đã đăng
                </button>
              </>
            )}

            {/* Nút Chat */}
            <div className="relative cursor-pointer group hidden sm:block">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative">
                <MessageCircle className="w-6 h-6" />
                {/* Dấu chấm xanh báo online */}
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              </button>
              {/* Tooltip thời gian hoạt động */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.08)] rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-gray-800">Đang hoạt động</span>
                </div>
                <p className="text-xs text-gray-500">Thường trả lời ngay lập tức</p>
              </div>
            </div>

            {/* Nút Yêu thích (Tim) */}
            <div className="relative" ref={favRef}>
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`p-2 rounded-full transition-colors relative ${showFavorites
                  ? "text-red-500 bg-red-50"
                  : "text-gray-600 hover:text-red-500 hover:bg-red-50"
                  }`}
                title="Phòng đã lưu"
              >
                <Heart className={`w-6 h-6 ${favoriteCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
                {favoriteCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {favoriteCount > 9 ? "9+" : favoriteCount}
                  </span>
                )}
              </button>

              {/* Favorites Dropdown */}
              {showFavorites && (
                <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-red-50 to-pink-50 flex items-center justify-between">
                    <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      Phòng đã lưu ({favoriteCount})
                    </h4>
                    {favoriteRooms.length > 0 && (
                      <button
                        onClick={clearAllFavorites}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline"
                      >
                        Xóa tất cả
                      </button>
                    )}
                  </div>

                  {favoriteRooms.length > 0 && (
                    <div className="p-2 border-b border-gray-100 bg-gray-50/50">
                      <input
                        type="text"
                        placeholder="Tìm phòng đã lưu..."
                        value={favSearchQuery}
                        onChange={(e) => setFavSearchQuery(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400"
                      />
                    </div>
                  )}

                  {favoriteRooms.length === 0 ? (
                    <div className="p-6 text-center">
                      <Heart className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Chưa có phòng nào được lưu</p>

                    </div>
                  ) : filteredFavorites.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-400">
                      Không tìm thấy phòng phù hợp
                    </div>
                  ) : (
                    <div className="max-h-72 overflow-y-auto">
                      {filteredFavorites.map((room) => (
                        <div
                          key={room.id}
                          onClick={() => {
                            setShowFavorites(false);
                            const el = document.getElementById("map-section");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                        >
                          {/* Thumbnail */}
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {room.images.length > 0 ? (
                              <img src={room.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Home className="w-5 h-5" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {room.roomType || "Phòng trọ"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{room.address}</p>
                            <p className="text-xs font-bold text-blue-600 mt-0.5">{room.roomPrice}/tháng</p>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFavorite(room.id);
                            }}
                            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Xóa phòng này"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-50 text-blue-700 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full font-medium border border-blue-100 shadow-sm cursor-pointer hover:bg-blue-100 transition-colors">
              <span className="text-xs sm:text-sm truncate max-w-[90px] sm:max-w-none">Xin chào, <strong>{username}</strong></span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("username");
                localStorage.removeItem("currentUserRole");
                setUsername(null);
                setUserRole(null);
              }}
              className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="bg-[#00b14f] hover:bg-[#009845] text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm"
          >
            Đăng nhập
          </Link>
        )}
      </div>

      {/* Modal đang phát triển - Xem bản đồ */}
      {mounted && showMapModal && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowMapModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] p-6 max-w-sm w-[90%] mx-4 text-center relative animate-[scaleIn_0.25s_ease-out] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            style={{ minHeight: "260px" }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowMapModal(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Đóng"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Sorry emoji */}
            <div className="text-6xl mb-4 animate-bounce">
              🛠️
            </div>

            <h4 className="text-lg font-bold text-gray-800 mb-2">
              Xin lỗi bạn!
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-1">
              Tính năng <span className="font-semibold text-[#00b14f]">Xem bản đồ</span> đang trong quá trình
            </p>
            <p className="text-blue-600 font-semibold text-base mb-4">
              🚧 Phát triển 🚧
            </p>
            <p className="text-gray-500 text-xs leading-relaxed max-w-[260px]">
              Tôi đang nỗ lực phát triển tính năng này. Vui lòng liên hệ qua{" "}
              <a href="tel:0337204417" className="text-blue-600 font-medium hover:underline">
                0337.204.417
              </a>{" "}
              hoặc{" "}
              <a href="https://zalo.me/0337204417" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                Zalo
              </a>{" "}
              để được hỗ trợ ngay.
            </p>

            {/* Close button */}
            <button
              onClick={() => setShowMapModal(false)}
              className="mt-5 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>,
        document.body
      )}

    </header>
  );
}
