import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import AnnouncementBanner from "@/components/AnnouncementBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tìm Phòng Trọ Gần Nhất",
  description: "Nền tảng tìm kiếm và cho thuê phòng trọ uy tín, nhanh chóng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
        <ChatWidget />
        <AnnouncementBanner />
      </body>
    </html>
  );
}
