// ============================================
// 📢 CẤU HÌNH THÔNG BÁO - CHỈNH SỬA TẠI ĐÂY
// ============================================

export const announcementConfig = {
  // Bật/Tắt thông báo (true = hiện, false = ẩn)
  enabled: true,

  // Tiêu đề thông báo
  title: "Cảm ơn bạn đã test!",

  // Nội dung thông báo (hỗ trợ nhiều dòng)
  message: [
    "Đây là trang web đang trong thời gian testing và chỉ phục vụ cho việc học không ảnh hưởng tới bất kỳ cá nhân nào",
    "LƯU Ý:",
    "- Toàn bộ dữ liệu chỉ là demo để phục vụ học tập và kiểm thử hệ thống",
    "- Không thêm thông tin cá nhân hay nhạy cảm của bất kì ai lên hệ thống vì chưa có hệ thống xét duyệt nên mọi thông tin đăng lên có thể bị lộ.",
    "Tài khoản đăng nhập hệ thống (có thể tạo)",
    "-Tên đăng nhập(tài khoản khách):test1",
    "-Tên đăng nhập(tài khoản chủ): test2",
    "- Password: 123456",
    "- Feedback email: trungkoten30@gmail.com",
  ],

  // Loại thông báo: "info" | "success" | "warning" | "promo"
  // - info: màu xanh dương (thông tin chung)
  // - success: màu xanh lá (thành công)
  // - warning: màu cam (cảnh báo)
  // - promo: màu tím gradient (khuyến mãi)
  type: "promo" as "info" | "success" | "warning" | "promo",

  // Thời gian tự động ẩn (milliseconds). Đặt 0 để không tự ẩn.
  autoHideAfter: 0,

  // Hiển thị nút đóng (true/false)
  showCloseButton: true,

  // Icon emoji (để trống nếu không muốn)
  icon: "📌",

  // Link CTA (Call to Action) - để trống nếu không cần
  ctaText: "Khám phá ngay →",
  ctaLink: "", // Để trống = không hiện nút CTA
};
