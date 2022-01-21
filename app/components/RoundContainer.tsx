export default function RoundContainer({
  children,
  className,
  rounded,
}: {
  children: React.ReactNode;
  className?: string;
  rounded?: boolean;
}) {
  // main function
  return (
    <div
      className={`lg:col-span-4 overflow-hidden  ${
        rounded ?? 'rounded-lg'
      } aspect-w-2 aspect-h-3 ${className}`}
    >
      <div className="">{children}</div>
    </div>
  );
}
