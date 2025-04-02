export default function Divider({
  className,
  ...props
}: Readonly<{
  className?: string;
}>) {
  return (
    <div
      className={`bg-light-surface-sub h-[32px] w-[1px] dark:bg-neutral-800 ${className}`}
      {...props}
    />
  );
}
