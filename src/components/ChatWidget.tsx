"use client";

import { useState, useRef } from "react";
import { X, Send } from "lucide-react";

type ChatStep = "form" | "developing";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ChatStep>("form");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsOpen(false);
    // Reset after animation
    setTimeout(() => {
      setStep("form");
      setFullName("");
      setPhone("");
      setEmail("");
      setErrors({});
    }, 300);
  };

  const handleStartChat = () => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!fullName.trim()) {
      newErrors.name = "Vui lòng nhập tên đầy đủ";
    }
    if (!phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{9,11}$/.test(phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep("developing");
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl group ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
        style={{
          background: "linear-gradient(135deg, #e8533f 0%, #c0392b 100%)",
        }}
        title="Chat với chúng tôi"
        aria-label="Mở chat"
      >
        {/* Chat icon */}
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>

        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-red-400 pointer-events-none" />

        {/* Online dot */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
      </button>

      {/* Chat Widget Panel */}
      <div
        ref={widgetRef}
        className={`fixed bottom-6 right-6 z-[9999] transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-75 opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ width: "370px", maxHeight: "520px" }}
      >
        <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100 flex flex-col">
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center gap-3 relative"
            style={{
              background: "linear-gradient(135deg, #3b4a6b 0%, #2c3e5a 100%)",
            }}
          >
            {/* Logo */}
            <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm leading-tight">
                Tìm Phòng Trọ
              </h3>
              <p className="text-blue-200 text-xs mt-0.5 leading-snug">
                Chào mừng bạn đến với Tìm Phòng Trọ! Hãy chat với chúng tôi để được hỗ trợ.
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label="Đóng chat"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {step === "form" && (
              <div className="p-5">
                {/* Form intro */}
                <p className="text-gray-700 text-sm mb-5 leading-relaxed">
                  Hãy giới thiệu về bạn theo mẫu dưới đây và bắt đầu trò chuyện với chúng tôi.
                </p>

                {/* Full Name */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-1.5 font-medium">
                    Tên đầy đủ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Nhập tên đầy đủ"
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all placeholder-gray-400 ${
                      errors.name
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-200 focus:ring-blue-400 focus:border-blue-400"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-1.5 font-medium">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="Nhập số điện thoại"
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all placeholder-gray-400 ${
                      errors.phone
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-200 focus:ring-blue-400 focus:border-blue-400"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Email (optional) */}
                <div className="mb-5">
                  <label className="block text-sm text-gray-700 mb-1.5 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-gray-400"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleStartChat}
                    className="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Bắt đầu chat
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 text-sm font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {step === "developing" && (
              <div className="p-6 flex flex-col items-center justify-center text-center" style={{ minHeight: "260px" }}>
                {/* Sorry emoji */}
                <div className="text-6xl mb-4 animate-bounce">
                  🛠️
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  Xin lỗi bạn!
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-1">
                  Tính năng chat đang trong quá trình
                </p>
                <p className="text-blue-600 font-semibold text-base mb-4">
                  🚧 Phát triển 🚧
                </p>
                <p className="text-gray-500 text-xs leading-relaxed max-w-[260px]">
                  Chúng tôi đang nỗ lực phát triển tính năng này. Vui lòng liên hệ qua{" "}
                  <a href="tel:0337204417" className="text-blue-600 font-medium hover:underline">
                    0337.204.417
                  </a>{" "}
                  hoặc{" "}
                  <a href="https://zalo.me/0337204417" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                    Zalo
                  </a>{" "}
                  để được hỗ trợ ngay.
                </p>

                {/* Back button */}
                <button
                  onClick={handleClose}
                  className="mt-5 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>

          {/* Footer watermark */}
          <div className="px-5 py-2.5 border-t border-gray-100 bg-gray-50/80">
            <p className="text-[10px] text-gray-400 text-center">
              Powered by <span className="font-semibold text-gray-500">Tìm Phòng Trọ</span> • Hỗ trợ 24/7
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
