import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
} from "@nextui-org/react";
import Tabs from "../../ui/Tabs";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useTaiKhoanChungKhoan from "@/hooks/useTaiKhoanChungKhoan";
import useLienKetTKCKModal from "@/hooks/useLienKetTKCK";
import Input from "../../ui/Input";
import { cn, formatNumber } from "@/lib/utils";
import { Calendar, RoundedMagnifer } from "solar-icon-set";
import Button from "../../ui/Button";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Timer,
  X,
} from "lucide-react";
import { useFormik } from "formik";
import useDNSEAccounts from "@/hooks/dnse/useDNSEAccounts";
import XacNhanSmartOTP from "../../modals/XacNhanSmartOTP";
import * as Yup from "yup";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import useDNSELoanPackages from "@/hooks/dnse/useDNSELoanPackages";
import useDNSEUserInfo from "@/hooks/dnse/useDNSEUserInfo";
import { postPlaceOrder } from "@/lib/dnse-api";
import { toast } from "react-toastify";
import useDNSESucMuaBan from "@/hooks/dnse/useDNSESucMuaBan";
import useModalsState, { MODALS } from "@/hooks/useModalsState";
import ConfirmationModal from "../../ui/ConfirmationModal";
import ChonGoiVay from "./ChonGoiVay";
import useSelectedGoiVay from "@/hooks/useSelectedGoiVay";
import SearchSymbolInput from "@/components/ui/SearchSymbolInput";

export default function GiaoDich() {
  const [isOpenXacNhanSmartOTP, setIsOpenXacNhanSmartOTP] = useState(false);
  const [typingValue, setTypingValue] = useState<string>("");
  const [isOpenTKDaLienKetModal, setIsOpenTKDaLienKetModal] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<"lenhThuong" | "lenhDieuKien">(
    "lenhThuong",
  );
  const { currentSymbol, isIndex, setCurrentSymbol } = useCurrentSymbol();
  const { jwtToken } = useTaiKhoanChungKhoan();
  const { toggle } = useLienKetTKCKModal();
  const { data: userInfo } = useDNSEUserInfo();

  const { openModal: openTimKiemModal } = useModalsState(MODALS.TIM_KIEM);
  const isNotConnected = !jwtToken;

  const handleRequestOTP = useCallback(() => {
    setIsOpenXacNhanSmartOTP(true);
  }, []);

  useEffect(() => {
    setSelectedSymbol(currentSymbol);
  }, [currentSymbol]);

  if (isNotConnected) {
    return (
      <div className="flex h-28 w-full flex-col items-center justify-center gap-2 text-sm">
        <div>Bạn chưa liên kết tài khoản chứng khoán</div>
        <div
          className="text-linearpurple underline-green cursor-pointer border-b border-[#B7B1FF] font-semibold hover:brightness-125"
          onClick={toggle}
        >
          Vui lòng liên kết tài khoản
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex items-center gap-2">
        <div
          className="group flex cursor-pointer items-center gap-2"
          onClick={() => setIsOpenTKDaLienKetModal(true)}
        >
          <div className="h-6 w-6 overflow-hidden rounded-full">
            <img
              src="/image/dnse.png"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          <div className="text-xl font-semibold">DNSE</div>
          <div className="text-muted group-hover:text-white">
            <ChevronDown size={20} />
          </div>
        </div>
        <div className="overflow-hidden text-ellipsis text-nowrap text-sm text-muted">
          Tài khoản: {userInfo?.id} {userInfo?.name && `- ${userInfo.name}`}
        </div>
      </div>
      <Tabs
        radius="sm"
        variant="solid"
        classNames={{
          wrapper: "w-full ",
          base: "w-full !px-0",
          tabList: "flex-1 !bg-content1 p-0 rounded-[8px] h-10 shadow-lg",
          cursor: "!bg-background rounded-[8px]",
          tab: "flex-1 text-sm !p-3 h-10",
        }}
        color="secondary"
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as any)}
      >
        <Tab key="lenhThuong" title="Lệnh thường"></Tab>
        <Tab key="lenhDieuKien" title="Lệnh điều kiện"></Tab>
      </Tabs>
      <SearchSymbolInput />
      <div className="flex flex-col gap-3">
        {isIndex ? (
          <div className="flex h-20 w-full items-center justify-center text-sm text-muted">
            Vui lòng chọn mã CK khác
          </div>
        ) : (
          <>
            {selectedTab === "lenhThuong" && (
              <TabLenhThuong
                symbol={selectedSymbol}
                onRequestOTP={handleRequestOTP}
              />
            )}
            {selectedTab === "lenhDieuKien" && <TabLenhDieuKien />}
          </>
        )}
      </div>
      <XacNhanSmartOTP
        isOpen={isOpenXacNhanSmartOTP}
        onClose={() => setIsOpenXacNhanSmartOTP(false)}
      />
      <TaiKhoanDaLienKetModal
        isOpen={isOpenTKDaLienKetModal}
        onClose={() => setIsOpenTKDaLienKetModal(false)}
      />
    </div>
  );
}

function TabLenhThuong({
  symbol,
  onRequestOTP,
}: {
  symbol: string;
  onRequestOTP?: () => void;
}) {
  const { data } = useDNSEAccounts();
  const { jwtToken, tradingToken } = useTaiKhoanChungKhoan();
  const accountNo = data?.default.id;
  const { data: loanPackages } = useDNSELoanPackages();
  const { data: marketOverviewData } = useMarketOverviewData();
  const symbolData = useMemo(
    () => marketOverviewData?.find((value) => value.code === symbol),
    [marketOverviewData, symbol],
  );

  const { selectedGoiVay } = useSelectedGoiVay();

  const { data: sucmuasucban } = useDNSESucMuaBan({
    symbol: symbol,
    price: symbolData?.price ? symbolData.price.toString() : "",
    loanPackageId: selectedGoiVay,
  });

  const [isSubmittingBuy, setIsSubmittingBuy] = useState(false);
  const [isSubmittingSell, setIsSubmittingSell] = useState(false);
  const [isBuy, setIsBuy] = useState<boolean | undefined>(undefined);
  const [isOpenConfiramtion, setIsOpenConfiramtion] = useState(false);

  const formik = useFormik({
    initialValues: {
      symbol: symbol,
      orderType: "LO",
      price: 0,
      quantity: 0,
    },
    onSubmit: () => {},
    validationSchema: Yup.object({
      price: Yup.number()
        .required("Giá không được bỏ trống")
        .min(1, "Giá không được nhỏ hơn 1")
        .min(
          (symbolData?.floor || 1000) / 1000,
          "Giá không được nhỏ hơn giá sàn",
        )
        .max(
          (symbolData?.ceiling || 1000) / 1000,
          "Giá không được lớn hơn giá trần",
        ),
      quantity: Yup.number()
        .required("Khối lượng không được bỏ trống")
        .min(1, "Khối lượng không được nhỏ hơn 1")
        .max(
          isBuy === undefined
            ? Math.max(
                sucmuasucban?.qmaxLong || 0,
                sucmuasucban?.qmaxShort || 0,
              )
            : isBuy
              ? sucmuasucban?.qmaxLong || 0
              : sucmuasucban?.qmaxShort || 0,
          isBuy === undefined
            ? "KL vượt giới hạn GD"
            : isBuy
              ? "KL mua vượt giới hạn GD"
              : "KL bán vượt giới hạn GD",
        )
        .test("is-divisible-by-100", "Lẻ lô", function (value) {
          if (value > 100) {
            return value % 100 === 0; // Check if divisible by 100
          }
          return true; // If value is 100 or less, validation passes
        }),
    }),
  });

  const handleSubmit = async (side: string) => {
    if (!jwtToken) return;
    side === "NB" ? setIsBuy(true) : setIsBuy(false);
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      if (!tradingToken) {
        onRequestOTP?.();
        return;
      }
    } else {
      formik.setTouched({
        price: true,
        quantity: true,
      }); // Mark fields as touched to show errors
    }

    if (!formik.isValid || !accountNo || !loanPackages?.[0].id) return;

    setIsOpenConfiramtion(true);
  };

  const handleSubmitOrder = () => {
    const orderData = {
      ...formik.values,
      price: formik.values.price * 1000,
      side: isBuy ? "NB" : "NS",
      accountNo,
      loanPackageId: loanPackages?.[0].id,
    };
    postPlaceOrder(jwtToken, tradingToken, orderData)
      .then((res) => {
        toast.success("Đặt lệnh thành công!");
      })
      .catch((err) => {
        toast.error("Đã có lỗi xảy ra: \n" + err.message);
      })
      .finally(() => {
        setIsSubmittingBuy(false);
        setIsSubmittingSell(false);
      });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="text-xs text-muted">Sức mua</div>
        <div className="text-sm font-semibold text-white">
          {formatNumber(sucmuasucban?.ppse || 0)}
        </div>
      </div>
      {symbolData?.secType === "S" && <ChonGoiVay />}
      <Tabs
        variant="light"
        classNames={{
          cursor: "bg-lineargreen !text-black rounded-[8px]",
          tabContent:
            "group-data-[selected=true]:!text-black group-data-[selected=true]:font-medium",
          tab: "w-[42px] min-w-fit h-[28px] rounded-[8px]",
        }}
        selectedKey={formik.values.orderType}
        onSelectionChange={(key) => formik.setFieldValue("orderType", key)}
      >
        <Tab key="LO" title="LO"></Tab>
        <Tab key="MP" title="MP"></Tab>
        <Tab key="ATC" title="ATC"></Tab>
        <Tab key="ATO" title="ATO"></Tab>
      </Tabs>
      <div className="flex items-center gap-4 border-b-1 border-dashed border-neutral-700 pb-[10px]">
        <div className="flex flex-1 items-center justify-between text-xs font-medium text-muted">
          Giá đặt (Vnđ){" "}
          <Button
            className="h-fit w-fit min-w-0 rounded-[4px] px-2 py-1 text-sm text-white"
            onClick={() => {
              formik.setFieldValue(
                "price",
                symbolData?.price ? symbolData.price / 1000 : 0,
              );
            }}
          >
            Khớp
          </Button>
        </div>
        <Input
          variant="flat"
          className="w-[200px]"
          classNames={{
            inputWrapper:
              "bg-card border-1 border-default-800 rounded-[4px] group-data-[focus=true]:bg-linear1 ",
            input: "text-center",
          }}
          min={0}
          startContent={
            <button
              className="text-lg text-muted"
              onClick={() => {
                formik.setFieldValue(
                  "price",
                  +(formik.values.price - 0.05).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  }),
                );
                formik.setFieldTouched("price", true);
              }}
            >
              <Minus size={16} />
            </button>
          }
          endContent={
            <button
              className="text-lg text-muted"
              onClick={() => {
                formik.setFieldValue(
                  "price",
                  +(formik.values.price + 0.05).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  }),
                );
                formik.setFieldTouched("price", true);
              }}
            >
              <Plus size={16} />
            </button>
          }
          type="number"
          name="price"
          value={formik.values.price.toString()}
          onChange={(e) => {
            formik.handleChange(e);
            formik.setFieldTouched("price", true);
          }}
          errorMessage={formik.touched.price && formik.errors.price}
          isInvalid={formik.touched.price && !!formik.errors.price}
        />
      </div>
      <div className="flex items-center gap-4 border-b-1 border-dashed border-neutral-700 pb-[10px]">
        <div className="mb-1 flex-1 text-xs font-medium text-muted">
          Khối lượng (Cp)
        </div>
        <Input
          variant="flat"
          name="quantity"
          value={formik.values.quantity.toString()}
          onChange={(e) => {
            formik.handleChange(e);
            formik.setFieldTouched("quantity", true);
          }}
          className="w-[200px]"
          min={0}
          classNames={{
            inputWrapper:
              "bg-card border-1 border-default-800 rounded-[4px] group-data-[focus=true]:bg-linear1",
            input: "text-center",
          }}
          startContent={
            <button
              className="text-lg text-muted"
              onClick={() => {
                let newQuantity = formik.values.quantity || 0;
                if (!newQuantity || newQuantity > 100) {
                  newQuantity = (Math.floor(newQuantity / 100) - 1) * 100;
                } else {
                  newQuantity -= 1;
                }
                formik.setFieldValue("quantity", newQuantity);
                formik.setFieldTouched("quantity", true);
              }}
            >
              <Minus size={16} />
            </button>
          }
          endContent={
            <button
              className="text-lg text-muted"
              onClick={() => {
                let newQuantity = formik.values.quantity || 0;
                if (!newQuantity || newQuantity >= 100) {
                  newQuantity = (Math.floor(newQuantity / 100) + 1) * 100;
                } else {
                  newQuantity += 1;
                }
                formik.setFieldValue("quantity", newQuantity);
                formik.setFieldTouched("quantity", true);
              }}
            >
              <Plus size={16} />
            </button>
          }
          type="number"
          errorMessage={formik.touched.quantity && formik.errors.quantity}
          isInvalid={formik.touched.quantity && !!formik.errors.quantity}
        />
      </div>
      <div className="flex items-center gap-4 pb-3 pt-[10px]">
        <div className="mb-1 flex-1 text-xs font-medium text-muted">
          Tổng giá trị (Vnđ)
        </div>
        <div className="w-[200px] text-center text-sm font-semibold">
          {formatNumber(formik.values.quantity * formik.values.price * 1000)}
        </div>
      </div>
      <div className="flex w-full gap-4">
        <Button
          className="bg-lineargreen h-[40px] flex-1 rounded-[8px] text-sm font-semibold text-black"
          onClick={() => handleSubmit("NB")}
          isLoading={isSubmittingBuy}
        >
          Mua
        </Button>
        <Button
          className="bg-linearpink h-[40px] flex-1 rounded-[8px] text-sm font-semibold text-black"
          onClick={() => handleSubmit("NS")}
          isLoading={isSubmittingSell}
        >
          Bán
        </Button>
      </div>
      <div className="-mt-1 flex">
        <div className="flex-1 text-center text-xs text-muted">
          Mua tối đa:{" "}
          <span className="text-sm font-semibold text-white">
            {sucmuasucban?.qmaxLong || 0}
          </span>
        </div>
        <div className="flex-1 text-center text-xs text-muted">
          Bán tối đa:{" "}
          <span className="text-sm font-semibold text-white">
            {sucmuasucban?.qmaxShort || 0}
          </span>
        </div>
      </div>
      <XacNhanDatLenh
        isOpen={isOpenConfiramtion}
        values={{
          symbol: symbol,
          exchange: symbolData?.exchange,
          quantity: formik.values.quantity,
          price: formik.values.price,
          orderType: formik.values.orderType,
          side: isBuy ? "MUA" : "BÁN",
        }}
        onClose={() => setIsOpenConfiramtion(false)}
        onConfirm={() => {
          setIsOpenConfiramtion(false);
          handleSubmitOrder();
        }}
      />
    </div>
  );
}

function TabLenhDieuKien() {
  const [selectedTab, setSelectedTab] = useState<"less" | "high">("less");
  return (
    <div className="flex flex-col gap-2">
      <div className="mb-3 flex items-center justify-center gap-3">
        <div className="pr-3 text-sm">Khi giá</div>
        <Button
          className="h-6 w-6 min-w-0 p-0"
          color={selectedTab === "less" ? "primary" : "default"}
          onClick={() => setSelectedTab("less")}
        >
          <ChevronRight size={16} />
        </Button>
        <Button
          className="h-6 w-6 min-w-0 p-0"
          color={selectedTab === "high" ? "primary" : "default"}
          onClick={() => setSelectedTab("high")}
        >
          <ChevronLeft size={16} />
        </Button>
      </div>
      <div className="flex items-center gap-4 border-b-1 border-dashed border-neutral-700 pb-[10px]">
        <div className="flex-1 text-xs font-medium text-muted">
          Giá stop (đ)
        </div>
        <Input
          variant="flat"
          value="113,4"
          className="w-[200px]"
          classNames={{
            inputWrapper:
              "bg-card border-1 border-default-800 rounded-[4px] group-data-[focus=true]:bg-linear1 ",
            input: "text-center",
          }}
          startContent={
            <button className="text-lg text-muted">
              <Minus size={16} />
            </button>
          }
          endContent={
            <button className="text-lg text-muted">
              <Plus size={16} />
            </button>
          }
        />
      </div>
      <Tabs
        variant="light"
        classNames={{
          cursor: "bg-lineargreen !text-black rounded-[8px]",
          tabContent:
            "group-data-[selected=true]:!text-black group-data-[selected=true]:font-medium",
          tab: "w-[42px] min-w-fit h-[28px] rounded-[8px]",
        }}
      >
        <Tab title="LO"></Tab>
        <Tab title="MP"></Tab>
        <Tab title="ATC"></Tab>
        <Tab title="ATO"></Tab>
      </Tabs>
      <div className="flex items-center gap-4 border-b-1 border-dashed border-neutral-700 pb-[10px]">
        <div className="flex-1 text-xs font-medium text-muted">Giá đặt (đ)</div>
        <Input
          variant="flat"
          value="113,4"
          className="w-[200px]"
          classNames={{
            inputWrapper:
              "bg-card border-1 border-default-800 rounded-[4px] group-data-[focus=true]:bg-linear1 ",
            input: "text-center",
          }}
          startContent={
            <button className="text-lg text-muted">
              <Minus size={16} />
            </button>
          }
          endContent={
            <button className="text-lg text-muted">
              <Plus size={16} />
            </button>
          }
        />
      </div>
      <div className="flex items-center gap-4 border-b-1 border-dashed border-neutral-700 pb-[10px]">
        <div className="mb-1 flex-1 text-xs font-medium text-muted">
          Khối lượng (Cp)
        </div>
        <Input
          variant="flat"
          value="0 cp"
          className="w-[200px]"
          classNames={{
            inputWrapper:
              "bg-card border-1 border-default-800 rounded-[4px] group-data-[focus=true]:bg-linear1",
            input: "text-center",
          }}
          startContent={
            <button className="text-lg text-muted">
              <Minus size={16} />
            </button>
          }
          endContent={
            <button className="text-lg text-muted">
              <Plus size={16} />
            </button>
          }
        />
      </div>
      <div className="flex items-center gap-2 border-b-1 border-dashed border-neutral-700 pb-[10px]">
        <div className="mb-1 flex-1 text-xs font-medium text-muted">
          Hết hạn
        </div>
        <Input
          variant="flat"
          value="14:30"
          className="w-[100px]"
          classNames={{
            inputWrapper:
              "bg-card border-1 border-default-800 rounded-[4px] group-data-[focus=true]:bg-linear1",
            input: "text-center",
          }}
          endContent={
            <button className="text-lg text-muted">
              <Timer size={16} />
            </button>
          }
        />
        <Input
          variant="flat"
          value="18/10/2024"
          className="w-[140px]"
          classNames={{
            inputWrapper:
              "bg-card border-1 border-default-800 rounded-[4px] group-data-[focus=true]:bg-linear1",
            input: "text-center",
          }}
          endContent={
            <button className="text-lg text-muted">
              <Calendar size={16} />
            </button>
          }
        />
      </div>
    </div>
  );
}

function XacNhanDatLenh({
  isOpen,
  onClose,
  onConfirm,
  values,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  values?: any;
}) {
  const { data: accounts } = useDNSEAccounts();
  const { data: userInfo } = useDNSEUserInfo();
  return (
    <Modal
      isOpen={isOpen}
      classNames={{
        header: "p-4",
        wrapper: "rounded-[8px]",
        base: "rounded-[8px] bg-card min-w-0 w-[500px] max-w-full",
        closeButton:
          "!p-0 top-3 right-3 hover:bg-transparent hover:text-white text-muted transition-colors",
      }}
      backdrop="blur"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex w-full items-center justify-center gap-2 text-xl font-semibold">
            Xác nhận đặt lệnh
          </div>
        </ModalHeader>
        <ModalBody className="flex flex-col items-center pb-5">
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center">
              <div className="w-[140px] text-md text-muted">Số lưu ý</div>
              <div className="font-medium">
                {userInfo?.flexCustomerId} - {userInfo?.name}
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="w-[140px] text-md text-muted">Tiểu khoản</div>
              <div className="font-medium">
                {accounts?.default.id} - {accounts?.default.accountTypeName}
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="w-[140px] text-md text-muted">Mã</div>
              <div className="font-medium">
                {values.symbol} - {values.exchange}
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="w-[140px] text-md text-muted">Loại GD</div>
              <div className="font-medium">{values.orderType}</div>
            </div>
            <div className="flex w-full items-center">
              <div className="w-[140px] text-md text-muted">Lệnh</div>
              <div
                className={cn(
                  "font-medium",
                  values.side === "MUA" ? "text-green" : "text-red",
                )}
              >
                {values.side}
              </div>
            </div>

            <div className="flex w-full items-center">
              <div className="w-[140px] text-md text-muted">Khối lượng</div>
              <div className="font-medium">{values.quantity}</div>
            </div>
            <div className="flex w-full items-center">
              <div className="w-[140px] text-md text-muted">Tiền mặt</div>
              <div className="font-medium">100%</div>
            </div>
            <div className="flex w-full items-center">
              <div className="w-[140px] text-md text-muted">Giá đặt</div>
              <div className="font-medium">{values.price}</div>
            </div>
            <div className="flex w-full items-center">
              <div className="w-[140px] text-md text-muted">Giá trị lệnh</div>
              <div className="font-medium">
                {(values.price * values.quantity * 1000).toLocaleString(
                  "en-US",
                  { maximumFractionDigits: 0 },
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex w-full items-center gap-5">
            <Button className="flex-1" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button className="flex-1" color="secondary" onClick={onConfirm}>
              Xác nhận
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function TaiKhoanDaLienKetModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const { data: userInfo } = useDNSEUserInfo();
  const { clearTaiKhoanChungKhoan } = useTaiKhoanChungKhoan();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalBody>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex gap-2 text-xl font-semibold">
              Tài khoản chứng khoán đã liên kết <img src="/crown.svg" />
            </div>
            {userInfo && (
              <div className="flex h-[82px] w-[290px] flex-col gap-5 overflow-hidden rounded-[8px] bg-[url('/image/Card.svg')] bg-cover p-3 text-white">
                <div className="text-sm font-semibold">
                  Tài khoản chứng khoán DNSE
                </div>
                <div className="line-clamp-1 overflow-hidden text-ellipsis text-[20px] font-semibold leading-[24px]">
                  {userInfo.id} {userInfo.name && `- ${userInfo.name}`}
                </div>
              </div>
            )}
            <div
              className="cursor-pointer py-2 text-sm text-red underline underline-offset-4 hover:brightness-110"
              onClick={() => {
                setIsOpenConfirmationModal(true);
              }}
            >
              Hủy liên kết
            </div>
          </div>
          <ConfirmationModal
            isOpen={isOpenConfirmationModal}
            title="Bạn có chắc muốn ngừng liên kết với tài khoản chứng khoán DNSE?"
            confirmText="Hủy liên kết"
            cancelText="Bỏ qua"
            onClose={() => setIsOpenConfirmationModal(false)}
            onConfirm={() => {
              setIsOpenConfirmationModal(false);
              setTimeout(() => {
                clearTaiKhoanChungKhoan();
                onClose();
              }, 100);
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}