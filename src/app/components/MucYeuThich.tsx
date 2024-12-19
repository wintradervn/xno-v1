"use client";
import Divider from "@/components/ui/Divider";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useCompiledOverviewData from "@/hooks/useCompiledOverviewData";
import useFavorites from "@/hooks/useFavorites";
import DoubleArrow from "@/icons/DoubleArrow";
import { cn, formatPriceWithType, getPriceColor } from "@/lib/utils";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";

export default function MucYeuThich() {
  const { favorites } = useFavorites();
  const { setChiTietMaCK } = useChiTietMaCK();
  const { data, isLoading } = useCompiledOverviewData();
  const favoriteData = useMemo(
    () =>
      favorites && data
        ? data
            .filter((item) => favorites.includes(item.code))
            .sort(
              (a, b) => favorites.indexOf(a.code) - favorites.indexOf(b.code),
            )
        : [],
    [favorites, data],
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastWidthRef = useRef(0);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content || !favoriteData) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (
        wrapper.clientWidth < content.clientWidth &&
        isInfiniteScroll === false
      ) {
        wrapper.scrollLeft = 0;
        lastWidthRef.current = content.clientWidth;
        setIsInfiniteScroll(true);
      }
      if (
        (wrapper.clientWidth >= lastWidthRef.current ||
          wrapper.clientWidth >= content.clientWidth / 2) &&
        isInfiniteScroll === true
      ) {
        setIsInfiniteScroll(false);
      }
    });

    // Start observing the target div
    resizeObserver.observe(wrapperRef.current);
    return () => {
      wrapperRef.current && resizeObserver.unobserve(wrapperRef.current);
    };
  }, [favoriteData, isInfiniteScroll]);

  return (
    <div className="card flex gap-2 overflow-hidden px-5 py-1">
      <div className="mr-4 w-fit text-nowrap text-sm font-semibold text-muted">
        Mục yêu thích
      </div>
      <div className="flex-1 overflow-hidden" ref={wrapperRef}>
        <div
          className={cn("flex w-fit gap-4", {
            "hover:animate-pause animate-infinite-scroll": isInfiniteScroll,
          })}
          style={{ animationDuration: "20s" }}
          ref={contentRef}
        >
          {!isLoading
            ? [...(isInfiniteScroll ? favoriteData : []), ...favoriteData].map(
                (item, index: number) => (
                  <Fragment key={item.code + index}>
                    <div
                      className="flex w-fit cursor-pointer select-none items-start gap-1 hover:text-white"
                      onClick={() => {
                        setChiTietMaCK(item.code);
                      }}
                    >
                      <div className="w-fit text-sm font-medium">
                        {item.code}
                      </div>
                      <div
                        className={cn(
                          "flex w-fit items-center gap-0.5 text-sm font-semibold",
                          getPriceColor(item.dayChange),
                        )}
                      >
                        {formatPriceWithType(item.price, item.secType)}
                        {item.dayChange ? (
                          item.dayChange > 0 ? (
                            <DoubleArrow size={14} />
                          ) : (
                            <DoubleArrow rotate={180} size={14} />
                          )
                        ) : null}
                        <span className="text-sm font-normal">
                          {item.dayChangePercent !== null
                            ? `${item.dayChangePercent.toFixed(2)}%`
                            : "-"}
                        </span>
                      </div>
                    </div>
                    <Divider className="!h-4" />
                  </Fragment>
                ),
              )
            : null}
        </div>
      </div>
    </div>
  );
}
