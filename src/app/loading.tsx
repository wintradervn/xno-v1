export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="animate-pulse">
        <img src="/logo.png" alt="XNO logo" style={{ objectFit: "contain" }} />
      </div>
    </div>
  );
}
