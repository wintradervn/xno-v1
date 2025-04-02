import Link from "next/link";
import Button from "./Button";
import useIsMobile from "@/hooks/useIsMobile";
import ProLocker from "../icons/ProLocker";
import { ReactNode } from "react";
import useTheme from "@/hooks/useTheme";

export default function ProFeatureLocker({
  bgUrl,
  mobileUrl,
  lightBgUrl,
  lightMobileUrl,
  children,
  backgroundSize,
}: {
  bgUrl?: string;
  mobileUrl?: string;
  lightBgUrl?: string;
  lightMobileUrl?: string;
  children?: ReactNode;
  backgroundSize?: string;
}) {
  const isMobile = useIsMobile();
  const { isLightMode } = useTheme();
  const url = isLightMode
    ? isMobile && lightMobileUrl
      ? lightMobileUrl
      : lightBgUrl || ""
    : isMobile && mobileUrl
      ? mobileUrl
      : bgUrl || "";

  return (
    <div
      className="absolute inset-0 z-[100]"
      style={{
        backgroundImage: bgUrl ? `url(${url})` : undefined,
        backgroundSize: backgroundSize || "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="@container absolute inset-0 flex items-center justify-center backdrop-blur-[4px]">
        <div className="flex flex-col items-center gap-3">
          <div className="shrink-0">
            <ProLocker />
          </div>
          {children || (
            <>
              <div className="@xl:text-md mb-3 px-3 text-center text-sm font-semibold">
                Vui lòng{" "}
                <span className="text-linearpurple font-black">Đăng nhập</span>{" "}
                để có thể xem đầy đủ tính năng này
              </div>
              <Link href="/login">
                <Button color="primary" className="font-bold shadow-md">
                  Đăng nhập
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
