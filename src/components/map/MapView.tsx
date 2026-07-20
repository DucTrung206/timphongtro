"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  destination: { lat: number; lng: number } | null;
  userLocation: { lat: number; lng: number } | null;
  markers: { lat: number; lng: number; title: string; price: string }[];
  onRouteInfo?: (info: { distance: string; duration: string } | null) => void;
  onLocateMe?: () => void;
}

const HANOI_CENTER: L.LatLngExpression = [21.0285, 105.8342];

// Custom icon phòng trọ
const createRoomIcon = () =>
  L.divIcon({
    html: `<div style="
      background:#1a3673;color:white;border-radius:50%;
      width:36px;height:36px;display:flex;align-items:center;justify-content:center;
      font-size:17px;border:3px solid white;
      box-shadow:0 3px 12px rgba(0,0,0,0.35);
      cursor:pointer;transition:transform 0.2s;
    ">🏠</div>`,
    className: "custom-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

// Custom icon vị trí người dùng
const createUserIcon = () =>
  L.divIcon({
    html: `<div style="position:relative;width:20px;height:20px;">
      <div style="position:absolute;top:-10px;left:-10px;width:40px;height:40px;border-radius:50%;background:rgba(66,133,244,0.2);animation:pulse-ring 2s ease-out infinite;"></div>
      <div style="width:20px;height:20px;border-radius:50%;background:#4285F4;border:3px solid white;box-shadow:0 2px 10px rgba(66,133,244,0.5);position:relative;z-index:1;"></div>
    </div>`,
    className: "custom-marker",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

// OSRM routing miễn phí
async function fetchRoute(from: { lat: number; lng: number }, to: { lat: number; lng: number }) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson&steps=true`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code !== "Ok" || !data.routes?.length) return null;
    const route = data.routes[0];
    return {
      coordinates: route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]) as [number, number][],
      distance: route.distance as number,
      duration: route.duration as number,
    };
  } catch (err) {
    console.error("OSRM routing error:", err);
    return null;
  }
}

function formatDistance(m: number) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

function formatDuration(s: number) {
  if (s < 60) return `${Math.round(s)} giây`;
  const mins = Math.round(s / 60);
  if (mins < 60) return `${mins} phút`;
  return `${Math.floor(mins / 60)}h ${mins % 60}p`;
}

export default function MapView({ destination, userLocation, markers, onRouteInfo, onLocateMe }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLayersRef = useRef<L.Layer[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const roomMarkersRef = useRef<L.Marker[]>([]);
  const [isRouting, setIsRouting] = useState(false);

  // === Khởi tạo bản đồ ===
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: HANOI_CENTER,
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // === Markers phòng trọ ===
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    roomMarkersRef.current.forEach((m) => m.remove());
    roomMarkersRef.current = [];

    markers.forEach((room) => {
      const marker = L.marker([room.lat, room.lng], { icon: createRoomIcon() })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Inter,system-ui,sans-serif;padding:6px 8px;min-width:140px;">
            <strong style="font-size:13px;color:#1a3673;display:block;margin-bottom:3px;">${room.title}</strong>
            <span style="font-size:14px;color:#0E77FF;font-weight:700;">${room.price}</span>
          </div>`,
          { closeButton: false, offset: [0, -10] }
        );
      roomMarkersRef.current.push(marker);
    });
  }, [markers]);

  // === Marker vị trí người dùng ===
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: createUserIcon(),
        zIndexOffset: 1000,
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Inter,system-ui,sans-serif;padding:6px 8px;">
            <strong style="font-size:13px;color:#4285F4;">📍 Vị trí của bạn</strong>
          </div>`,
          { closeButton: false }
        );
    }

    map.flyTo([userLocation.lat, userLocation.lng], 14, { animate: true, duration: 1.2 });
  }, [userLocation]);

  // === Xoá TẤT CẢ route cũ ===
  const clearAllRoutes = () => {
    const map = mapRef.current;
    if (!map) return;
    routeLayersRef.current.forEach((layer) => map.removeLayer(layer));
    routeLayersRef.current = [];
  };

  // === Chỉ đường: xoá cũ → vẽ mới ===
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    clearAllRoutes();

    if (!destination || !userLocation) {
      onRouteInfo?.(null);
      return;
    }

    setIsRouting(true);

    fetchRoute(userLocation, destination).then((result) => {
      setIsRouting(false);
      if (!result) {
        onRouteInfo?.(null);
        return;
      }

      // Đường viền bóng
      const shadow = L.polyline(result.coordinates as L.LatLngExpression[], {
        color: "#1a3673",
        weight: 9,
        opacity: 0.25,
      }).addTo(map);

      // Đường chính
      const mainLine = L.polyline(result.coordinates as L.LatLngExpression[], {
        color: "#0E77FF",
        weight: 5,
        opacity: 0.9,
        smoothFactor: 1,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      routeLayersRef.current = [shadow, mainLine];

      // Zoom fit
      map.fitBounds(mainLine.getBounds().pad(0.15), { animate: true, duration: 0.8 });

      onRouteInfo?.({
        distance: formatDistance(result.distance),
        duration: formatDuration(result.duration),
      });
    });
  }, [destination, userLocation, onRouteInfo]);

  // === Bay về vị trí người dùng ===
  const flyToUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.flyTo([userLocation.lat, userLocation.lng], 15, { animate: true, duration: 1.2 });
    } else {
      onLocateMe?.();
    }
  };

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full rounded-2xl z-0" />

      {isRouting && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-10">
          <div className="bg-white rounded-xl shadow-lg px-5 py-3 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-700">Đang tìm đường...</span>
          </div>
        </div>
      )}

      <button
        onClick={flyToUser}
        className="absolute top-3 left-3 z-[1000] bg-white shadow-lg rounded-xl px-3.5 py-2.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-all border border-gray-200 hover:border-blue-300 flex items-center gap-1.5 active:scale-95"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
        Vị trí của bạn
      </button>
    </div>
  );
}
