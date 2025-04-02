"use client";
import Divider from "@/components/ui/Divider";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useCompiledOverviewData from "@/hooks/useCompiledOverviewData";
import useFavorites from "@/hooks/useFavorites";
import { IIndexOverview } from "@/hooks/useIndexOverview";
import { TSymbolOverviewData } from "@/hooks/useMarketOverview";
import {
  useSymbolWSData,
  useWSDataBySymbol,
} from "@/hooks/websocket/useSymbolInfoWebsocket";
import DoubleArrow from "@/icons/DoubleArrow";
import { cn, formatPriceWithType, getPriceColor } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";

export default function MucYeuThich() {
  const pathname = usePathname();
  const { favorites } = useFavorites();
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
    resizeObserver.observe(wrapper as Element);
    return () => {
      wrapper && resizeObserver.unobserve(wrapper);
    };
  }, [favoriteData, isInfiniteScroll, pathname]);

  if (pathname.startsWith("/bang-gia")) {
    return null;
  }

  return (
    <div className="card flex gap-2 overflow-hidden px-3 py-1 sm:px-5">
      <div className="text-muted mr-4 w-fit text-sm font-semibold text-nowrap">
        Mục yêu thích
      </div>
      <div className="flex-1 overflow-hidden" ref={wrapperRef}>
        <div
          className={cn("flex w-fit gap-4", {
            "hover:animate-pause animate-infinite-scroll": isInfiniteScroll,
          })}
          style={{ animationDuration: "40s" }}
          ref={contentRef}
        >
          {!isLoading
            ? [...(isInfiniteScroll ? favoriteData : []), ...favoriteData].map(
                (item, index: number) => (
                  <SymbolItem
                    key={item.code + index}
                    item={item}
                    index={index}
                  />
                ),
              )
            : null}
        </div>
      </div>
    </div>
  );
}

function getPriceColorStock(
  price: number,
  change: number,
  item?: TSymbolOverviewData,
) {
  if (!change && change !== 0) return "text-white";
  if (change === 0) return "text-yellow";
  if (price === item?.ceiling) return "text-ceiling";
  if (price === item?.floor) return "text-floor";
  return change > 0 ? "text-green" : "text-red";
}

function SymbolItem({
  item,
  index,
}: {
  item: IIndexOverview | TSymbolOverviewData;
  index: number;
}) {
  const { setChiTietMaCK } = useChiTietMaCK();
  const { siData } = useSymbolWSData(item.code);

  const price = siData?.price ? siData.price * 1000 : item.price || 0;
  const dayChange = siData?.changed
    ? siData.changed * 1000
    : item.dayChange || 0;
  const dayChangePercent = siData?.changedRatio
    ? siData.changedRatio
    : item.dayChangePercent;

  return (
    <Fragment key={item.code + index}>
      <div
        className="flex w-fit cursor-pointer items-start gap-1 select-none"
        onClick={() => {
          setChiTietMaCK(item.code);
        }}
      >
        <div className="w-fit text-sm font-medium">{item.code}</div>
        <div
          className={cn(
            "animate-change-background-cyan flex w-fit items-center gap-0.5 text-sm font-semibold",
            item.secType === "Index"
              ? getPriceColor(dayChange)
              : getPriceColorStock(
                  price,
                  dayChange,
                  item as TSymbolOverviewData,
                ),
          )}
          key={price}
        >
          {formatPriceWithType(price, item.secType)}
          {dayChange ? (
            dayChange > 0 ? (
              <DoubleArrow size={14} />
            ) : (
              <DoubleArrow rotate={180} size={14} />
            )
          ) : null}
          <span className="text-sm font-normal">
            {dayChangePercent !== null
              ? `${dayChangePercent.toFixed(2)}%`
              : "-"}
          </span>
        </div>
      </div>
      <Divider className="h-4!" />
    </Fragment>
  );
}
