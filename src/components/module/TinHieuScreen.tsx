"use client";
import { IFilterProData } from "@/hooks/useFilterProData";
import useTinHieuMuaBan from "@/hooks/useTinHieuMuaBan";
import BulkStar from "@/icons/BulkStar";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import FavoriteStarButton from "../FavoriteStarButton";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import DefaultLoader from "../ui/DefaultLoader";

export default function TinHieuScreen({ noTitle }: { noTitle?: boolean }) {
  const { tinHieuBan, tinHieuMua, isLoading } = useTinHieuMuaBan();
  const { setChiTietMaCK } = useChiTietMaCK();
  const [isOpenDetailModal, setIsOpenDetailModal] = useState(false);
  const [selectedData, setSelectedData] = useState<
    IFilterProData & { type: string; date: string }
  >();

  const tinHieu = useMemo(
    () =>
      [...tinHieuMua].sort((a, b) =>
        new Date(a.date) > new Date(b.date) ? -1 : 1,
      ),
    [tinHieuBan, tinHieuMua],
  );
  return (
    <div className="flex h-full w-full min-w-[340px] flex-col">
      {!noTitle && (
        <div className="border-purple dark:border-lineargreen text-lineargreen w-fit shrink-0 border-b-2 px-2 py-2 text-sm font-semibold">
          Tín hiệu
        </div>
      )}
      <div className="no-scrollbar h-full overflow-auto">
        <div>
          {isLoading ? (
            <div>
              <DefaultLoader />
            </div>
          ) : (
            tinHieu.map((item, index) => {
              const isMua = item.type === "MUA";
              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 border-b-2 py-4 pl-2 dark:border-neutral-800"
                >
                  <div
                    className="flex cursor-pointer items-center gap-2"
                    onClick={() => setChiTietMaCK(item.MA)}
                  >
                    <div
                      className="flex cursor-pointer items-center gap-2"
                      onClick={() => setChiTietMaCK(item.MA)}
                    >
                      <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-white">
                        <img
                          src={`https://finance.vietstock.vn/image/${item.MA}`}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="text-caption flex shrink-0 items-center">
                        {item.MA}{" "}
                        <FavoriteStarButton symbol={item.MA} size={16} />
                      </div>
                      {item.type === "MUA" ? (
                        <>
                          <TrendingUpSVG />{" "}
                          <div className="text-md font-semibold text-nowrap">
                            Xuất hiện khả năng tăng giá
                          </div>
                        </>
                      ) : (
                        <>
                          <TrendingDownSVG />{" "}
                          <div className="text-md font-semibold text-nowrap">
                            Xuất hiện khả năng giảm giá
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-muted text-justify text-sm">
                    {`Tín hiệu Khả năng ${item.type === "MUA" ? "tăng" : "giảm"} giá đã xuất hiện cho ${item.MA} theo chiến lược `}
                    <span className="text-linearpurple font-extrabold!">
                      {item.CHIENLUOC.replaceAll(";", "")}
                    </span>
                  </div>
                  <div className="text-muted flex min-w-fit items-center justify-between gap-2 text-sm text-nowrap">
                    <div className="text-nowrap">
                      Vùng giá:
                      <span className="text-md ml-1 font-semibold text-white">
                        {item.GIA}
                      </span>
                    </div>
                    {/* <div>
                    AI dự đoán 20 phiên:
                    <span className="ml-1 text-md font-semibold text-white">
                      {item.AIPredict20d}
                    </span>
                  </div>
                  <div
                    className="flex h-6 w-fit items-center rounded-full border-1 px-2 text-xs font-semibold text-white"
                    style={{
                      borderColor: color,
                      backgroundColor: color + "32",
                    }}
                  >
                    {isMua ? "Upsize" : "Downsize"}{" "}
                    {formatNumber(
                      Math.abs((item.AIPredict20d - item.GIA) / item.GIA) * 100,
                      2,
                    )}
                    %
                  </div> */}
                  </div>
                  <div className="flex justify-between">
                    <div className="text-muted text-sm">
                      {format(new Date(item.date), "dd/MM/yyyy HH:mm")}
                    </div>
                    <div
                      className="text-lineargreen border-purple dark:border-lineargreen flex cursor-pointer items-center gap-1 border-b-1 text-sm hover:brightness-150"
                      onClick={() => {
                        setSelectedData(item);
                        setIsOpenDetailModal(true);
                      }}
                    >
                      Xem thêm{" "}
                      <ArrowRight
                        className="text-purple dark:text-[#67E1C0]"
                        size={12}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {selectedData && (
        <DetailModal
          isOpen={isOpenDetailModal}
          onClose={() => setIsOpenDetailModal(false)}
          item={selectedData}
        />
      )}
    </div>
  );
}

function TrendingUpSVG() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23 6L13.5 15.5L8.5 10.5L1 18M23 6H17M23 6V12"
        stroke="url(#paint0_linear_31242_268654)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_31242_268654"
          x1="1"
          y1="6"
          x2="11.0892"
          y2="24.4968"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CFF8EA" />
          <stop offset="1" stopColor="#67E1C0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TrendingDownSVG() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23 18L13.5 8.5L8.5 13.5L1 6M23 18H17M23 18V12"
        stroke="url(#paint0_linear_31213_450088)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_31213_450088"
          x1="1"
          y1="6"
          x2="11.0892"
          y2="24.4968"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFCCE2" />
          <stop offset="1" stopColor="#FF135B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const ChiBaoXuHuongBadge = ({ value }: { value?: string }) => {
  let color = "#FF135B";
  if (value === "Giảm mạnh" || value?.startsWith("Sell")) {
    color = "#FF135B";
  }
  if (value === "Giảm") {
    color = "#FF9783";
  }
  if (value === "Tăng" || value === "Uptrend" || value?.startsWith("Buy")) {
    color = "#1FAD8E";
  }
  if (value?.startsWith("Tăng mạnh")) {
    color = "#7B61FF";
  }
  if (value === "Sideway") {
    color = "#F1C617";
  }
  return (
    <div
      className="h-[28px] w-[80px] rounded-full border-1 p-1 text-center"
      style={{ borderColor: color, backgroundColor: color + "32" }}
    >
      {value}
    </div>
  );
};

function DetailModal({
  isOpen,
  item,
  onClose,
}: {
  isOpen: boolean;
  item: IFilterProData & { type: string; date: string };
  onClose: () => void;
}) {
  const isMua = item.type === "MUA";
  const color = isMua ? "#1FAD8E" : "#FF135B";
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="bg-card rounded-[8px] shadow-lg"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="justify-center">Tín hiệu</ModalHeader>
        <ModalBody className="px-4 py-0">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-white">
              <img
                src={`https://finance.vietstock.vn/image/${item.MA}`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-caption flex items-center">
              {item.MA} <FavoriteStarButton symbol={item.MA} size={16} />
            </div>

            {item.type === "MUA" ? (
              <>
                <TrendingUpSVG />{" "}
                <div className="text-md font-semibold">
                  Xuất hiện khả năng tăng giá
                </div>
              </>
            ) : (
              <>
                <TrendingDownSVG />{" "}
                <div className="text-md font-semibold">
                  Xuất hiện khả năng giảm giá
                </div>
              </>
            )}
          </div>
          <div className="text-muted text-sm">
            {`Tín hiệu Khả năng ${item.type === "MUA" ? "tăng" : "giảm"} giá đã xuất hiện cho ${item.MA} theo chiến lược `}
            <span className="text-linearpurple font-extrabold!">
              {item.CHIENLUOC.replaceAll(";", "")}
            </span>
          </div>
          <div className="text-muted flex flex-wrap items-center gap-2 text-sm">
            <div className="text-nowrap">
              Vùng giá:
              <span className="text-md ml-1 font-semibold text-white">
                {item.GIA}
              </span>
            </div>

            {/* <div>
              AI dự đoán 20 phiên:
              <span className="ml-1 text-md font-semibold text-white">
                {item.AIPredict20d}
              </span>
            </div>
            <div
              className="flex h-6 w-fit items-center rounded-full border-1 px-2 text-xs font-semibold text-white"
              style={{
                borderColor: color,
                backgroundColor: color + "32",
              }}
            >
              {isMua ? "Upsize" : "Downsize"}{" "}
              {formatNumber(
                Math.abs((item.AIPredict20d - item.GIA) / item.GIA) * 100,
                2,
              )}
              %
            </div> */}
          </div>
          <div className="flex min-h-[100px] flex-col items-center gap-2 rounded-[6px] border-1 p-3">
            <div className="relative mb-2 flex h-7 items-center overflow-hidden rounded-full bg-[#CFF8EB] px-2 pl-9 text-sm font-semibold text-[#16594E]">
              <div className="bg-lineargreen absolute top-[-6px] -left-2 flex h-10 w-10 items-center justify-center rounded-full text-[#1FAD8E]">
                <BulkStar />
              </div>
              AI nhận định
            </div>
            <div className="text-sm">
              {item.cmtTA || "Chưa có nhận định từ AI"}
            </div>
          </div>
          <div className="flex min-h-[200px] flex-col items-center gap-3 rounded-[6px] border-1 p-2">
            <div className="text-md font-semibold text-white">Xu hướng</div>
            <div className="grid h-[28px] w-full grid-cols-2 items-center text-sm">
              <div>AI Trend</div>
              <div className="flex justify-end">
                <ChiBaoXuHuongBadge value={item.AiTrend} />
              </div>
            </div>
            <div className="grid h-[28px] w-full grid-cols-2 items-center text-sm">
              <div>Xu hướng ngắn hạn</div>
              <div className="flex justify-end">
                <ChiBaoXuHuongBadge value={item.NGANHAN} />
              </div>
            </div>
            <div className="grid h-[28px] w-full grid-cols-2 items-center text-sm">
              <div>Tín hiệu SMC</div>
              <div className="flex justify-end">
                <ChiBaoXuHuongBadge value={item.signalSMC} />
              </div>
            </div>
            <div className="grid h-[28px] w-full grid-cols-2 items-center text-sm">
              <div>Khối lượng giao dịch so với TB 50 phiên:</div>
              <div className="flex justify-end">{item.KL1KLTB}</div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="dark:text-linearorange flex gap-2 text-sm text-[#DC6803]">
          <div className="shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.5119 5.85L13.5719 2.42C12.6019 1.86 11.4019 1.86 10.4219 2.42L4.49187 5.85C3.52187 6.41 2.92188 7.45 2.92188 8.58V15.42C2.92188 16.54 3.52187 17.58 4.49187 18.15L10.4319 21.58C11.4019 22.14 12.6019 22.14 13.5819 21.58L19.5219 18.15C20.4919 17.59 21.0919 16.55 21.0919 15.42V8.58C21.0819 7.45 20.4819 6.42 19.5119 5.85ZM11.2519 7.75C11.2519 7.34 11.5919 7 12.0019 7C12.4119 7 12.7519 7.34 12.7519 7.75V13C12.7519 13.41 12.4119 13.75 12.0019 13.75C11.5919 13.75 11.2519 13.41 11.2519 13V7.75ZM12.9219 16.63C12.8719 16.75 12.8019 16.86 12.7119 16.96C12.5219 17.15 12.2719 17.25 12.0019 17.25C11.8719 17.25 11.7419 17.22 11.6219 17.17C11.4919 17.12 11.3919 17.05 11.2919 16.96C11.2019 16.86 11.1319 16.75 11.0719 16.63C11.0219 16.51 11.0019 16.38 11.0019 16.25C11.0019 15.99 11.1019 15.73 11.2919 15.54C11.3919 15.45 11.4919 15.38 11.6219 15.33C11.9919 15.17 12.4319 15.26 12.7119 15.54C12.8019 15.64 12.8719 15.74 12.9219 15.87C12.9719 15.99 13.0019 16.12 13.0019 16.25C13.0019 16.38 12.9719 16.51 12.9219 16.63Z"
                fill="url(#paint0_linear_31215_447487)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_31215_447487"
                  x1="2.92188"
                  y1="2"
                  x2="22.8301"
                  y2="20.0867"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FFE3D6" />
                  <stop offset="1" stopColor="#FF9783" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="">
            Lưu ý : Tín hiệu được tổng hợp dựa trên xác suất xuất hiện mẫu hình
            và đạt lợi nhuận trong quá khứ. Nhà đầu tư cần kiểm chứng, thiết đặt
            ngưỡng cắt lỗ/chốt lời phù hợp và kết hợp với phân tích cơ bản doanh
            nghiệp để đạt hiệu quả đầu tư tốt nhất.
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
