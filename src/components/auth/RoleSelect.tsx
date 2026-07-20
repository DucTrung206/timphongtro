"use client";

import { useState } from "react";
import { Building2, Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RoleSelect() {
  const [selectedRole, setSelectedRole] = useState<"landlord" | "tenant" | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selectedRole) {
      // Lưu vai trò đăng ký
      localStorage.setItem("userRole", selectedRole);
      router.push("/auth/register");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Bạn là ai?</h1>
        <p className="text-gray-500">Vui lòng chọn vai trò để chúng tôi có thể phục vụ bạn tốt nhất</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Landlord Card */}
        <div 
          onClick={() => setSelectedRole("landlord")}
          className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 group bg-white ${
            selectedRole === "landlord" 
              ? "border-primary-600 shadow-md bg-primary-50" 
              : "border-gray-100 shadow-sm hover:border-primary-200 hover:shadow-md"
          }`}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
            selectedRole === "landlord" ? "bg-primary-600 text-white" : "bg-primary-50 text-primary-600 group-hover:bg-primary-100"
          }`}>
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Chủ trọ</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Tôi có phòng trống và muốn đăng tin cho thuê để tìm khách hàng nhanh chóng.
          </p>
        </div>

        {/* Tenant Card */}
        <div 
          onClick={() => setSelectedRole("tenant")}
          className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 group bg-white ${
            selectedRole === "tenant" 
              ? "border-primary-600 shadow-md bg-primary-50" 
              : "border-gray-100 shadow-sm hover:border-primary-200 hover:shadow-md"
          }`}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
            selectedRole === "tenant" ? "bg-primary-600 text-white" : "bg-primary-50 text-primary-600 group-hover:bg-primary-100"
          }`}>
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Người tìm phòng</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Tôi đang tìm kiếm một căn phòng hoặc căn hộ phù hợp với nhu cầu của mình.
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-medium transition-all duration-300 ${
            selectedRole 
              ? "bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Tiếp tục
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
