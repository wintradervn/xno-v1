"use client";

import { RoundedMagnifer } from "solar-icon-set";
import Input from "@/components/ui/Input";
import { Spinner } from "@nextui-org/react";
import useSWR from "swr";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi as viLocale } from "date-fns/locale";
import { useDebounce } from "use-debounce";

function News() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, _] = useDebounce(search, 1000);
  const { data: news, isLoading } = useSWR(
    `https://protrade.finsc.vn/api/news${debouncedSearch ? "?symbol=" + debouncedSearch : ""}`,
    async (url) => {
      const res = await fetch(url);
      const data = await res.json();
      return data.filter((item: any) => !!item.title);
    },
  );

  return (
    <div className="flex h-full w-full min-w-[200px] flex-col">
      <div className="border-lineargreen text-lineargreen w-fit flex-shrink-0 border-b-2 px-2 py-2 text-sm font-semibold">
        Tin tức
      </div>
      <div className="flex-shrink-0 py-2">
        <Input
          placeholder="Tìm kiếm"
          size="sm"
          value={search}
          onValueChange={(value) => setSearch(value)}
          startContent={<RoundedMagnifer size={18} />}
          classNames={{
            inputWrapper: "bg-[#1F2533]",
          }}
        />
      </div>
      <ScrollArea className="">
        {isLoading ? (
          <div className="flex h-[500px] w-full items-center justify-center">
            <Spinner />
          </div>
        ) : news?.length ? (
          news.map((item: any, index: number) => (
            <a
              href={item.link}
              target="_blank"
              key={index}
              className="flex cursor-pointer gap-2 py-2 hover:bg-default-700/40"
              suppressHydrationWarning
            >
              <div className="flex-shrink-0">
                <div className="relative h-16 w-16 overflow-hidden rounded-[8px]">
                  <img
                    src={item.linkimg ? item.linkimg : "/image/empty-image.png"}
                    className="h-full w-full object-cover"
                    alt={item.title}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div
                  className="my-1 line-clamp-2 w-fit overflow-hidden text-ellipsis text-sm"
                  dangerouslySetInnerHTML={{ __html: item.title }}
                ></div>
                <div className="text-sm text-muted">
                  {new Date(item.time).toLocaleDateString() +
                    " - " +
                    formatDistanceToNow(new Date(item.time), {
                      locale: viLocale,
                      addSuffix: true,
                    })}
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="flex h-20 items-center justify-center text-muted">
            Không tìm thấy bài viết
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default News;