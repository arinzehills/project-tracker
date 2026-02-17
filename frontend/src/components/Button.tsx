/* eslint-disable @typescript-eslint/no-explicit-any */

import { SpinnerLoader } from "./Loaders/SpinnerLoader";

const Button = ({
  width,
  height,
  children,
  isCircular,
  buttonColor = "bg-indigo-600",
  loading = false,
  textColor = "text-white",
  prefixIcon,
  suffixIcon,
  withBorder = false,
  borderClass = "border border-indigo-600",
  ...rest
}: any) => {
  const { disabled } = loading ? { disabled: loading } : rest;

  const styles = `hover:opacity-80 flex items-center justify-center font-medium py-2 px-4 transition-colors duration-200 ${
    isCircular ? "rounded-full" : "rounded-lg"
  } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`;

  const widthStyle = width ? `w-${width}` : "w-44";
  const heightStyle = height ? `h-${height}` : "h-12";
  const finalBorderClass = withBorder ? borderClass : "";
  const classNames = `${buttonColor} ${textColor} inline-block ${styles} ${widthStyle} ${heightStyle} ${finalBorderClass}`;

  return (
    <button className={classNames} disabled={disabled} {...rest}>
      {!loading ? (
        <>
          {prefixIcon && <span className="mr-2">{prefixIcon}</span>}
          {children}
          {suffixIcon && <span className="ml-2">{suffixIcon}</span>}
        </>
      ) : (
        <SpinnerLoader />
      )}
    </button>
  );
};

export default Button;
