export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Dynamic Image/Pattern area */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden items-center justify-center">
        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float-slow-reverse"></div>
        </div>
        
        <div className="relative z-10 p-12 text-white max-w-lg">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">Tìm kiếm<br/>không gian sống<br/>lý tưởng.</h1>
          <p className="text-xl text-primary-100 font-light">Nhanh chóng, An toàn và Tiện lợi. Kết nối trực tiếp chủ nhà và người thuê.</p>
        </div>
      </div>

      {/* Right side - Form area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 bg-white lg:bg-transparent">
        {children}
      </div>
    </div>
  );
}
