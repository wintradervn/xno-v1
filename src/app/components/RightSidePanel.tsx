"use client";
import Button from "@/components/ui/Button";
import DefaultLoader from "@/components/ui/DefaultLoader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useIsMobile from "@/hooks/useIsMobile";
import useRightPanelState from "@/hooks/useRightPanelState";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "solar-icon-set";
const Market = lazy(() => import("@/components/module/Market"));
const News = lazy(() => import("@/components/module/News"));
const Overview = lazy(() => import("@/components/module/Overview"));
const Trade = lazy(() => import("@/components/module/Trade"));
const BotAI = lazy(() => import("@/components/module/BotAI"));

export default function RightSidePanel() {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile ? (
        <div className="absolute top-0 left-0 z-100 h-fit w-full overflow-hidden sm:hidden">
          <RightSidePanelMobile />
        </div>
      ) : (
        <div className="hidden h-full sm:flex">
          <RightSidePanelDesktop />
        </div>
      )}
    </>
  );
}

function RightSidePanelDesktop() {
  const { state } = useRightPanelState();

  const rightPanelState = state || "cophieu";

  return (
    <ResizablePanelGroup
      direction="vertical"
      className="flex-1"
      autoSaveId="right-layout"
    >
      <ResizablePanel defaultSize={65} minSize={20}>
        <div className="card h-full">
          {(rightPanelState === "cophieu" && <Market />) ||
            (rightPanelState === "thitruong" && <Overview />) ||
            (rightPanelState === "datlenh" && <Trade />) ||
            (rightPanelState === "tintuc" && <News />) ||
            (rightPanelState === "tinhieu" && <BotAI />)}
        </div>
      </ResizablePanel>
      {/* <ResizableHandle />
      <ResizablePanel defaultSize={35} minSize={5}>
        <div className="card h-full">
          <Assets />
        </div>
      </ResizablePanel> */}
    </ResizablePanelGroup>
  );
}

function RightSidePanelMobile() {
  const { state: rightPanelState, setState } = useRightPanelState();

  const renderData = useMemo(() => {
    if (!rightPanelState) return null;
    return {
      cophieu: {
        title: "Cổ phiếu",
        render: <Market />,
      },
      thitruong: {
        title: "Thị trường",
        render: <Overview />,
      },
      tintuc: {
        title: "Tin tức",
        render: <News noTitle />,
      },
      tinhieu: {
        title: "Bot AI",
        render: <BotAI />,
      },
    }[rightPanelState];
  }, [rightPanelState]);

  return (
    <>
      <Modal
        isOpen={!!renderData}
        backdrop="transparent"
        className="bg-background"
        classNames={{
          backdrop: "opacity-100",
          wrapper: "",
          base: "shadow-[0px_-4px_14px_2px_rgba(0,0,0,0.38)] rounded-[4px] h-[calc(100svh-60px)] max-w-screen! m-0! p-1",
        }}
        motionProps={{
          variants: {
            enter: {
              x: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              x: "100%",
              opacity: 1,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
        placement="top"
        hideCloseButton
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader className="card mb-1 px-0">
            <div className="relative flex w-full shrink-0 items-center justify-center py-2">
              <Button
                className="absolute left-2 min-w-0 rounded-full border-neutral-600/20 bg-transparent! p-0!"
                isIconOnly
                variant="bordered"
                onPress={() => setState("")}
              >
                <ArrowLeft size={24} />
              </Button>
              <div className="text-lg font-semibold">{renderData?.title}</div>
            </div>
          </ModalHeader>
          <ModalBody className="min-h-[50svh] overflow-hidden p-0 pb-2">
            <div className="card flex-1 overflow-auto pb-4">
              <Suspense
                fallback={
                  <div className="h-full w-full">
                    4
                    <DefaultLoader />
                  </div>
                }
              >
                {renderData?.render}
              </Suspense>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={rightPanelState === "datlenh"}
        onClose={() => setState("")}
        backdrop="transparent"
        className="bg-card"
        classNames={{
          backdrop: "opacity-20",
          wrapper: "z-300",
          base: "shadow-[0px_-4px_14px_2px_rgba(0,0,0,0.38)]",
        }}
      >
        <ModalContent>
          <ModalBody className="min-h-[50svh] overflow-hidden p-3 pb-1">
            <Trade />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
