export default function UnfinishedFeature({
  children,
}: {
  children: React.ReactNode;
}) {
  if (
    typeof window !== "undefined" &&
    window.location.origin.includes("xno.vn")
  ) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-full">
          <img
            src="/image/unfinished-feature.png"
            className="h-full max-h-[300px] w-full max-w-[300px] object-contain"
          />
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
