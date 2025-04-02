"use client";
import BotCoSoSanBot from "@/components/module/BotAI/BotCoSoSanBot";
import { BotCuaToi } from "@/components/module/BotAI/BotCuaToi";
import BotPhaiSinhSanBot from "@/components/module/BotAI/BotPhaiSinhSanBot";
import ProFeatureLocker from "@/components/ui/ProFeatureLocker";
import Tabs from "@/components/ui/Tabs";
import { Tab } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import { useIsShowLockerSanBot } from "./useIsShowLockerSanBot";

export default function SanBotPage() {
  const [selectedTab, setSelectedTab] = useState("botphaisinh");
  const { isShowLocker } = useIsShowLockerSanBot();

  return (
    <div className="card relative flex h-full w-full flex-1 flex-col p-0">
      {isShowLocker && (
        <ProFeatureLocker>
          <div className="text-md flex w-full max-w-[640px] flex-col gap-5 px-3 sm:px-0">
            <div className="text-[20px] font-semibold">
              Nâng cấp hội viên Professional – Tận dụng tối đa sức mạnh đầu tư!
            </div>
            <div className="text-md font-medium">
              Bạn đang bỏ lỡ những công cụ đầu tư mạnh mẽ giúp bạn ra quyết định
              chính xác hơn. Nâng cấp ngay để tiếp cận Bot tín hiệu giao dịch.
            </div>
            <div className="flex items-center gap-2">
              <VerifiedCheck /> Tín hiệu mua/bán cổ phiếu theo xu hướng thị
              trường
            </div>
            <div className="flex items-center gap-2">
              <VerifiedCheck /> Thông báo điểm vào ra dựa trên các mô hình ML/AI
              cao cấp
            </div>
            <div className="flex items-center gap-2">
              <VerifiedCheck /> Cảnh báo khi thị trường có biến động lớn
            </div>
            <div className="flex items-center gap-2">
              <VerifiedCheck /> Tổng hợp tin tức tác động đến cổ phiếu bạn quan
              tâm
            </div>
            <div className="text-md font-medium">
              Còn nhiều tính năng nâng cao giúp bạn đầu tư thông minh hơn! Đừng
              bỏ lỡ lợi thế của bạn trên thị trường – Nâng cấp ngay!{" "}
            </div>
            <div className="flex w-full justify-center">
              <Link
                href=""
                className="text-refine-bg hover:text-refine-bg group relative z-1 block h-[48px] max-w-[180px] cursor-pointer appearance-none transition-all duration-100 hover:no-underline focus:outline-hidden active:scale-[0.98]"
              >
                <div className="blur-0 absolute -top-0.5 -right-0.5 -bottom-0.5 -left-0.5 z-[-1] overflow-hidden rounded-[10px]">
                  <div className="bg-landing-rainbow animate-spin-slow animate-pause group-hover:animate-running absolute top-[-48px] left-[-12.5%] aspect-square h-auto w-[125%]"></div>
                </div>
                <div className="absolute -top-1 -right-1 -bottom-1 -left-1 z-[-1] overflow-hidden rounded-[14px] opacity-0 blur-[4px] transition-all group-hover:opacity-70">
                  <div className="bg-landing-rainbow animate-spin-slow animate-pause group-hover:animate-running absolute top-[-48px] left-[-12.5%] aspect-square h-auto w-[125%]"></div>
                </div>
                <div className="rounded-[8px] bg-white">
                  <div className="flex items-center justify-center gap-2 transition-transform duration-100 ease-in-out">
                    <div className="text-with-gradient animate-pause group-hover:animate-running h-[48px]! rounded-[8px] px-6 py-3 text-base font-semibold text-nowrap text-black transition-colors select-none group-hover:text-[#00000000]">
                      Nâng cấp hội viên
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </ProFeatureLocker>
      )}
      <div className="shrink-0 border-b-1 px-5 py-3 text-base leading-[24px] font-semibold">
        Sàn bot XNO
      </div>
      <div className="flex flex-1 flex-col px-5 py-3">
        <Tabs
          variant="underlined"
          color="secondary"
          className="shrink-0"
          classNames={{
            tabList: "w-fit mb-2",
            tab: "px-2 py-0 text-sm font-semibold min-w-fit shrink-0 flex-1",
            panel: "h-full w-full flex-1 min-h-0 pb-0 p-0 flex-1",
            cursor: "w-full",
          }}
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          <Tab key="botphaisinh" title="Bot phái sinh" />
          <Tab key="botcoso" title="Bot cơ sở" />
          <Tab key="botcuatoi" title="Bot của tôi" />
        </Tabs>
        <div className="flex-1 overflow-y-auto pt-4">
          {selectedTab === "botphaisinh" && <BotPhaiSinhSanBot />}
          {selectedTab === "botcoso" && <BotCoSoSanBot />}
          {selectedTab === "botcuatoi" && <BotCuaToi />}
        </div>
      </div>
    </div>
  );
}

function VerifiedCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5924 3.47371C9.34888 3.68124 9.22711 3.78501 9.09706 3.87218C8.79896 4.07198 8.46417 4.21065 8.1121 4.28016C7.95851 4.31048 7.79903 4.32321 7.48008 4.34866C6.6787 4.41261 6.278 4.44459 5.94371 4.56267C5.17051 4.83577 4.56233 5.44395 4.28923 6.21714C4.17115 6.55144 4.13918 6.95213 4.07522 7.75352C4.04977 8.07247 4.03705 8.23195 4.00672 8.38554C3.93721 8.73761 3.79854 9.07239 3.59874 9.3705C3.51158 9.50054 3.40781 9.62231 3.20027 9.86584C2.67883 10.4777 2.4181 10.7837 2.26522 11.1035C1.91159 11.8434 1.91159 12.7035 2.26522 13.4433C2.41811 13.7632 2.67883 14.0691 3.20027 14.681C3.40778 14.9245 3.51158 15.0463 3.59874 15.1764C3.79854 15.4745 3.93721 15.8093 4.00672 16.1613C4.03705 16.3149 4.04977 16.4744 4.07522 16.7934C4.13918 17.5947 4.17115 17.9954 4.28923 18.3297C4.56233 19.1029 5.17051 19.7111 5.94371 19.9842C6.278 20.1023 6.6787 20.1343 7.48008 20.1982C7.79903 20.2237 7.95851 20.2364 8.1121 20.2667C8.46417 20.3362 8.79896 20.4749 9.09706 20.6747C9.22711 20.7619 9.34887 20.8656 9.5924 21.0732C10.2043 21.5946 10.5102 21.8553 10.8301 22.0082C11.57 22.3618 12.43 22.3618 13.1699 22.0082C13.4898 21.8553 13.7957 21.5946 14.4076 21.0732C14.6511 20.8656 14.7729 20.7619 14.9029 20.6747C15.201 20.4749 15.5358 20.3362 15.8879 20.2667C16.0415 20.2364 16.201 20.2237 16.5199 20.1982C17.3213 20.1343 17.722 20.1023 18.0563 19.9842C18.8295 19.7111 19.4377 19.1029 19.7108 18.3297C19.8288 17.9954 19.8608 17.5947 19.9248 16.7934C19.9502 16.4744 19.963 16.3149 19.9933 16.1613C20.0628 15.8093 20.2015 15.4745 20.4013 15.1764C20.4884 15.0463 20.5922 14.9246 20.7997 14.681C21.3212 14.0691 21.5819 13.7632 21.7348 13.4433C22.0884 12.7035 22.0884 11.8434 21.7348 11.1035C21.5819 10.7837 21.3212 10.4777 20.7997 9.86584C20.5922 9.62231 20.4884 9.50054 20.4013 9.3705C20.2015 9.07239 20.0628 8.73761 19.9933 8.38554C19.963 8.23195 19.9502 8.07247 19.9248 7.75352C19.8608 6.95213 19.8288 6.55144 19.7108 6.21714C19.4377 5.44395 18.8295 4.83577 18.0563 4.56267C17.722 4.44459 17.3213 4.41261 16.5199 4.34866C16.201 4.32321 16.0415 4.31048 15.8879 4.28016C15.5358 4.21065 15.201 4.07198 14.9029 3.87218C14.7729 3.78501 14.6511 3.68125 14.4076 3.47371C13.7957 2.95227 13.4898 2.69154 13.1699 2.53865C12.43 2.18503 11.57 2.18503 10.8301 2.53865C10.5102 2.69154 10.2043 2.95227 9.5924 3.47371ZM16.3735 10.1366C16.6913 9.81874 16.6913 9.30343 16.3735 8.9856C16.0557 8.66777 15.5403 8.66777 15.2225 8.9856L10.3723 13.8358L8.77746 12.241C8.45963 11.9232 7.94432 11.9232 7.62649 12.241C7.30866 12.5589 7.30866 13.0742 7.62649 13.392L9.79678 15.5623C10.1146 15.8801 10.6299 15.8801 10.9478 15.5623L16.3735 10.1366Z"
        fill="url(#paint0_linear_32984_421819)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_32984_421819"
          x1="2"
          y1="2.27344"
          x2="22"
          y2="22.2734"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CFF8EA" />
          <stop offset="1" stopColor="#67E1C0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
