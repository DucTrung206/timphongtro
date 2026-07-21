"use client";

import React, { useState, useEffect, useCallback } from "react";
import { announcementConfig } from "./announcement-config";

const typeStyles = {
  info: {
    bg: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
    border: "#38bdf8",
    text: "#0c4a6e",
    accent: "#0284c7",
    shadow: "0 4px 24px rgba(56, 189, 248, 0.18)",
    iconBg: "rgba(2, 132, 199, 0.12)",
  },
  success: {
    bg: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
    border: "#4ade80",
    text: "#14532d",
    accent: "#16a34a",
    shadow: "0 4px 24px rgba(74, 222, 128, 0.18)",
    iconBg: "rgba(22, 163, 74, 0.12)",
  },
  warning: {
    bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    border: "#fbbf24",
    text: "#78350f",
    accent: "#d97706",
    shadow: "0 4px 24px rgba(251, 191, 36, 0.18)",
    iconBg: "rgba(217, 119, 6, 0.12)",
  },
  promo: {
    bg: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)",
    border: "#8b5cf6",
    text: "#3b0764",
    accent: "#7c3aed",
    shadow: "0 4px 24px rgba(139, 92, 246, 0.22)",
    iconBg: "rgba(124, 58, 237, 0.12)",
  },
};

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      setDismissed(true);
    }, 500);
  }, []);

  useEffect(() => {
    if (!announcementConfig.enabled || dismissed) return;

    // Delay hiện lên để tạo hiệu ứng mượt sau khi trang tải
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 600);

    return () => clearTimeout(showTimer);
  }, [dismissed]);

  useEffect(() => {
    if (!visible || !announcementConfig.autoHideAfter || exiting) return;

    const hideTimer = setTimeout(() => {
      handleClose();
    }, announcementConfig.autoHideAfter);

    return () => clearTimeout(hideTimer);
  }, [visible, exiting, handleClose]);

  if (!announcementConfig.enabled || !visible || dismissed) return null;

  const style = typeStyles[announcementConfig.type];

  return (
    <>
      <style>{`
        @keyframes announcement-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes announcement-scale-in {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes announcement-scale-out {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(0.92) translateY(10px);
          }
        }
        @keyframes announcement-pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes announcement-progress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>

      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
        style={{
          animation: exiting ? "announcement-fade-in 0.3s reverse forwards" : "announcement-fade-in 0.3s ease-out forwards",
        }}
        onClick={handleClose}
      >
        {/* Centered Modal Card */}
        <div
          id="announcement-banner"
          role="alert"
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] border"
          style={{
            background: style.bg,
            borderColor: style.border,
            boxShadow: style.shadow,
            animation: exiting
              ? "announcement-scale-out 0.3s ease-in forwards"
              : "announcement-scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 pb-3 border-b border-black/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: style.accent,
                  animation: "announcement-pulse-dot 2s ease-in-out infinite",
                  flexShrink: 0,
                }}
              />
              {announcementConfig.icon && (
                <span
                  style={{
                    fontSize: "20px",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                    background: style.iconBg,
                    flexShrink: 0,
                  }}
                >
                  {announcementConfig.icon}
                </span>
              )}
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: style.text,
                }}
                className="truncate"
              >
                {announcementConfig.title}
              </h3>
            </div>

            {announcementConfig.showCloseButton && (
              <button
                id="announcement-close-btn"
                onClick={handleClose}
                aria-label="Đóng thông báo"
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-700 font-bold transition-all shrink-0"
              >
                ✕
              </button>
            )}
          </div>

          {/* Scrollable Message Content */}
          <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar flex-1 space-y-2 text-xs sm:text-sm leading-relaxed" style={{ color: style.text }}>
            {Array.isArray(announcementConfig.message)
              ? announcementConfig.message.map((line, i) => {
                  const isHeader = !line.startsWith("-") && (line.endsWith(":") || line === announcementConfig.message[0]);
                  return (
                    <p
                      key={i}
                      className={isHeader ? "font-bold text-sm sm:text-base mt-2 mb-1" : "pl-2 opacity-90"}
                    >
                      {line}
                    </p>
                  );
                })
              : <p>{announcementConfig.message}</p>
            }

            {/* CTA Link */}
            {announcementConfig.ctaText && announcementConfig.ctaLink && (
              <div className="pt-3">
                <a
                  href={announcementConfig.ctaLink}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: style.accent,
                    padding: "8px 16px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.7)",
                    border: `1px solid ${style.border}`,
                  }}
                  className="hover:bg-white transition-all shadow-sm"
                >
                  {announcementConfig.ctaText}
                </a>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="p-3 sm:p-4 border-t border-black/5 bg-white/40 backdrop-blur-md flex items-center justify-end shrink-0">
            <button
              onClick={handleClose}
              style={{
                backgroundColor: style.accent,
              }}
              className="w-full sm:w-auto px-6 py-2.5 text-white font-bold text-sm rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all"
            >
              Tôi đã hiểu & Đóng
            </button>
          </div>

          {/* Progress bar */}
          {announcementConfig.autoHideAfter > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
              <div
                style={{
                  height: "100%",
                  backgroundColor: style.accent,
                  opacity: 0.5,
                  animation: `announcement-progress ${announcementConfig.autoHideAfter}ms linear forwards`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
