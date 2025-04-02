import { Tab } from "@heroui/react";
import Tabs from "@/components/ui/Tabs";
import { ComponentProps, RefObject, useRef } from "react";

interface ITabs extends ComponentProps<typeof Tabs> {
  tabList: Array<{ key: string; title: string }>;
  selectedTab: string;
  setSelectedTab: (key: string) => void;
}
export default function Tabs2({
  tabList,
  selectedTab,
  setSelectedTab,
  ...tabsProps
}: ITabs) {
  const tabsRef = useRef(null);
  const tabArrayRef = useRef<Array<RefObject<HTMLButtonElement>>>([]);

  return (
    <Tabs
      {...tabsProps}
      selectedKey={selectedTab}
      onSelectionChange={(key) => setSelectedTab(key as string)}
      ref={tabsRef}
    >
      {tabList?.map((tab, index) => (
        <Tab key={tab.key} title={tab.title} />
      )) || <Tab key="nocontent" title="No Content" />}
    </Tabs>
  );
}
