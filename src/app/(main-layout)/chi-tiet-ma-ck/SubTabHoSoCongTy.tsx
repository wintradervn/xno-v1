import DefaultLoader from "@/components/ui/DefaultLoader";
import Divider from "@/components/ui/Divider";
import { ScrollArea } from "@/components/ui/scroll-area";
import UnfinishedFeature from "@/components/ui/UnfinishedFeature";
import useDNSELeaderships from "@/hooks/dnse/useDNSELeaderships";
import useCompanyProfile from "@/hooks/useCompanyProfile";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import { cn, formatNumber, formatVeryLargeNumber } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function SubTabHoSoCongTy() {
  const [expanded, setExpanded] = useState(false);
  const { currentSymbol } = useCurrentSymbol();
  const { data: companyProfile } = useCompanyProfile(currentSymbol);

  const { data: leaderships, isLoading: leadershipsLoading } =
    useDNSELeaderships(currentSymbol);

  const bodPositions = useMemo(
    () => leaderships?.filter((leader) => leader.bodPositions),
    [leaderships],
  );
  const bomPositions = useMemo(
    () => leaderships?.filter((leader) => leader.bomPositions),
    [leaderships],
  );

  return (
    <div className="flex h-full w-full flex-col gap-6 sm:flex-row">
      <div className="no-scrollbar flex h-full flex-col gap-4 overflow-auto">
        <div className="shrink-0 text-lg font-bold">Giới thiệu công ty</div>
        <div className="relative shrink-0">
          {!expanded && (
            <div
              className="bg-card text-md absolute right-0 bottom-0 z-10! cursor-pointer font-medium text-[#67E1C0] hover:text-[#abf5e1]"
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
              className="bg-card text-md cursor-pointer pt-2 font-medium text-[#67E1C0] hover:text-[#abf5e1]"
              onClick={() => setExpanded(false)}
            >
              Thu gọn
            </div>
          </div>
        </div>
        <div className="text-md flex w-full shrink-0 flex-col gap-8 md:flex-row">
          <div className="flex flex-1 flex-col">
            <div className="py-5 text-lg font-bold">Thông tin cơ bản</div>
            <div className="border-b-muted/20 flex justify-between border-b py-3">
              <div className="text-muted">Mã SIC</div>
              <div className="font-bold">{companyProfile?.code}</div>
            </div>
            <div className="border-b-muted/20 flex justify-between border-b py-3">
              <div className="text-muted">Mã ngành ICB</div>
              <div className="font-bold">{companyProfile?.icb}</div>
            </div>
            <div className="border-b-muted/20 flex justify-between border-b py-3">
              <div className="text-muted">Năm thành lập</div>
              <div className="font-bold">{companyProfile?.foundingdate}</div>
            </div>
            <div className="border-b-muted/20 flex justify-between border-b py-3">
              <div className="text-muted">Vốn điều lệ</div>
              <div className="font-bold">
                {formatVeryLargeNumber(companyProfile?.chartercapital)}
              </div>
            </div>
            <div className="border-b-muted/20 flex justify-between border-b py-3">
              <div className="text-muted">Số lượng nhân sự</div>
              <div className="font-bold">
                {companyProfile?.numberofemployee}
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <div className="py-5 text-lg font-bold">Giới thiệu công ty</div>
            <div className="border-b-muted/20 flex justify-between border-b py-3">
              <div className="text-muted">Ngày niêm yết</div>
              <div className="font-bold">{companyProfile?.listingdate}</div>
            </div>
            <div className="border-b-muted/20 flex justify-between border-b py-3">
              <div className="text-muted">Nơi niêm yết</div>
              <div className="font-bold">{companyProfile?.exchange}</div>
            </div>
            <div className="border-b-muted/20 flex justify-between border-b py-3">
              <div className="text-muted">Giá chào sàn (VNĐ)</div>
              <div className="font-bold">
                {formatNumber(companyProfile?.firstprice)}
              </div>
            </div>
            <div className="border-b-muted/20 flex justify-between border-b py-3">
              <div className="text-muted">Vốn hóa</div>
              <div className="font-bold">
                {formatVeryLargeNumber(companyProfile?.listedvalue)}
              </div>
            </div>
            <div className="border-b-muted/20 flex justify-between border-b py-3">
              <div className="text-muted">KL đang niêm yết</div>
              <div className="font-bold">
                {formatNumber(companyProfile?.issueshare)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Divider className="h-full w-[1px]! shrink-0 dark:w-[2px]!" />
      <div className="flex shrink-0 flex-col sm:w-fit sm:min-w-[300px]">
        <ScrollArea>
          <div className="text-lg font-bold">Hội đồng quản trị</div>
          <div className="flex flex-col">
            <div className="text-md text-muted flex shrink-0 justify-between py-4 font-semibold">
              <div>Họ tên</div>
              <div>Chức vụ</div>
            </div>
            <Divider className="h-[1px]! w-full!" />
            {leadershipsLoading ? (
              <DefaultLoader />
            ) : (
              <>
                {bodPositions?.map((leader) => (
                  <div
                    key={leader.id}
                    className="border-background dark:border-default-800 text-md flex shrink-0 justify-between gap-4 border-b-1 py-3"
                  >
                    <div className="font-bold">{leader.name}</div>
                    <div className="max-w-[160px]">{leader.bodPositions}</div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="mt-6 text-lg font-bold">Ban giám đốc</div>
          <div className="flex flex-col">
            <div className="text-md text-muted flex shrink-0 justify-between py-4 font-semibold">
              <div>Họ tên</div>
              <div>Chức vụ</div>
            </div>
            <Divider className="h-[1px]! w-full!" />
            {leadershipsLoading ? (
              <DefaultLoader />
            ) : (
              <>
                {bomPositions?.map((leader) => (
                  <div
                    key={leader.id}
                    className="border-background dark:border-default-800 text-md flex shrink-0 justify-between gap-4 border-b-1 py-3 text-right"
                  >
                    <div className="font-bold">{leader.name}</div>
                    <div className="max-w-[160px]">{leader.bomPositions}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
