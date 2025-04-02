import Checkbox from "@/components/ui/Checkbox";
import BoldWarning from "@/icons/BoldWarning";
import MedalChat from "@/icons/MedalChat";
import {
  addToast,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import useTheme from "../useTheme";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Button from "@/components/ui/Button";
import clsx from "clsx";
import useSelectedBotName from "../useSelectedBotName";
import useBotPhaiSinhAddFollow from "../bot-api/useBotPhaiSinhAddFollow";
import { toast } from "react-toastify";

const CheckBoxWrapper = ({
  isDisabled,
  children,
  defaultChecked = true,
}: {
  children: React.ReactNode;
  isDisabled?: boolean;
  defaultChecked?: boolean;
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);
  return (
    <Checkbox
      className={cn(
        "border-border hover:bg-background m-0 cursor-pointer items-center rounded-[4px] border-1 px-2 py-1",
        isDisabled && "brightness-75",
      )}
      isSelected={isChecked}
      onChange={() => setIsChecked(!isChecked)}
      isDisabled={isDisabled}
    >
      {children}
    </Checkbox>
  );
};

function XacNhanNhanThongBaoTinHieuModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isOpenDieuKhoanModal, setIsOpenDieuKhoanModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { botName } = useSelectedBotName();
  const { trigger: addFollowTrigger, isMutating } =
    useBotPhaiSinhAddFollow(botName);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        backdrop="blur"
        classNames={{
          base: "max-w-[650px] bg-card rounded-[8px] shadow-lg",
          closeButton: "hover:bg-background active:bg-background",
          backdrop: "bg-neutral-800/30",
          body: "p-5",
        }}
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="gap-2 px-4 py-5">
            <MedalChat /> Xác nhận nhận thông báo tín hiệu
          </ModalHeader>
          <ModalBody className="flex flex-col gap-4 px-2.5 pt-2 text-sm sm:px-4 sm:font-medium">
            <div>
              Bạn đã đăng ký nhận tín hiệu giao dịch từ Bot XNO TOP 1. Hệ thống
              sẽ gửi cảnh báo Long/Short theo thời gian thực, giúp bạn không bỏ
              lỡ cơ hội đầu tư.
            </div>
            <div>Nơi hiện tín hiệu</div>
            <div className="flex flex-col gap-2 sm:mb-3 sm:flex-row">
              <CheckBoxWrapper>Hiển thị popup</CheckBoxWrapper>
              <CheckBoxWrapper defaultChecked={false} isDisabled>
                Thông báo qua điện thoại di động
              </CheckBoxWrapper>
              <CheckBoxWrapper defaultChecked={false} isDisabled>
                Email
              </CheckBoxWrapper>
            </div>
            <div className="flex items-center gap-2">
              <div className="shrink-0">
                <BoldWarning />
              </div>
              Hãy đảm bảo thông báo trình duyệt được bật để nhận tín hiệu kịp
              thời!
            </div>
            <div className="flex items-center gap-1">
              <Checkbox
                checked={isConfirmed}
                onChange={() => setIsConfirmed((prev) => !prev)}
                className="shrink-0"
              />{" "}
              <div>
                Tôi xác nhận mình đã đọc và xác nhận{" "}
                <span
                  className="text-lineargreen cursor-pointer font-bold hover:brightness-125"
                  onClick={() => setIsOpenDieuKhoanModal(true)}
                >
                  &quot;Điều khoản sử dụng và miễn trừ trách nhiệm BOT tín hiệu
                  XNO&quot;
                </span>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="pt-2">
            <Button size="sm" onPress={onClose}>
              Hủy bỏ
            </Button>
            <Button
              size="sm"
              color="primary"
              className={clsx(
                "text-sm transition-opacity",
                !isConfirmed && "opacity-50",
              )}
              isDisabled={!isConfirmed || isMutating}
              isLoading={isMutating}
              onPress={() =>
                addFollowTrigger()
                  .then(() => {
                    toast.success("Đăng ký nhận tín hiệu thành công!");
                    onClose();
                  })
                  .catch(() => {
                    toast.error("Đăng ký nhận tín hiệu thất bại!");
                  })
              }
            >
              Nhận tín hiệu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <DieuKhoanSuDungModal
        isOpen={isOpenDieuKhoanModal}
        onClose={() => setIsOpenDieuKhoanModal(false)}
      />
    </>
  );
}

function DieuKhoanSuDungModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { isLightMode } = useTheme();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      backdrop="blur"
      classNames={{
        base: "max-w-[1080px] bg-card rounded-[8px] shadow-lg",
        closeButton: "hover:bg-background active:bg-background",
        backdrop: "bg-neutral-800/30",
        body: "p-5",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex shrink-0 justify-center">
          <div
            className={cn(
              "w-full text-center text-lg font-semibold md:text-2xl",
              isLightMode ? "text-purple" : "text-transparent",
            )}
            style={{
              background:
                "linear-gradient(91deg, #9795FF 20.49%, #FFF 44.59%, #FFF 54.87%, #BE9FFF 78.33%)",
              backgroundClip: "text",
            }}
          >
            Điều khoản sử dụng và miễn trừ trách nhiệm BOT tín hiệu XNO
          </div>
        </ModalHeader>
        <ModalBody className="pt-0 !pb-4 text-sm font-medium">
          <div className="[&>h2]:text-linearpurple flex min-h-fit flex-col gap-2 [&_ol]:list-inside [&_ol]:list-decimal [&_ol]:pl-1 [&_ul]:list-inside [&_ul]:list-disc [&_ul]:pl-3 [&>*]:shrink-0">
            <div className="mb-2 flex justify-center">
              <Image src="/logo.png" width={133} height={40} alt="XNO logo" />
            </div>
            <p>
              Bằng việc sử dụng Bot tín hiệu XNO (sau đây gọi là
              &quot;Bot&quot;), bạn đồng ý tuân thủ các điều khoản và điều kiện
              sau đây. Vui lòng đọc kỹ trước khi sử dụng.
            </p>

            <h2>1. Mục đích sử dụng</h2>
            <p>
              Bot được cung cấp với mục đích hỗ trợ nhà đầu tư trong việc đưa ra
              quyết định giao dịch dựa trên tín hiệu được tạo ra dựa trí tuệ
              nhân tạo (AI) được phát triển độc quyền bởi đội ngũ chuyên gia
              XNO.
            </p>
            <p>
              Bot không phải là công cụ đảm bảo lợi nhuận và không thể thay thế
              hoàn toàn cho quyết định đầu tư của con người.
            </p>

            <h2>2. Miễn trừ trách nhiệm</h2>
            <p>
              <strong>Đơn vị cung cấp Bot (XNO) không chịu trách nhiệm</strong>{" "}
              đối với bất kỳ tổn thất, thiệt hại trực tiếp hoặc gián tiếp nào
              phát sinh từ việc sử dụng Bot, bao gồm nhưng không giới hạn:
            </p>
            <ul>
              <li>
                Thua lỗ do biến động thị trường, sự kiện bất ngờ, hoặc khủng
                hoảng tài chính.
              </li>
              <li>Sai sót kỹ thuật, gián đoạn hệ thống, hoặc lỗi phần mềm.</li>
              <li>
                Quyết định giao dịch của người dùng dựa trên tín hiệu từ Bot.
              </li>
            </ul>
            <p>
              Bot được cung cấp trên cơ sở &quot;nguyên trạng&quot; (as-is) và
              không đi kèm bất kỳ bảo đảm nào về hiệu suất, độ chính xác, hoặc
              tính liên tục.
            </p>

            <h2>3. Quản trị rủi ro cá nhân</h2>
            <p>
              Người dùng cần tự chịu trách nhiệm quản lý rủi ro và tuân thủ các
              nguyên tắc sau:
            </p>
            <ol>
              <li>
                <strong>Không phụ thuộc hoàn toàn vào Bot:</strong>{" "}
                <ul>
                  <li>
                    Tín hiệu từ Bot được tạo ra dựa trí tuệ nhân tạo (AI) nhưng
                    <strong>thị trường luôn biến động</strong> do yếu tố vĩ mô,
                    tin tức, hoặc sự kiện bất ngờ.
                  </li>
                  <li>
                    Bot không thể dự đoán được khủng hoảng tài chính, đảo chiều
                    đột ngột, hoặc các &quot;cú sốc&quot; thị trường.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Đa dạng danh mục:</strong>{" "}
                <ul>
                  <li>
                    Không tập trung toàn bộ vốn vào một tài sản hoặc chiến lược
                    duy nhất.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Áp dụng ngưỡng cắt lỗ (stop-loss):</strong>{" "}
                <ul>
                  <li>
                    Thiết lập mức cắt lỗ cứng cho từng giao dịch để hạn chế thua
                    lỗ, ngay cả khi Bot không đề xuất.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Quản lý đòn bẩy:</strong>{" "}
                <ul>
                  <li>
                    Đòn bẩy cao có thể khuếch đại lợi nhuận nhưng cũng làm tăng
                    rủi ro cháy tài khoản.
                  </li>
                </ul>
              </li>
            </ol>

            <h2>4. Theo dõi và điều chỉnh</h2>
            <ul>
              <li>
                Người dùng cần định kỳ <strong>đánh giá hiệu suất</strong> của
                Bot và so sánh với kỳ vọng cũng như điều kiện thị trường hiện
                tại.
              </li>
              <li>
                tạm dừng hoạt động Sẵn sàng <strong>tạm dừng hoạt động</strong>{" "}
                nếu Bot gặp phải tỷ lệ sụt giảm tối đa (max drawdown) lớn hoặc
                thị trường biến động mạnh.
              </li>
              <li>
                Chấp nhận rằng không có chiến lược nào thắng 100%, và tỷ lệ thua
                lỗ là điều không tránh khỏi.
              </li>
            </ul>

            <h2>5. Lưu ý đặc biệt về giao dịch phái sinh</h2>
            <ul>
              <li>
                Bot có thể mở cả vị thế <strong>long (mua)</strong> và{" "}
                <strong>short (bán)</strong> với các mốc <strong>50%</strong> và{" "}
                <strong>100%</strong> trên số vốn giao dịch phái sinh.
              </li>
              <li>
                Mức ký quỹ theo quy định của VSDC là <b>17%</b>.
              </li>
            </ul>
            <strong>Đối với nhà đầu tư mới bắt đầu:</strong>

            <ul>
              <li>
                Hãy <strong>bắt đầu với số vốn nhỏ</strong> để làm quen với cơ
                chế hoạt động của Bot và thị trường phái sinh.
              </li>
              <li>
                Tránh sử dụng đòn bẩy tối đa ngay từ đầu để giảm thiểu rủi ro.
              </li>
            </ul>
            <p>
              <strong>Đối với nhà đầu tư chuyên nghiệp:</strong>
            </p>
            <ul>
              <li>
                <strong>Chú trọng giới hạn rủi ro cá nhân</strong> một cách linh
                hoạt, phù hợp với mục tiêu và khẩu vị rủi ro của bạn.
              </li>
              <li>
                Sử dụng các công cụ quản lý rủi ro như{" "}
                <strong>stop-loss</strong>, <strong>take-profit</strong>, và
                <strong>hedging</strong> để bảo vệ danh mục.
              </li>
            </ul>

            <h2>6. Sự kiện bất khả kháng</h2>
            <ul>
              <li>
                Trong trường hợp việc thực hiện hợp đồng này bị ngăn chặn hoặc
                trì hoãn toàn bộ hoặc một phần do các sự kiện bất khả kháng, bao
                gồm nhưng không giới hạn ở chiến tranh, bạo loạn, thiên tai, tấn
                công mạng, sự cố treo hệ thống giao dịch, lỗi phần mềm, mất kết
                nối Internet, thay đổi chính sách pháp luật hoặc các yếu tố
                ngoài tầm kiểm soát của một trong hai bên, thì bên bị ảnh hưởng
                sẽ không phải chịu trách nhiệm đối với việc không thực hiện hoặc
                trì hoãn nghĩa vụ của mình theo hợp đồng này.
              </li>
              <li>
                Trong trường hợp bất khả kháng, hai bên sẽ thảo luận để thống
                nhất các biện pháp phù hợp nhằm khắc phục hoặc giảm thiểu hậu
                quả bất lợi do sự kiện này gây ra.
              </li>
              <li>
                Bên nào bị ảnh hưởng bởi sự kiện bất khả kháng phải ngay lập tức
                thông báo cho bên kia bằng văn bản về thời điểm bắt đầu và dự
                kiến kết thúc sự kiện bất khả kháng. Trong trường hợp cần thiết,
                các bằng chứng xác thực từ cơ quan quản lý hoặc nhà cung cấp
                dịch vụ liên quan (ví dụ: sàn giao dịch, nhà cung cấp dịch vụ
                Internet, công ty phần mềm) có thể được sử dụng để chứng minh sự
                tồn tại và tác động của sự kiện bất khả kháng.
              </li>
            </ul>
            <h2>7. Khuyến nghị chung</h2>
            <ul>
              <li>
                <strong>Không sử dụng vốn vay</strong> hoặc tiền cần thiết cho
                sinh hoạt để đầu tư.
              </li>
              <li>
                Bot chỉ là công cụ hỗ trợ, và quyết định cuối cùng luôn thuộc về
                người dùng. <strong>Hãy ưu tiên bảo toàn vốn</strong> trước khi
                tìm kiếm lợi nhuận.
              </li>
            </ul>
            <p>
              Bằng việc sử dụng Bot tín hiệu XNO, bạn đồng ý rằng đã đọc, hiểu,
              và chấp nhận toàn bộ các điều khoản và điều kiện nêu trên. Nếu
              không đồng ý, vui lòng ngừng sử dụng Bot ngay lập tức.
            </p>
            <p>
              <strong>Đơn vị cung cấp BOT (XNO)</strong> không chịu trách nhiệm
              đối với bất kỳ quyết định đầu tư nào của người dùng.
            </p>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export const useXacNhanNhanThongBaoTinHieu = () => {
  const [isOpen, setIsOpen] = useState(false);
  return {
    openModal: () => setIsOpen(true),
    ModalComponent: () => (
      <XacNhanNhanThongBaoTinHieuModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    ),
  };
};
