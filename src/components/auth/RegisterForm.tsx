"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { username: "", fullname: "", email: "", password: "", confirmPassword: "" };

    if (!formData.username.trim()) { newErrors.username = "Vui lòng nhập Tên đăng nhập"; hasError = true; }
    if (!formData.fullname.trim()) { newErrors.fullname = "Vui lòng nhập Họ Tên"; hasError = true; }
    if (!formData.email.trim()) { newErrors.email = "Vui lòng nhập Email"; hasError = true; }
    if (!formData.password) { newErrors.password = "Vui lòng nhập Mật khẩu"; hasError = true; }
    if (!formData.confirmPassword) { 
      newErrors.confirmPassword = "Vui lòng nhập lại Mật khẩu"; 
      hasError = true; 
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      // Lưu thông tin vào localStorage để dùng cho đăng nhập
      const storedUsers = localStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Kiểm tra trùng lặp
      const isExist = users.some((u: any) => u.username === formData.username || u.email === formData.email);
      if (isExist) {
        setErrors(prev => ({ ...prev, username: "Tên đăng nhập hoặc Email đã tồn tại" }));
        return;
      }

      // Lấy role đã chọn từ trang trước
      const userRole = localStorage.getItem("userRole") || "tenant";

      // Lưu user mới
      users.push({
        fullname: formData.fullname,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: userRole
      });
      localStorage.setItem("users", JSON.stringify(users));
      router.push("/auth/login");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tạo tài khoản</h2>
        <p className="text-gray-500">Tham gia cộng đồng ngay hôm nay</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2.5 border ${errors.fullname ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-primary-500 focus:border-primary-500"} rounded-xl bg-gray-50 focus:bg-white transition-colors outline-none`}
              placeholder="Nguyễn Văn A"
            />
          </div>
          {errors.fullname && <p className="mt-1 text-sm text-red-500">{errors.fullname}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2.5 border ${errors.username ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-primary-500 focus:border-primary-500"} rounded-xl bg-gray-50 focus:bg-white transition-colors outline-none`}
              placeholder="nguyenvana"
            />
          </div>
          {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail className="h-5 w-5" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-primary-500 focus:border-primary-500"} rounded-xl bg-gray-50 focus:bg-white transition-colors outline-none`}
              placeholder="email@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`block w-full pl-10 pr-10 py-2.5 border ${errors.password ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-primary-500 focus:border-primary-500"} rounded-xl bg-gray-50 focus:bg-white transition-colors outline-none`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại Mật khẩu</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`block w-full pl-10 pr-10 py-2.5 border ${errors.confirmPassword ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-primary-500 focus:border-primary-500"} rounded-xl bg-gray-50 focus:bg-white transition-colors outline-none`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 mt-4 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
        >
          Đăng ký
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
