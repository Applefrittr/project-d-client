import type React from "react";

type ButtonProps = {
  children: React.ReactNode;
  cb?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
};

function Button({ children, cb, type, disabled }: ButtonProps) {
  return (
    <button
      className={
        "px-8 py-2 bg-blue-800 text-white rounded-lg hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      }
      onClick={cb ? cb : undefined}
      type={type ? type : "button"}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
