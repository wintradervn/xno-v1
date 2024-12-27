"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollArea } from "./scroll-area";
import { ArrowDown, ArrowUp } from "solar-icon-set";
import { cn } from "@/lib/utils";
import DefaultNodata from "./DefaultNodata";
import DefaultLoader from "./DefaultLoader";

export default function Table({
  data,
  isLoading,
  columns,
  keyRender,
  defaultSort,
  className,
  onRowClick,
  noDataText,
}: {
  data?: any;
  isLoading?: boolean;
  columns: any;
  keyRender?: (a: any) => string;
  defaultSort?: { field: string; order: "asc" | "desc" };
  className?: string;
  onRowClick?: (item: any) => void;
  noDataText?: string;
}) {
  const [sortField, setSortField] = useState(defaultSort?.field || "");
  const [sortOrder, setSortOrder] = useState(defaultSort?.order || "noorder");
  const [limit, setLimit] = useState(20);

  const triggerLoadMoreRef = useRef<HTMLDivElement>(null);

  const sortedData = useMemo(
    () =>
      data
        ? [...data].sort((a: any, b: any) => {
            if (sortField) {
              const col = columns.find((col: any) => col.key === sortField);
              if (col.sortFn) {
                return sortOrder === "asc"
                  ? col.sortFn(a, b)
                  : sortOrder === "desc"
                    ? -col.sortFn(a, b)
                    : 0;
              }
            }
          })
        : [],
    [data, sortField, sortOrder, columns],
  );

  useEffect(() => {
    if (!sortedData) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLimit((prev) => {
            if (prev >= sortedData.length) return prev;
            return prev + 20;
          });
        }
      },
      { threshold: 0 },
    );
    if (triggerLoadMoreRef.current) {
      observer.observe(triggerLoadMoreRef.current);
    }
    return () => {
      if (triggerLoadMoreRef.current) {
        observer.unobserve(triggerLoadMoreRef.current);
      }
    };
  }, [sortedData?.length]);

  useEffect(() => {
    setLimit(20);
  }, [sortField, sortOrder]);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      {sortedData?.length ? (
        <>
          <div
            className={cn(
              "mb-2 grid gap-2 pr-2 text-sm font-semibold text-muted",
            )}
            style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
          >
            {columns.map((col: any) => (
              <div
                key={col.key}
                className={cn(
                  col.sortFn &&
                    "cursor-pointer select-none font-normal hover:text-default-200",
                  col.className || "",
                )}
                onClick={() => {
                  if (col.sortFn) {
                    if (sortField === col.key) {
                      setSortOrder(
                        sortOrder === "desc"
                          ? "asc"
                          : sortOrder === "asc"
                            ? "noorder"
                            : "desc",
                      );
                    } else {
                      setSortField(col.key);
                      setSortOrder("desc");
                    }
                  }
                }}
              >
                {col.title}{" "}
                {sortField === col.key ? (
                  sortOrder === "asc" ? (
                    <ArrowUp size={12} />
                  ) : sortOrder === "desc" ? (
                    <ArrowDown size={12} />
                  ) : null
                ) : null}
              </div>
            ))}
          </div>
          <ScrollArea className="min-h-0 flex-1">
            <div className="pr-2">
              {sortedData.slice(0, limit).map((item: any, index: number) => (
                <div
                  key={keyRender ? keyRender(item) : index}
                  className={cn(
                    "-mx-1 grid h-[38px] items-center gap-2 px-1 text-sm font-semibold",
                    onRowClick && "cursor-pointer hover:bg-default-700/40",
                  )}
                  onClick={() => onRowClick?.(item)}
                  style={{
                    gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                  }}
                >
                  {columns.filter(Boolean).map((col: any) => (
                    <div key={col.key} className={col.className || ""}>
                      {col.render?.(item)}
                    </div>
                  ))}
                </div>
              ))}
              <div ref={triggerLoadMoreRef} className="h-2 w-full"></div>
            </div>
          </ScrollArea>
        </>
      ) : isLoading ? (
        <div>
          <DefaultLoader />
        </div>
      ) : (
        <div>
          <DefaultNodata text={noDataText} />
        </div>
      )}
    </div>
  );
}
