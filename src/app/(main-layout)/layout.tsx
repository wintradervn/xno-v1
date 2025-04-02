import type { Metadata } from "next";

import { Providers } from "./providers";
import Header from "../components/Header";
import InfoBar from "../components/InfoBar";
import MucYeuThich from "../components/MucYeuThich";
import { Suspense } from "react";
import RightSidePanel from "../components/RightSidePanel";
import MainLayout from "./MainLayout";
import { ToastContainer } from "react-toastify";
import Updater from "./Updater";
import ModalContainer from "@/components/modals/ModalContainer";
import { FloatingChatBot } from "@/components/FloatingChatBot";

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
    <div className="p-1">
      <Suspense>
        <Providers>
          <div className="relative flex flex-col gap-1 pb-16 sm:h-[calc(100vh-8px)] sm:pb-0">
            <Header />
            <InfoBar />
            <MucYeuThich />
            <MainLayout
              leftContent={children}
              rightContent={<RightSidePanel />}
            />

            <Updater />
            <ModalContainer />
            <ToastContainer
              theme="dark"
              bodyClassName="text-sm"
              toastClassName=""
            />
            <FloatingChatBot />
          </div>
          {/* <div className="flex min-h-screen w-full items-center justify-center bg-card sm:hidden">
              <img
                src="/image/unfinished-feature-mobile.png"
                className="h-full w-full object-contain"
              />
            </div> */}
        </Providers>
      </Suspense>
    </div>
  );
}
