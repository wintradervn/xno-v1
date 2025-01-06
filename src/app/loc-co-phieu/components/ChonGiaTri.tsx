"use client";
import Input from "@/components/ui/Input";
import useLocCoPhieuState from "@/hooks/useLocCoPhieuState";
import { RefreshCircle } from "solar-icon-set";
import { TIEU_CHI_LOC_LIST, TTieuChiLoc } from "../constant";
import { ChevronDownIcon, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { Select, SelectItem } from "@/components/ui/Select";
import { use, useEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useBoLocCaNhan from "@/hooks/useBoLocCanhan";
import { toast } from "react-toastify";
import {
  ButtonGroup,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";

export default function ChonGiaTri() {
  const {
    listFilter,
    removeFilter,
    setDefaultFilter,
    filterState,
    updateFilterState,
  } = useLocCoPhieuState();
  const { addBoLocCaNhan, editBoLocCaNhan, listBoLocCaNhan, selectedBoLocId } =
    useBoLocCaNhan();

  const [state, setState] = useState<any>(filterState || {});
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [nameString, setNameString] = useState("");

  const filtersData = useMemo(
    () =>
      listFilter
        ? TIEU_CHI_LOC_LIST.filter((item) =>
            listFilter.includes(item.key),
          ).sort(
            (a: any, b: any) =>
              listFilter.indexOf(a.key) - listFilter.indexOf(b.key),
          )
        : [],
    [listFilter],
  );

  const isChanged = useMemo(() => {
    return JSON.stringify(filterState) !== JSON.stringify(state);
  }, [state, filterState]);

  const isSelectingBoLocCaNhan = useMemo(() => {
    return !!listBoLocCaNhan?.some((item: any) => item.id === selectedBoLocId);
  }, [listBoLocCaNhan, selectedBoLocId]);

  useEffect(() => {
    // if (JSON.stringify(filterState) === JSON.stringify(state)) return;
    setState(filterState || {});
  }, [JSON.stringify(filterState)]);

  const handleUpdateCurrentBoLoc = () => {
    const name = listBoLocCaNhan.find(
      (_: any) => _.id === selectedBoLocId,
    )?.name;
    editBoLocCaNhan(selectedBoLocId, "", JSON.stringify(state));
    updateFilterState(state);
    toast.success(`Đã cập nhật bộ lọc ${name} thành công!`);
  };

  const handleAddNewBoLoc = () => {
    setNameString(
      "Bộ lọc cá nhân " + ((listBoLocCaNhan?.length || 0) + 1).toString(),
    );
    setIsOpenEditModal(true);
    updateFilterState(state);
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="card flex min-h-[270px] flex-1 flex-col gap-2 rounded-[8px] p-0">
        <div className="flex w-full items-center gap-1 border-b-1 border-neutral-800 p-3 text-md font-medium text-white">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 3.5H7C4 3.5 2 5 2 8.5V15.5C2 19 4 20.5 7 20.5H17C20 20.5 22 19 22 15.5V8.5C22 5 20 3.5 17 3.5ZM6.25 14.5C6.25 14.91 5.91 15.25 5.5 15.25C5.09 15.25 4.75 14.91 4.75 14.5V9.5C4.75 9.09 5.09 8.75 5.5 8.75C5.91 8.75 6.25 9.09 6.25 9.5V14.5ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15ZM19.25 14.5C19.25 14.91 18.91 15.25 18.5 15.25C18.09 15.25 17.75 14.91 17.75 14.5V9.5C17.75 9.09 18.09 8.75 18.5 8.75C18.91 8.75 19.25 9.09 19.25 9.5V14.5Z"
              fill="url(#paint0_linear_31320_180803)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_31320_180803"
                x1="2"
                y1="3.5"
                x2="26.2123"
                y2="33.2277"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#E9E8FF" />
                <stop offset="1" stopColor="#B7B1FF" />
              </linearGradient>
            </defs>
          </svg>
          Chọn giá trị
        </div>
        <div className="flex flex-1 p-3 py-2">
          <ScrollArea className="h-full w-full rounded-[8px] border-1 border-neutral-800 p-3">
            {filtersData?.map((filter: TTieuChiLoc) => (
              <div
                className="grid items-center p-1 text-md font-semibold"
                key={filter.key}
                style={{ gridTemplateColumns: "1.4fr 2fr 0.2fr" }}
              >
                <div className="overflow-hidden text-ellipsis text-nowrap text-sm font-semibold text-white">
                  {filter.name}
                </div>
                <div className="flex items-center justify-center gap-3">
                  {filter.type === "minmax" && (
                    <>
                      <Input
                        className="w-28"
                        variant="bordered"
                        placeholder="Tối thiểu"
                        size="sm"
                        value={state[filter.key]?.min ?? ""}
                        onValueChange={(value: any) => {
                          const v = value.replace(/^0+/, "");
                          if (/^-?\d*\.?\d*$/.test(v) || v === "") {
                            setState({
                              ...state,
                              [filter.key]: {
                                ...state[filter.key],
                                min: v || 0,
                              },
                            });
                          }
                        }}
                      />
                      <span>-</span>
                      <Input
                        className="w-28"
                        variant="bordered"
                        placeholder="Tối đa"
                        size="sm"
                        value={state[filter.key]?.max ?? ""}
                        onValueChange={(value: any) => {
                          const v = value.replace(/^0+/, "");
                          if (/^-?\d*\.?\d*$/.test(v)) {
                            setState({
                              ...state,
                              [filter.key]: {
                                ...state[filter.key],
                                max: v.replace(/^0+/, "") || 0,
                              },
                            });
                          }
                        }}
                      />
                    </>
                  )}
                  {filter.type === "select" && (
                    <>
                      <Select
                        size="sm"
                        color="default"
                        selectedKeys={state[filter.key] || []}
                        onSelectionChange={(value) => {
                          setState({
                            ...state,
                            [filter.key]: Array.from(value),
                          });
                        }}
                        className="w-64"
                        variant="bordered"
                        selectionMode="multiple"
                      >
                        {filter.options.map((option) => (
                          <SelectItem key={option.label} value={option.label}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </>
                  )}
                </div>
                <div className="flex cursor-pointer justify-end text-fuchsia-200 hover:text-white">
                  <div
                    className="rounded-full p-1 hover:text-red"
                    onClick={() => {
                      removeFilter(filter.key);
                      const newState = { ...state };
                      delete newState[filter.key];
                      setState(newState);
                    }}
                  >
                    <X size={16} />
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="flex w-full flex-shrink-0 justify-between self-end p-3 pt-0">
          <div className="flex gap-2">
            <Button
              className="flex-1"
              size="sm"
              onClick={() => {
                setDefaultFilter();
                setState({});
              }}
            >
              Đặt lại
            </Button>
            <ButtonGroup>
              <Button
                className="flex-1"
                size="sm"
                onPress={() => {
                  if (isSelectingBoLocCaNhan) {
                    handleUpdateCurrentBoLoc();
                  } else {
                    handleAddNewBoLoc();
                  }
                }}
                isDisabled={isSelectingBoLocCaNhan && !isChanged}
              >
                {isSelectingBoLocCaNhan ? "Lưu bộ lọc" : "Lưu bộ lọc mới"}
              </Button>
              {isSelectingBoLocCaNhan && (
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button isIconOnly size="sm">
                      <ChevronDownIcon size={16} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Merge options"
                    className="max-w-[300px]"
                    onAction={(key) => {
                      if (key === "addnew") {
                        handleAddNewBoLoc();
                      }
                    }}
                  >
                    <DropdownItem key="addnew">Lưu vào bộ lọc mới</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </ButtonGroup>
          </div>
          <div>
            <Button
              color="primary"
              size="sm"
              className="text-sm font-semibold"
              onClick={() => updateFilterState(state)}
            >
              Lọc <RefreshCircle />
            </Button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpenEditModal}
        onClose={() => setIsOpenEditModal(false)}
        className="bg-card"
      >
        <ModalContent>
          <ModalHeader>
            <div className="text-caption text-lineargreen flex w-full items-center justify-center">
              Thêm bộ lọc mới
            </div>
          </ModalHeader>
          <ModalBody className="px-5 py-1">
            <div className="text-sm text-muted">Tên bộ lọc</div>
            <Input
              placeholder="Nhập tên bộ lọc"
              value={nameString}
              onValueChange={(value) => {
                setNameString(value);
              }}
              classNames={{
                inputWrapper: "bg-background",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addBoLocCaNhan(nameString, JSON.stringify(state));
                  setIsOpenEditModal(false);
                  setNameString("");
                  toast.success(`Bộ lọc cá nhân mới được tạo thành công!`);
                }
              }}
              autoFocus
            />
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-end gap-2">
              <Button
                color="muted"
                onClick={() => {
                  setIsOpenEditModal(false);
                  setNameString("");
                }}
              >
                Hủy bỏ
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  addBoLocCaNhan(nameString, JSON.stringify(state));
                  setIsOpenEditModal(false);
                  setNameString("");
                  toast.success(`Bộ lọc cá nhân mới được tạo thành công!`);
                }}
              >
                Thêm bộ lọc
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
