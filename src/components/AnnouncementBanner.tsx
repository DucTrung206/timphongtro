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
        @keyframes announcement-slide-in {
          0% {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
            filter: blur(6px);
          }
          60% {
            opacity: 1;
            transform: translateY(4px) scale(1.01);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes announcement-slide-out {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(0.96);
            filter: blur(4px);
          }
        }
        @keyframes announcement-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
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

      <div
        id="announcement-banner"
        role="alert"
        style={{
          position: "fixed",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          width: "min(560px, calc(100vw - 32px))",
          animation: exiting
            ? "announcement-slide-out 0.5s cubic-bezier(0.4, 0, 1, 1) forwards"
            : "announcement-slide-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <div
          style={{
            background: style.bg,
            borderRadius: "16px",
            border: `1.5px solid ${style.border}`,
            boxShadow: style.shadow,
            padding: "16px 18px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Shimmer overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "announcement-shimmer 3s ease-in-out infinite",
              pointerEvents: "none",
              borderRadius: "16px",
            }}
          />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* Pulse dot */}
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: style.accent,
                    animation: "announcement-pulse-dot 2s ease-in-out infinite",
                    flexShrink: 0,
                  }}
                />

                {announcementConfig.icon && (
                  <span
                    style={{
                      fontSize: "18px",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "10px",
                      background: style.iconBg,
                      flexShrink: 0,
                    }}
                  >
                    {announcementConfig.icon}
                  </span>
                )}

                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    color: style.text,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {announcementConfig.title}
                </span>
              </div>

              {announcementConfig.showCloseButton && (
                <button
                  id="announcement-close-btn"
                  onClick={handleClose}
                  aria-label="Đóng thông báo"
                  style={{
                    background: "rgba(0,0,0,0.06)",
                    border: "none",
                    borderRadius: "8px",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: style.text,
                    fontSize: "16px",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0,0,0,0.12)";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(0,0,0,0.06)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Message */}
            <div
              style={{
                fontSize: "13.5px",
                color: style.text,
                opacity: 0.85,
                lineHeight: 1.55,
                margin: 0,
                paddingLeft: "16px",
              }}
            >
              {Array.isArray(announcementConfig.message)
                ? announcementConfig.message.map((line, i) => {
                    const isHeader = !line.startsWith("-") && (line.endsWith(":") || line === announcementConfig.message[0]);
                    return (
                      <p
                        key={i}
                        style={{
                          margin: 0,
                          marginTop: isHeader && i > 0 ? "8px" : "2px",
                          fontWeight: isHeader ? 700 : 400,
                          opacity: isHeader ? 1 : 0.9,
                        }}
                      >
                        {line}
                      </p>
                    );
                  })
                : <p style={{ margin: 0 }}>{announcementConfig.message}</p>
              }
            </div>

            {/* CTA Link */}
            {announcementConfig.ctaText && announcementConfig.ctaLink && (
              <div style={{ paddingLeft: "16px", marginTop: "10px" }}>
                <a
                  href={announcementConfig.ctaLink}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: style.accent,
                    textDecoration: "none",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.5)",
                    border: `1px solid ${style.border}`,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.8)";
                    e.currentTarget.style.transform = "translateX(2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  {announcementConfig.ctaText}
                </a>
              </div>
            )}
          </div>

          {/* Auto-hide progress bar */}
          {announcementConfig.autoHideAfter > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "3px",
                borderRadius: "0 0 16px 16px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  backgroundColor: style.accent,
                  opacity: 0.4,
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
