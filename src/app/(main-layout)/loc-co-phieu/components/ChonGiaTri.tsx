"use client";
import Input from "@/components/ui/Input";
import useLocCoPhieuState from "@/hooks/useLocCoPhieuState";
import { RefreshCircle } from "solar-icon-set";
import { TIEU_CHI_LOC_LIST, TTieuChiLoc } from "../constant";
import { ChevronDownIcon, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { Select, SelectItem } from "@/components/ui/Select";
import { useEffect, useMemo, useState } from "react";
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
} from "@heroui/react";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";
import ChonGiaTriIcon from "@/icons/ChonGiaTriIcon";
import useTheme from "@/hooks/useTheme";

export default function ChonGiaTri({ noTitle }: { noTitle?: boolean }) {
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
  const { isLightMode } = useTheme();

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
        {!noTitle && (
          <div className="text-md flex w-full items-center gap-1 border-b-1 p-3 font-medium text-white">
            <ChonGiaTriIcon fillColor={isLightMode ? "#7B61FF" : ""} />
            Chọn giá trị
          </div>
        )}
        <div className="flex flex-1 p-2 py-2 sm:p-3">
          <ScrollArea className="h-full w-full rounded-[8px] border-1 p-3">
            {filtersData?.map((filter: TTieuChiLoc) => (
              <div
                className="text-md grid items-center p-1 font-semibold"
                key={filter.key}
                style={{ gridTemplateColumns: "1.4fr 2fr 0.2fr" }}
              >
                <div className="overflow-hidden text-sm font-semibold text-nowrap text-ellipsis text-white">
                  {filter.name}
                </div>
                <div>
                  {filter.type === "minmax" && (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center gap-3">
                        <Input
                          className="w-28"
                          classNames={{
                            errorMessage: "text-[8px] font-normal",
                          }}
                          variant="bordered"
                          placeholder="Tối thiểu"
                          size="sm"
                          value={state[filter.key]?.min ?? ""}
                          onValueChange={(value: any) => {
                            const v = value.replace(/^0+/, "");
                            if (/^-?\d*\.?\d*$/.test(v) || v === "") {
                              setState((prev: any) => ({
                                ...prev,
                                [filter.key]: {
                                  ...prev[filter.key],
                                  min: v || 0,
                                },
                              }));
                            }
                          }}
                          isInvalid={
                            +state[filter.key]?.min > +state[filter.key]?.max
                          }
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
                          isInvalid={
                            +state[filter.key]?.min > +state[filter.key]?.max
                          }
                        />
                      </div>
                      {+state[filter.key]?.min > +state[filter.key]?.max && (
                        <div className="text-red text-xs font-normal">
                          Giá trị tối đa phải lớn hơn giá trị tối thiểu
                        </div>
                      )}
                    </div>
                  )}
                  {filter.type === "select" && (
                    <>
                      <Select
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
                          <SelectItem
                            color="default"
                            className="data-[hover=true]:bg-light-surface-sub! data-[hover=true]:dark:bg-dark-surface-sub!"
                            key={option.label}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </>
                  )}
                </div>
                <div className="hover:text-foreground flex cursor-pointer justify-end text-fuchsia-200">
                  <div
                    className="hover:text-red rounded-full p-1"
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
        <div className="flex w-full shrink-0 justify-between self-end p-3 pt-0">
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
                <Dropdown
                  placement="bottom-end"
                  classNames={{
                    content: "bg-white dark:bg-background! shadow-md p-1",
                  }}
                >
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
                    <DropdownItem
                      key="addnew"
                      className="data-[hover=true]:bg-light-surface-sub! data-[hover=true]:dark:bg-dark-surface-sub!"
                    >
                      Lưu vào bộ lọc mới
                    </DropdownItem>
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
        className="dark:bg-card rounded-[8px] bg-white shadow-md"
      >
        <ModalContent>
          <ModalHeader>
            <div className="text-caption text-lineargreen flex w-full items-center justify-center">
              Thêm bộ lọc mới
            </div>
          </ModalHeader>
          <ModalBody className="px-5 py-1">
            <div className="text-muted text-sm">Tên bộ lọc</div>
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
