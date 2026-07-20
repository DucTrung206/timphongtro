"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { email: "", password: "" };

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập Email hoặc Tên đăng nhập";
      hasError = true;
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập Mật khẩu";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      // Đọc danh sách users từ localStorage
      const storedUsers = localStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Tìm user hợp lệ
      const user = users.find((u: any) => 
        (u.username === formData.email || u.email === formData.email) && 
        u.password === formData.password
      );

      if (user) {
        // Đăng nhập thành công, lưu phiên làm việc
        localStorage.setItem("username", user.username);
        localStorage.setItem("currentUserRole", user.role || "tenant");
        router.push("/");
      } else {
        // Không tìm thấy user hoặc sai mật khẩu
        setErrors(prev => ({ ...prev, email: "Sai tài khoản hoặc mật khẩu (Bạn đã đăng ký chưa?)" }));
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại</h2>
        <p className="text-gray-500">Đăng nhập để tiếp tục khám phá</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email hoặc Tên đăng nhập
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.email ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-primary-500 focus:border-primary-500"
              } rounded-xl bg-gray-50 focus:bg-white transition-colors outline-none`}
              placeholder="nhapemail@example.com"
            />
          </div>
          {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Mật khẩu
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`block w-full pl-10 pr-10 py-3 border ${
                errors.password ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-primary-500 focus:border-primary-500"
              } rounded-xl bg-gray-50 focus:bg-white transition-colors outline-none`}
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
          {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
              Ghi nhớ
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
              Quên mật khẩu?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
        >
          Đăng nhập
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link href="/auth/role" className="font-medium text-primary-600 hover:text-primary-500">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
