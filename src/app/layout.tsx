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

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});
export const metadata: Metadata = {
  title: "XNO Platform",
  description: "XNO Platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="/charting_library/charting_library.standalone.js"></Script>
      <body className={`${manrope.className} p-1 antialiased dark`}>
        <Suspense>
          <Providers>
            <div className="flex h-[calc(100vh-8px)] flex-col gap-1">
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
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
