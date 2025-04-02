"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Bell,
  Global,
  Settings,
  Sun,
  RoundedMagnifer,
  Logout,
  MoonStars,
  User,
  UserCircle,
} from "solar-icon-set";
import DangNhapModal from "./DangNhapModal";
import {
  Avatar,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Popover from "@/components/ui/Popover";
import Input from "@/components/ui/Input";
import { Menu, X } from "lucide-react";
import SearchResultUI from "@/components/SearchSymbol/SearchResultUI";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useIsMobile from "@/hooks/useIsMobile";
import { useCookies } from "react-cookie";
import useTheme from "@/hooks/useTheme";
import { useAuthStore } from "@/store/auth";
import { getAuth, signOut } from "firebase/auth";

const menuItems = [
  { title: "Giao dịch", url: "/giao-dich" },
  // { title: "Thị trường", url: "/thi-truong" },
  { title: "Bảng giá", url: "/bang-gia" },
  { title: "Lọc cổ phiếu", url: "/loc-co-phieu" },
  { title: "Sàn bot", url: "/san-bot" },
];

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [searchSymbol, setSearchSymbol] = useState("");
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const { setChiTietMaCK } = useChiTietMaCK();
  const isMobile = useIsMobile();
  const [cookies, setCookie] = useCookies(["theme"]);
  const { isLightMode } = useTheme();
  const { user } = useAuthStore();

  const [firstSymbol, setFirstSymbol] = useState<string | undefined>();

  useEffect(() => {
    setSearchSymbol("");
  }, [isOpenSearch]);

  useEffect(() => {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(cookies.theme);
  }, [cookies.theme]);

  useEffect(() => {
    if (!cookies.theme) {
      setCookie("theme", "dark");
    }
  }, []);

  return (
    <header className="card flex h-16 items-center justify-between px-3 py-0 sm:px-5">
      <div className="flex items-center gap-3">
        {isMobile && <MobileMenu />}
        <Link href="/" className="h-fit w-20 sm:w-28">
          <img
            src="/logo.png"
            alt="XNO logo"
            style={{ objectFit: "contain" }}
          />
        </Link>
      </div>
      <div className="bg hidden items-center gap-8 font-semibold sm:flex">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={`${item.url}?${searchParams.toString()}`}
            className={cn(
              "shrink-0 text-center text-sm text-nowrap",
              item.url === pathname
                ? "text-linearpurple font-extrabold"
                : "hover:text-purple-500",
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <div className="mr-2 flex gap-2 sm:gap-2">
        <div className="flex items-center gap-2 sm:mr-6">
          <Popover isOpen={isOpenSearch} onClose={() => setIsOpenSearch(false)}>
            <PopoverTrigger>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                radius="full"
                className="text-muted hover:text-foreground bg-transparent! sm:mr-3"
                onClick={() => setIsOpenSearch(true)}
              >
                <RoundedMagnifer size={24} />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex max-w-[500px] flex-col gap-2">
                <Input
                  autoFocus
                  placeholder="Tìm mã CK"
                  value={searchSymbol}
                  onValueChange={setSearchSymbol}
                  endContent={
                    searchSymbol && (
                      <button
                        className="hover:text-foreground/80 rounded-full transition-all hover:bg-neutral-800 active:bg-neutral-700"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSearchSymbol("");
                        }}
                      >
                        <X size={20} />
                      </button>
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearchSymbol("");
                    }
                    if (e.key === "Enter" && firstSymbol && searchSymbol) {
                      setChiTietMaCK(firstSymbol);
                      setIsOpenSearch(false);
                    }
                  }}
                />
                <SearchResultUI
                  search={searchSymbol}
                  onSearch={(s) => {
                    setChiTietMaCK(s);
                    setIsOpenSearch(false);
                  }}
                  onDataChanged={(data) => {
                    setFirstSymbol(data?.[0]?.code);
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
          <div className="hidden sm:contents">
            {user ? (
              <UserLogo />
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-refine-bg hover:text-refine-bg group relative z-1 block h-[30px] cursor-pointer appearance-none transition-all duration-100 hover:no-underline focus:outline-hidden active:scale-[0.98]"
                >
                  <div className="blur-0 absolute -top-0.5 -right-0.5 -bottom-0.5 -left-0.5 z-[-1] overflow-hidden rounded-[10px]">
                    <div className="bg-landing-rainbow animate-spin-slow animate-pause group-hover:animate-running absolute top-[-30px] left-[-12.5%] aspect-square h-auto w-[125%]"></div>
                  </div>
                  <div className="absolute -top-1 -right-1 -bottom-1 -left-1 z-[-1] overflow-hidden rounded-[14px] opacity-0 blur-[4px] transition-all group-hover:opacity-70">
                    <div className="bg-landing-rainbow animate-spin-slow animate-pause group-hover:animate-running absolute top-[-30px] left-[-12.5%] aspect-square h-auto w-[125%]"></div>
                  </div>
                  <div className="rounded-[8px] bg-white">
                    <div className="flex items-center justify-center gap-2 transition-transform duration-100 ease-in-out">
                      <div className="text-with-gradient animate-pause group-hover:animate-running h-[30px]! rounded-[8px] px-4 py-1.5 text-sm font-semibold text-nowrap text-black transition-colors select-none group-hover:text-[#00000000]">
                        Đăng nhập
                      </div>
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
        {/* <Button
          isIconOnly
          variant="light"
          size="sm"
          radius="full"
          className="text-muted hover:text-foreground hidden bg-transparent! sm:flex"
        >
          <Global size={24} />
        </Button> */}
        <Button
          isIconOnly
          variant="light"
          size="sm"
          radius="full"
          className="text-muted hover:text-foreground bg-transparent!"
        >
          <Bell size={24} />
        </Button>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          radius="full"
          className="text-muted hover:text-foreground bg-transparent!"
          onPress={() => setCookie("theme", isLightMode ? "dark" : "light")}
        >
          {isLightMode ? <MoonStars size={24} /> : <Sun size={24} />}
        </Button>
        {/* <Button
          isIconOnly
          variant="light"
          size="sm"
          radius="full"
          className="text-muted hover:text-foreground hidden bg-transparent! sm:flex"
        >
          <Settings size={24} />
        </Button> */}
        {isMobile ? (
          <>
            {user ? (
              <UserLogo />
            ) : (
              <Link
                href="/login"
                className="text-muted hover:text-foreground flex h-8 w-8 items-center justify-center bg-transparent! sm:hidden"
              >
                <UserCircle size={24} />
              </Link>
            )}
          </>
        ) : null}
      </div>
      <DangNhapModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </header>
  );
}

function MobileMenu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [, setCookie] = useCookies(["theme"]);
  const { isLightMode } = useTheme();

  return (
    <div>
      <Button
        onPress={(e) => {
          onOpen();
        }}
        isIconOnly
        className="h-7 w-7 min-w-fit rounded-full bg-transparent p-0"
      >
        <Menu size={24} />
      </Button>
      <Drawer
        // isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="left"
        className="bg-card rounded-[0px]"
        classNames={{
          closeButton: "text-[24px] p-4 bg-transparent!",
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 border-b-1 py-5">
                <Link href="/" className="h-fit w-20">
                  <img
                    src="/logo.png"
                    alt="XNO logo"
                    style={{ objectFit: "contain" }}
                  />
                </Link>
              </DrawerHeader>
              <DrawerBody className="px-0 py-0">
                <div className="flex flex-col">
                  {menuItems.map((item) => (
                    <Link
                      key={item.title}
                      href={`${item.url}?${searchParams.toString()}`}
                      className={cn(
                        "text-md border-b-1 p-4 text-nowrap",
                        item.url === pathname
                          ? "text-linearpurple font-extrabold"
                          : "hover:text-purple-500",
                      )}
                      onClick={() => item.url !== pathname && onClose()}
                    >
                      {item.title}
                    </Link>
                  ))}
                  {/* <Button
                    className="text-md flex h-[52px] scale-100! justify-between rounded-none border-b-1 bg-transparent! px-4 py-5 text-nowrap"
                    onPress={() =>
                      setCookie("theme", isLightMode ? "dark" : "light")
                    }
                  >
                    <div className="text-foreground!">Chế độ sáng tối</div>
                    <div>
                      {isLightMode ? (
                        <MoonStars size={24} />
                      ) : (
                        <Sun size={24} />
                      )}
                    </div>
                  </Button> */}
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function UserLogo() {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <Dropdown classNames={{ content: "min-w-0" }}>
      <DropdownTrigger>
        <Avatar
          src={user.photoURL || undefined}
          className="h-8 w-8 cursor-pointer"
        />
      </DropdownTrigger>
      <DropdownMenu className="min-w-0">
        <DropdownItem
          key="user"
          isReadOnly
          className="pointer-events-none cursor-default text-sm"
        >
          Xin chào {user.displayName || ""}!
        </DropdownItem>
        <DropdownItem
          key="dang-xuat"
          classNames={{ wrapper: "w-fit" }}
          onPress={() => signOut(getAuth())}
        >
          <div className="text-red flex items-center justify-center gap-4">
            <Logout iconStyle="Linear" size={20} /> <div>Đăng xuất</div>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
