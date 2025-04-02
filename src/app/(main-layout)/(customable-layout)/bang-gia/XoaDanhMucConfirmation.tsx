import Button from "@/components/ui/Button";
import { Modal, ModalBody, ModalContent } from "@heroui/react";

export default function XoaDanhMucConfirmation({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalBody className="p-5">
          <div className="flex justify-between items-center py-3">
            <div>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="20" fill="#FECDC932" />
                <path
                  d="M30.0106 11.8003L22.0906 7.22699C20.7973 6.48033 19.1973 6.48033 17.8906 7.22699L9.98396 11.8003C8.69062 12.547 7.89062 13.9337 7.89062 15.4403V24.5603C7.89062 26.0537 8.69062 27.4403 9.98396 28.2003L17.904 32.7737C19.1973 33.5203 20.7973 33.5203 22.104 32.7737L30.024 28.2003C31.3173 27.4537 32.1173 26.067 32.1173 24.5603V15.4403C32.104 13.9337 31.304 12.5603 30.0106 11.8003ZM18.9973 14.3337C18.9973 13.787 19.4506 13.3337 19.9973 13.3337C20.544 13.3337 20.9973 13.787 20.9973 14.3337V21.3337C20.9973 21.8803 20.544 22.3337 19.9973 22.3337C19.4506 22.3337 18.9973 21.8803 18.9973 21.3337V14.3337ZM21.224 26.1737C21.1573 26.3337 21.064 26.4803 20.944 26.6137C20.6906 26.867 20.3573 27.0003 19.9973 27.0003C19.824 27.0003 19.6506 26.9603 19.4906 26.8937C19.3173 26.827 19.184 26.7337 19.0506 26.6137C18.9306 26.4803 18.8373 26.3337 18.7573 26.1737C18.6906 26.0137 18.664 25.8403 18.664 25.667C18.664 25.3203 18.7973 24.9737 19.0506 24.7203C19.184 24.6003 19.3173 24.507 19.4906 24.4403C19.984 24.227 20.5706 24.347 20.944 24.7203C21.064 24.8537 21.1573 24.987 21.224 25.1603C21.2906 25.3203 21.3306 25.4937 21.3306 25.667C21.3306 25.8403 21.2906 26.0137 21.224 26.1737Z"
                  fill="#F04438"
                />
              </svg>
            </div>
            <div className="pr-4">Bạn có chắc muốn xóa danh mục này không?</div>
          </div>
          <div className="flex justify-stretch gap-4 w-full">
            <Button color="muted" className="flex-1" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button color="primary" className="bg-red-light text-white flex-1" onClick={onConfirm}>
              Xóa
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
