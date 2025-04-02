"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Button from "./ui/Button";
import Image from "next/image";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
export function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(600);
  const [width, setWidth] = useState(600);
  const [isResizingHeight, setIsResizingHeight] = useState(false);
  const [isResizingWidth, setIsResizingWidth] = useState(false);

  const prevMousePos = useRef({ x: 0, y: 0 });
  const prevHeight = useRef(0);
  const prevWidth = useRef(0);

  // useEffect(() => {
  //   if (!isResizingHeight && !isResizingWidth) return;
  //   const handleMouseMove = (e: any) => {
  //     e.stopPropagation();
  //     e.preventDefault();
  //     if (isResizingHeight) {
  //       const dy = prevMousePos.current.y - e.clientY;
  //       setHeight(Math.max(prevHeight.current + dy, 300));
  //     }
  //     if (isResizingWidth) {
  //       const dx = prevMousePos.current.x - e.clientX;
  //       setWidth(Math.max(prevWidth.current + dx, 300));
  //     }
  //   };
  //   const handleMouseUp = () => {
  //     setIsResizingHeight(false);
  //     setIsResizingWidth(false);
  //   };

  //   // Attach the mousemove event listener to the window
  //   window.addEventListener("mousemove", handleMouseMove);
  //   window.addEventListener("mouseup", handleMouseUp);

  //   // Cleanup function to remove the event listener
  //   return () => {
  //     window.removeEventListener("mousemove", handleMouseMove);
  //     window.removeEventListener("mouseup", handleMouseUp);
  //   };
  // }, [isResizingHeight, isResizingWidth]);

  return (
    <>
      {createPortal(
        <div className="fixed right-2 bottom-20 z-[100] flex min-w-0 flex-col items-end rounded-full sm:right-18 sm:bottom-6">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ scale: 0, x: "50%", y: "50%" }}
                animate={{ scale: 1, x: 0, y: 0 }}
                exit={{
                  scale: 0,
                  x: "50%",
                  y: "50%",
                  transition: { ease: "easeOut" },
                }}
                transition={{ duration: 0.3, ease: "backOut" }}
                className="absolute right-0 bottom-0 z-10 max-h-[calc(100vh-160px)] max-w-[calc(100vw-20px)] overflow-hidden rounded-2xl border bg-white shadow-xl shadow-black/50 sm:bottom-18 dark:bg-[#0A0E14]"
                style={{ height: `${height}px`, width: `${width}px` }}
              >
                <div className="relative flex h-full w-full flex-col">
                  {/* <div
                    className="absolute top-0 left-0 z-10 h-2 w-full cursor-n-resize"
                    onMouseDown={(e) => {
                      if (!isResizingHeight) {
                        e.stopPropagation();
                        setIsResizingHeight(true);
                        prevMousePos.current = { x: e.clientX, y: e.clientY };
                        prevHeight.current = height;
                      }
                    }}
                  ></div>
                  <div
                    className="absolute top-0 left-0 z-10 h-full w-2 cursor-e-resize"
                    onMouseDown={(e) => {
                      if (!isResizingWidth) {
                        e.stopPropagation();
                        setIsResizingWidth(true);
                        prevMousePos.current = { x: e.clientX, y: e.clientY };
                        prevWidth.current = width;
                      }
                    }}
                  ></div> */}
                  <div className="flex items-center justify-between border-b p-3">
                    <div className="flex items-center gap-2">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_33110_436788)">
                          <path
                            d="M29.2244 6.99485V12.4545C29.2251 14.5175 28.819 16.5604 28.0294 18.4664C27.2397 20.3723 26.0821 22.104 24.6226 23.5622H10.8184L15.4216 18.957L22.194 22.3434C24.0069 23.251 24.5038 22.2806 24.6212 21.4098V11.2084C24.6211 10.7475 24.7118 10.2911 24.8882 9.86534C25.0645 9.43956 25.3231 9.05271 25.6492 8.72694L28.4395 5.93841C25.8959 2.79409 22.2558 0.729408 18.2514 0.159648C14.247 -0.410113 10.1754 0.557314 6.85541 2.86734H12.4361C14.4997 2.86717 16.5432 3.27341 18.4498 4.06288C20.3565 4.85234 22.0889 6.00957 23.5482 7.46848V21.2733L18.945 16.6721L22.3319 9.8994C22.6432 9.277 22.7332 8.80747 22.68 8.46078C22.5831 7.78924 21.9688 7.54628 21.3982 7.47121H11.1897C10.7287 7.47112 10.2722 7.38018 9.84636 7.20359C9.42052 7.027 9.03366 6.76823 8.70789 6.44206L5.87798 3.60713C2.75762 6.15598 0.713826 9.78797 0.154805 13.7777C-0.404216 17.7674 0.562693 21.8211 2.8624 25.1292V19.6558C2.86051 17.5928 3.26537 15.5497 4.05382 13.6433C4.84228 11.7369 5.99886 10.0046 7.45743 8.5454H21.263L16.6611 13.1465L9.886 9.76018C8.07311 8.85251 7.57484 9.82296 7.4588 10.6938V20.8952C7.45831 21.826 7.08807 22.7186 6.42949 23.3766L3.64053 26.1665C6.1765 29.2472 9.77195 31.2696 13.7219 31.8372C17.6719 32.4048 21.6915 31.4767 24.9925 29.2348H19.6426C15.4754 29.2345 11.4789 27.5795 8.53179 24.6337V10.8303L13.1336 15.4314L9.74676 22.2041C9.43551 22.8265 9.34541 23.2961 9.39729 23.6428C9.49421 24.3157 10.1085 24.5573 10.6819 24.6323H20.8821C21.3436 24.6323 21.8005 24.7232 22.2268 24.8997C22.6531 25.0763 23.0404 25.3352 23.3667 25.6615L26.1079 28.4022C29.2131 25.8717 31.256 22.2686 31.8331 18.305C32.4101 14.3414 31.4793 10.3055 29.2244 6.99485Z"
                            fill="url(#paint0_linear_33110_436788)"
                          />
                        </g>
                        <defs>
                          <linearGradient
                            id="paint0_linear_33110_436788"
                            x1="25.4785"
                            y1="27.4877"
                            x2="11.64"
                            y2="10.7176"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#8B85FF" />
                            <stop offset="0.99" stop-color="#49DFBA" />
                          </linearGradient>
                          <clipPath id="clip0_33110_436788">
                            <rect width="32" height="32" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span className="text-sm font-semibold">ChatXNO</span>
                    </div>
                    <button onClick={() => setIsOpen(false)}>
                      <X size={18} />
                    </button>
                  </div>
                  <iframe
                    src="https://chat.xno.vn/"
                    className="w-full flex-1 border-none"
                    title="Popup Iframe"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex h-[50px] w-[50px] min-w-0 scale-90 items-center justify-center rounded-full p-2.5 text-white transition-all hover:scale-100 hover:bg-blue-700 sm:h-[68px] sm:w-[68px] sm:p-4 dark:!bg-[#0A0E14]"
            style={{
              border: "1px solid rgba(63, 216, 189, 0.35)",
              boxShadow: "0px 0px 8px 4px rgba(63, 216, 189, 0.15) inset",
              backdropFilter: "blur(2px)",
            }}
          >
            {/* <MessageCircle size={24} /> */}
            <Image
              width={36}
              height={36}
              src="/image/chat-bot-logo.png"
              alt="Chat Bot Logo"
            />
          </Button>
        </div>,
        document?.body,
      )}
    </>
  );
}
