"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Cột 1: THÔNG TIN */}
          <div>
            <h3 className="text-[#1a3673] font-bold text-lg mb-5 tracking-wide">THÔNG TIN</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dieu-khoan" className="text-gray-600 hover:text-blue-600 transition-colors text-sm nav-link-underline">
                  Điều khoản & Cam kết
                </Link>
              </li>
              <li>
                <Link href="/quy-che" className="text-gray-600 hover:text-blue-600 transition-colors text-sm nav-link-underline">
                  Quy chế hoạt động
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach" className="text-gray-600 hover:text-blue-600 transition-colors text-sm nav-link-underline">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 2: KẾT NỐI VỚI CHÚNG TÔI - Liên hệ */}
          <div>
            <h3 className="text-[#1a3673] font-bold text-lg mb-5 tracking-wide">KẾT NỐI VỚI CHÚNG TÔI</h3>
            <div className="space-y-4">
              {/* Số điện thoại */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <a href="tel:0337204417" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
                  0337.204.417
                </a>
              </div>

              {/* Zalo */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-bold text-xs">Zalo</span>
                </div>
                <a href="https://zalo.me/0337204417" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
                  0337204417
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <a href="mailto:trungkoten31@gmail.com" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
                  trungkoten31@gmail.com
                </a>
              </div>

              {/* Địa chỉ VP Huế */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-gray-700 text-sm font-medium">
                  Địa chỉ: TDP Đoài 2, phường Thành Nam, tỉnh Ninh Bình
                </p>
              </div>
            </div>
          </div>

          {/* Cột 3: Mạng xã hội */}
          <div>
            <h3 className="text-[#1a3673] font-bold text-lg mb-5 tracking-wide">THEO DÕI CHÚNG TÔI</h3>
            <div className="flex flex-col gap-3">
              {/* Facebook */}
              <a href="https://www.facebook.com/ggh.trksko" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-fit">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                Duc Trung
              </a>

              {/* TikTok */}
              <a href="https://www.tiktok.com/@trungabjkk" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-fit">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
                tdz_206
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © 2026 Tìm Phòng Trọ. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Tìm kiếm phòng trọ (demo)
          </p>
        </div>
      </div>
    </footer>
  );
}
