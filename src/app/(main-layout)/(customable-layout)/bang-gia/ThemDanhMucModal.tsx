"use client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useMucQuanTam from "@/hooks/useMucQuanTam";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { use, useEffect, useRef, useState } from "react";

export default function ThemDanhMucModal({
  isOpen,
  onClose,
  onSuccess,
  editting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (name: string) => void;
  editting: string;
}) {
  const [nameString, setNameString] = useState<string>(editting);
  const { addNewList, updateListName } = useMucQuanTam();
  const { listQuanTam } = useMucQuanTam();
  const [error, setError] = useState<string>("");

  const inputRef = useRef<any>(null);
  const isEdit = editting !== "";

  const handleThemDanhMuc = () => {
    if (nameString.trim() === "") return;
    if (listQuanTam.find((item: any) => item.name === nameString)) {
      setError(
        isEdit ? "Hãy nhập tên mới cho danh mục" : "Tên danh mục đã tồn tại",
      );
      return;
    }
    if (isEdit) {
      updateListName(editting, nameString);
    } else {
      addNewList(nameString);
    }
    onSuccess(nameString);
    setNameString("");
    onClose();
  };

  useEffect(() => {
    setNameString(editting);
  }, [editting]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setNameString("");
      }}
      classNames={{
        base: "bg-card",
        closeButton: "hover:bg-background active:bg-background",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <div className="text-caption text-lineargreen flex w-full items-center justify-center">
            {isEdit ? "Sửa tên danh mục" : "Thêm danh mục"}
          </div>
        </ModalHeader>
        <ModalBody className="px-5 py-1">
          <div className="text-muted text-sm">Tên danh mục</div>
          <Input
            ref={inputRef}
            placeholder="Nhập tên danh mục"
            value={nameString}
            onValueChange={(value) => {
              setNameString(value);
              if (error) {
                setError("");
              }
            }}
            errorMessage={error}
            isInvalid={!!error}
            classNames={{
              inputWrapper: "bg-background",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleThemDanhMuc();
              }
            }}
          />
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end gap-2">
            <Button color="muted" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button color="primary" onClick={handleThemDanhMuc}>
              {isEdit ? "Cập nhật" : "Thêm"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
