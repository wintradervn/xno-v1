import Tabs from "@/components/ui/Tabs";
import { Tab } from "@heroui/react";
import { format, formatDistanceToNow } from "date-fns";
import React, { Suspense, useState } from "react";
import useSWR from "swr";
import { vi as viLocale } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import DefaultLoader from "@/components/ui/DefaultLoader";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useCompanyEvents from "@/hooks/useCompanyEvents";

const SubTabTinTuc = React.memo(function SubTabTinTuc() {
  const { currentSymbol } = useCurrentSymbol();

  const { data: news, isLoading } = useSWR(
    `https://protrade.finsc.vn/api/news?symbol=${currentSymbol}`,
    async (url) => {
      const res = await fetch(url);
      const data = await res.json();
      return data.filter((item: any) => !!item.title);
    },
  );

  return (
    <div className="flex flex-col pt-2">
      <ScrollArea className="">
        {isLoading ? (
          <DefaultLoader />
        ) : news?.length ? (
          <div className="-mx-1 grid grid-cols-2 gap-2">
            {news.map((item: any, index: number) => (
              <a
                href={item.link}
                target="_blank"
                key={index}
                className="flex cursor-pointer items-center gap-4 rounded-[8px] px-1 py-1 hover:bg-default-700/40"
              >
                <div className="shrink-0">
                  <div className="relative h-28 w-40 overflow-hidden rounded-[8px]">
                    <img
                      src={
                        item.linkimg ? item.linkimg : "/image/empty-image.png"
                      }
                      className="h-full w-full object-cover"
                      alt={item.title}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div
                    className="my-1 line-clamp-2 w-fit overflow-hidden text-ellipsis text-md font-semibold"
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  ></div>
                  <div className="text-md text-muted">
                    {new Date(item.time).toLocaleDateString() +
                      " - " +
                      formatDistanceToNow(new Date(item.time), {
                        locale: viLocale,
                        addSuffix: true,
                      })}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div>No data</div>
        )}
      </ScrollArea>
    </div>
  );
});

const SubTabSuKien = React.memo(function SubTabSuKien() {
  const { currentSymbol } = useCurrentSymbol();

  const { data } = useCompanyEvents(currentSymbol);
  return (
    <div className="">
      <table className="w-full text-sm">
        <thead className="text-sm font-semibold text-muted [&>td]:py-3 [&>td]:pl-2">
          <td>Ngày GDKHQ</td>
          <td>Tiêu đề</td>
          <td>Loại sự kiện</td>
          <td>Ngày công bố</td>
          <td>Ngày thực hiện</td>
          <td>Ngày chốt</td>
        </thead>
        <tbody className="font-semibold [&>tr:nth-child(odd)]:bg-background">
          {data?.map((_, index) => (
            <tr className="[&>td]:py-3 [&>td]:pl-2" key={index}>
              <td>
                {_.exrightdate
                  ? format(new Date(_.exrightdate), "dd/MM/yyyy")
                  : "--"}
              </td>
              <td>{_.eventtitle}</td>
              <td>{_.eventname}</td>
              <td>
                {_.publicdate
                  ? format(new Date(_.publicdate), "dd/MM/yyyy")
                  : "--"}
              </td>
              <td>
                {_.issuedate
                  ? format(new Date(_.issuedate), "dd/MM/yyyy")
                  : "--"}
              </td>
              <td>
                {_.recorddate
                  ? format(new Date(_.recorddate), "dd/MM/yyyy")
                  : "--"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default function TabTinTucSuKien() {
  const [selectedTab, setSelectedTab] = useState("tintuc");
  return (
    <div className="flex h-full flex-col gap-4">
      <Tabs
        color="primary"
        selectedKey={selectedTab}
        onSelectionChange={(k) => setSelectedTab(k as string)}
        classNames={{ base: "flex-shink-0" }}
      >
        <Tab key="tintuc" title="Tin tức"></Tab>
        <Tab key="sukien" title="Sự kiện"></Tab>
      </Tabs>
      {selectedTab === "tintuc" && <SubTabTinTuc />}
      {selectedTab === "sukien" && <SubTabSuKien />}
      {/* {selectedTab === "lichsu" && <SubTabLichSuChiaCoTuc />} */}
    </div>
  );
}
