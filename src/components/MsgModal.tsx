function MsgModal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`p-8 rounded-md border border-black flex flex-col gap-3 justify-center items-center ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
}

export default MsgModal;
