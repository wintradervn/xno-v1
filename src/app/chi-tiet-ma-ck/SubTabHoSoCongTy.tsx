import Divider from "@/components/ui/Divider";
import UnfinishedFeature from "@/components/ui/UnfinishedFeature";
import useCompanyProfile from "@/hooks/useCompanyProfile";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import { cn, formatNumber, formatVeryLargeNumber } from "@/lib/utils";
import { useState } from "react";

export default function SubTabHoSoCongTy() {
  const [expanded, setExpanded] = useState(false);
  const { currentSymbol } = useCurrentSymbol();
  const { data: companyProfile } = useCompanyProfile(currentSymbol);

  return (
    <div className="flex h-full w-full gap-6">
      <div className="flex flex-col gap-4">
        <div className="text-lg font-bold">Giới thiệu công ty</div>
        <div className="relative">
          {!expanded && (
            <div
              className="absolute bottom-0 right-0 !z-10 cursor-pointer bg-card text-md font-medium text-[#67E1C0] hover:text-[#abf5e1]"
              onClick={() => setExpanded(true)}
            >
              ...Xem thêm
            </div>
          )}
          <div
            className={cn(
              "z-1 text-sm",
              expanded ? "" : "line-clamp-4 text-ellipsis",
            )}
          >
            {companyProfile?.desc}
            <div
              className="cursor-pointer bg-card pt-2 text-md font-medium text-[#67E1C0] hover:text-[#abf5e1]"
              onClick={() => setExpanded(false)}
            >
              Thu gọn
            </div>
          </div>
        </div>
        <div className="flex w-full gap-8 text-md">
          <div className="flex flex-1 flex-col">
            <div className="py-5 text-lg font-bold">Thông tin cơ bản</div>
            <div className="flex justify-between border-b border-b-muted/20 py-3">
              <div className="text-muted">Mã SIC</div>
              <div className="font-bold">{companyProfile?.code}</div>
            </div>
            <div className="flex justify-between border-b border-b-muted/20 py-3">
              <div className="text-muted">Mã ngành ICB</div>
              <div className="font-bold">{companyProfile?.icb}</div>
            </div>
            <div className="flex justify-between border-b border-b-muted/20 py-3">
              <div className="text-muted">Năm thành lập</div>
              <div className="font-bold">{companyProfile?.foundingdate}</div>
            </div>
            <div className="flex justify-between border-b border-b-muted/20 py-3">
              <div className="text-muted">Vốn điều lệ</div>
              <div className="font-bold">
                {formatVeryLargeNumber(companyProfile?.chartercapital)}
              </div>
            </div>
            <div className="flex justify-between border-b border-b-muted/20 py-3">
              <div className="text-muted">Số lượng nhân sự</div>
              <div className="font-bold">
                {companyProfile?.numberofemployee}
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <div className="py-5 text-lg font-bold">Giới thiệu công ty</div>
            <div className="flex justify-between border-b border-b-muted/20 py-3">
              <div className="text-muted">Ngày niêm yết</div>
              <div className="font-bold">{companyProfile?.listingdate}</div>
            </div>
            <div className="flex justify-between border-b border-b-muted/20 py-3">
              <div className="text-muted">Nơi niêm yết</div>
              <div className="font-bold">{companyProfile?.exchange}</div>
            </div>
            <div className="flex justify-between border-b border-b-muted/20 py-3">
              <div className="text-muted">Giá chào sàn (VNĐ)</div>
              <div className="font-bold">
                {formatNumber(companyProfile?.firstprice)}
              </div>
            </div>
            <div className="flex justify-between border-b border-b-muted/20 py-3">
              <div className="text-muted">Vốn hóa</div>
              <div className="font-bold">
                {formatVeryLargeNumber(companyProfile?.listedvalue)}
              </div>
            </div>
            <div className="flex justify-between border-b border-b-muted/20 py-3">
              <div className="text-muted">KL đang niêm yết</div>
              <div className="font-bold">
                {formatVeryLargeNumber(companyProfile?.issueshare)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Divider className="h-full !w-[2px] flex-shrink-0" />
      <div className="flex w-fit min-w-[300px] flex-shrink-0 flex-col">
        <div className="text-lg font-bold">Ban lãnh đạo</div>
        <UnfinishedFeature>
          <div className="flex flex-col p-1.5">
            <div className="flex justify-between p-1.5 py-4 text-md font-semibold text-muted">
              <div>Họ tên</div>
              <div>Chức vụ</div>
            </div>
            <Divider className="!h-[1px] !w-full" />
            <div className="flex justify-between gap-4 border-b-1 border-default-800 p-1.5 py-4 text-md">
              <div className="font-bold">Nguyễn Thanh Tùng</div>
              <div className="">Chủ tịch Hội đồng Quản trị</div>
            </div>
            <div className="flex justify-between gap-4 border-b-1 border-default-800 p-1.5 py-4 text-md">
              <div className="font-bold">La Thị Hồng Minh</div>
              <div className="">Kế toán trưởng</div>
            </div>
            <div className="flex justify-between gap-4 border-b-1 border-default-800 p-1.5 py-4 text-md">
              <div className="font-bold">Lê Thị Huyền Diệu</div>
              <div className="">Kế toán trưởng</div>
            </div>
            <div className="flex justify-between gap-4 border-b-1 border-default-800 p-1.5 py-4 text-md">
              <div className="font-bold">Nguyễn Thanh Tùng</div>
              <div className="">Chủ tịch Hội đồng Quản trị</div>
            </div>
            <div className="flex justify-between gap-4 border-b-1 border-default-800 p-1.5 py-4 text-md">
              <div className="font-bold">Nguyễn Thanh Tùng</div>
              <div className="">Chủ tịch Hội đồng Quản trị</div>
            </div>
            <div className="flex justify-between gap-4 border-b-1 border-default-800 p-1.5 py-4 text-md">
              <div className="font-bold">Nguyễn Thanh Tùng</div>
              <div className="">Chủ tịch Hội đồng Quản trị</div>
            </div>
            <div className="flex justify-between gap-4 border-b-1 border-default-800 p-1.5 py-4 text-md">
              <div className="font-bold">Nguyễn Thanh Tùng</div>
              <div className="">Chủ tịch Hội đồng Quản trị</div>
            </div>
          </div>
        </UnfinishedFeature>
      </div>
    </div>
  );
}
