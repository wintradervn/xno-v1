"use client";
import { Modal, ModalBody, ModalContent, Tooltip } from "@heroui/react";
import Input from "../ui/Input";
import { RoundedMagnifer } from "solar-icon-set";
import { useMemo, useState } from "react";
import useModalsState, { MODALS } from "@/hooks/useModalsState";
import SearchResultUI from "../SearchSymbol/SearchResultUI";

export default function TimMaChungKhoanModal() {
  const [search, setSearch] = useState("");
  const { isOpen, closeModal } = useModalsState(MODALS.TIM_KIEM);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      classNames={{
        base: "min-w-0 max-w-fit",
        wrapper: "min-w-0 ",
        closeButton: "hover:bg-neutral-800 active:bg-neutral-800 p-1",
      }}
    >
      <ModalContent>
        <ModalBody>
          <div className="w-[500px] py-5">
            <Input
              startContent={<RoundedMagnifer size={24} />}
              color="reverse"
              className="mb-2"
              classNames={{
                input: "text-neutral-500",
              }}
              placeholder="Tìm mã chứng khoán"
              size="sm"
              value={search}
              onValueChange={(value) => setSearch(value)}
            />
            <SearchResultUI search={search} />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
