export default function Divider({
  className,
  ...props
}: Readonly<{
  className?: string;
}>) {
  return <div className={`h-[32px] w-[1px] bg-neutral-800 ${className}`} {...props} />;
}
