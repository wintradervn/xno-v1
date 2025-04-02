"use client";
import { use, useEffect, useMemo, useRef, useState } from "react";
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
  classNames,
  onRowClick,
  noDataText,
  isStickyHeader,
}: {
  data?: any;
  isLoading?: boolean;
  columns: any;
  keyRender?: (a: any) => string;
  defaultSort?: { field: string; order: "asc" | "desc" };
  className?: string;
  classNames?: {
    header?: string;
    row?: string;
  };
  onRowClick?: (item: any) => void;
  noDataText?: string;
  isStickyHeader?: boolean;
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
              if (col?.sortFn) {
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

  useEffect(() => {
    if (defaultSort) {
      setSortField(defaultSort.field);
      setSortOrder(defaultSort.order);
    } else {
      setSortField("");
      setSortOrder("noorder");
    }
  }, [defaultSort?.field, defaultSort?.order]);

  return (
    <>
      {isLoading ? (
        <DefaultLoader />
      ) : sortedData?.length ? (
        <div
          className={cn(
            "flex h-full min-h-0 w-full flex-1 flex-col",
            className,
          )}
        >
          <ScrollArea className="flex-1">
            <div
              className={cn(
                "text-muted mb-2 grid shrink-0 gap-2 pr-2 text-sm font-semibold",
                classNames?.header,
                isStickyHeader && "bg-card sticky top-0 z-11",
              )}
              style={{
                gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
              }}
            >
              {columns.map((col: any) => (
                <div
                  key={col.key}
                  className={cn(
                    col.sortFn &&
                      "gap-1/2 hover:dark:text-default-200 flex cursor-pointer items-center justify-end font-semibold select-none hover:text-black",
                    col.className,
                    col.classNameHeader,
                    col.isSticky && "bg-card sticky left-0 z-10",
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
                  <div className="line-clamp-2 overflow-hidden text-ellipsis">
                    {col.title}
                  </div>
                  <div>
                    {sortField === col.key ? (
                      sortOrder === "asc" ? (
                        <ArrowUp size={12} />
                      ) : sortOrder === "desc" ? (
                        <ArrowDown size={12} />
                      ) : null
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <div className="pr-2">
              {sortedData.slice(0, limit).map((item: any, index: number) => (
                <div
                  key={keyRender ? keyRender(item) : index}
                  className={cn(
                    "group -mx-1 grid h-[38px] items-center gap-2 px-1 text-sm font-semibold",
                    onRowClick && "hover:bg-background cursor-pointer",
                    classNames?.row,
                  )}
                  onClick={() => onRowClick?.(item)}
                  style={{
                    gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                  }}
                >
                  {columns.filter(Boolean).map((col: any) => (
                    <div
                      key={col.key}
                      className={cn(
                        col.className,
                        col.classNameRow,
                        col.isSticky &&
                          "bg-card group-hover:bg-background sticky left-0 z-10",
                      )}
                    >
                      {col.render?.(item)}
                    </div>
                  ))}
                </div>
              ))}
              <div ref={triggerLoadMoreRef} className="h-2 w-full"></div>
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div>
          <DefaultNodata text={noDataText} />
        </div>
      )}
    </>
  );
}
