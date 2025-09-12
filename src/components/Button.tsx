import type React from "react";

type ButtonProps = {
  children: React.ReactNode;
  cb?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
};

function Button({ children, cb, type }: ButtonProps) {
  return (
    <button
      className={
        "px-8 py-2 bg-blue-800 text-white rounded-lg hover:cursor-pointer"
      }
      onClick={cb ? cb : undefined}
      type={type ? type : "button"}
    >
      {children}
    </button>
  );
}

export default Button;
