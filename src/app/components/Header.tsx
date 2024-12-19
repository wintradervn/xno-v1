"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Bell,
  Global,
  Settings,
  Sun,
  RoundedMagnifer,
  Logout,
} from "solar-icon-set";
import DangNhapModal from "./DangNhapModal";
import {
  Avatar,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import useModalsState, { MODALS } from "@/hooks/useModalsState";

const menuItems = [
  { title: "Giao dịch", url: "/giao-dich" },
  { title: "Thị trường", url: "/thi-truong" },
  { title: "Bảng giá", url: "/bang-gia" },
  { title: "Lọc cổ phiếu", url: "/loc-co-phieu" },
  { title: "Vĩ mô", url: "/vi-mo" },
];

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data } = useSession();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const { openModal: openTimKiemModal } = useModalsState(MODALS.TIM_KIEM);
  return (
    <header className="card flex h-16 items-center justify-between px-5 py-0">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="XNO logo"
          width={146}
          height={44}
          quality={100}
        />
      </Link>
      <div className="bg flex items-center gap-8 font-semibold">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={`${item.url}?${searchParams.toString()}`}
            className={cn(
              "text-nowrap text-center text-sm",
              item.url === pathname
                ? "text-linearpurple font-extrabold"
                : "hover:text-purple-500",
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <div>
        {/* <Input
          classNames={{
            inputWrapper: "w-[320px] h-[32px]",
          }}
          startContent={<RoundedMagnifer size={20} />}
          placeholder="Tìm kiếm"
        /> */}
      </div>
      <div className="flex gap-2">
        <div className="mr-6 flex items-center gap-2">
          <Button
            isIconOnly
            variant="light"
            size="sm"
            radius="full"
            className="mr-3 !bg-transparent text-white hover:text-white"
            onClick={openTimKiemModal}
          >
            <RoundedMagnifer size={20} />
          </Button>
          {data ? (
            <>
              <Dropdown classNames={{ content: "min-w-0" }}>
                <DropdownTrigger>
                  <Avatar
                    src={data.user?.image || undefined}
                    className="h-8 w-8 cursor-pointer"
                  />
                </DropdownTrigger>
                <DropdownMenu className="min-w-0">
                  <DropdownItem
                    key="user"
                    isReadOnly
                    className="cursor-default text-sm"
                  >
                    Xin chào {data.user?.name || ""}!
                  </DropdownItem>
                  <DropdownItem
                    key="dang-xuat"
                    classNames={{ wrapper: "w-fit" }}
                    onClick={() => signOut({ redirect: false })}
                  >
                    <div className="flex items-center justify-center gap-4 text-red">
                      <Logout iconStyle="Linear" size={20} />{" "}
                      <div>Đăng xuất</div>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <>
              <Button
                className="h-[32px] rounded-[8px] bg-transparent px-4 py-2 text-sm font-semibold !text-white data-[hover=true]:bg-transparent"
                variant="light"
                color="primary"
                onClick={() => setShowSignInModal(true)}
              >
                <div className="group-hover:text-linearpurple">Đăng nhập</div>
              </Button>

              <div
                className="text-refine-bg hover:text-refine-bg group relative z-[1] block h-[30px] cursor-pointer appearance-none transition-all duration-100 hover:no-underline focus:outline-none active:scale-[0.98]"
                onClick={() => setShowSignInModal(true)}
              >
                <div className="absolute -bottom-0.5 -left-0.5 -right-0.5 -top-0.5 z-[-1] overflow-hidden rounded-[10px] blur-0">
                  <div className="bg-landing-rainbow animate-spin-slow animate-pause group-hover:animate-running absolute left-[-12.5%] top-[-30px] aspect-square h-auto w-[125%]"></div>
                </div>
                <div className="absolute -bottom-1 -left-1 -right-1 -top-1 z-[-1] overflow-hidden rounded-[14px] opacity-0 blur-[4px] transition-all group-hover:opacity-70">
                  <div className="bg-landing-rainbow animate-spin-slow animate-pause group-hover:animate-running absolute left-[-12.5%] top-[-30px] aspect-square h-auto w-[125%]"></div>
                </div>
                <div className="rounded-[8px] bg-white">
                  <div className="flex items-center justify-center gap-2 transition-transform duration-100 ease-in-out">
                    <div className="text-with-gradient animate-pause group-hover:animate-running !h-[30px] select-none text-nowrap rounded-[8px] px-4 py-1.5 text-sm font-semibold text-black transition-colors group-hover:text-[#00000000]">
                      Đăng ký
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          radius="full"
          className="!bg-transparent text-muted hover:text-white"
        >
          <Global size={24} />
        </Button>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          radius="full"
          className="!bg-transparent text-muted hover:text-white"
        >
          <Bell size={24} />
        </Button>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          radius="full"
          className="!bg-transparent text-muted hover:text-white"
        >
          <Sun size={24} />
        </Button>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          radius="full"
          className="!bg-transparent text-muted hover:text-white"
        >
          <Settings size={24} />
        </Button>
      </div>
      <DangNhapModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </header>
  );
}
