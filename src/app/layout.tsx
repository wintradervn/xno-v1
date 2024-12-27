import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Header from "./components/Header";
import { Manrope } from "next/font/google";
import InfoBar from "./components/InfoBar";
import MucYeuThich from "./components/MucYeuThich";
import { Suspense } from "react";
import RightNavigation from "./components/RightNavigation";
import Script from "next/script";
import ChiTietMaCKModal from "./chi-tiet-ma-ck/ChiTietMaCKModal";
import QuanTriDanhMucModal from "@/components/modals/QuanTriDanhMucModal";
import RightSidePanel from "./components/RightSidePanel";
import MainLayout from "./MainLayout";
import LienKetTaiKhoanChungKhoanModal from "@/components/modals/LienKetTaiKhoanChungKhoanModal";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import TimMaChungKhoanModal from "@/components/modals/TimMaChungKhoanModal";
import Updater from "./Updater";
import { GoogleAnalytics } from "@next/third-parties/google";
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});
export const metadata: Metadata = {
  title: "XNO – Nền tảng giao dịch chứng khoán toàn diện",
  description:
    "Khám phá XNO – Nền tảng giao dịch hiện đại, tích hợp AI thông minh và phân tích kỹ thuật tiên tiến. Hỗ trợ nhà đầu tư tối ưu hóa lợi nhuận và nâng tầm trải nghiệm giao dịch chứng khoán.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="/charting_library/charting_library.standalone.js"></Script>
      <GoogleAnalytics gaId="G-BD3W4VZ4CP" />
      <body
        className={`${manrope.className} no-scrollbar p-1 antialiased dark`}
      >
        <Suspense>
          <Providers>
            <div className="hidden h-[calc(100vh-8px)] flex-col gap-1 sm:flex">
              <Header />
              <InfoBar />
              <MucYeuThich />
              <div className="flex h-full flex-1 gap-1">
                <div className="no-scrollbar flex h-full min-h-0 flex-1 flex-col overflow-auto">
                  <MainLayout
                    leftContent={children}
                    rightContent={<RightSidePanel />}
                  />
                </div>
                <RightNavigation />
              </div>
              <ChiTietMaCKModal />
              <QuanTriDanhMucModal />
              <LienKetTaiKhoanChungKhoanModal />
              <TimMaChungKhoanModal />
              <Updater />
              <ToastContainer
                theme="dark"
                bodyClassName="text-sm"
                toastClassName=""
              />
            </div>
            <div className="flex min-h-screen w-full items-center justify-center bg-card sm:hidden">
              <img
                src="/image/unfinished-feature-mobile.png"
                className="h-full w-full object-contain"
              />
            </div>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
