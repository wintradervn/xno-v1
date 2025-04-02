import ConditionalLayout from "./ConditionalLayout";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full flex-1 flex-col gap-1">
      <ConditionalLayout>{children}</ConditionalLayout>
    </div>
  );
}
