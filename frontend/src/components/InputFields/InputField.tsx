/* eslint-disable prefer-const */
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { CSSProperties, useState } from "react";

interface InputFieldProps {
  type?: string;
  height?: number;
  width?: string;
  transparent?: boolean;
  label?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  onSuffixIconClick?: () => void;
  showRequired?: boolean;
  withRedBorder?: boolean;
  matched?: boolean;
  obscureText?: boolean;
  autocomplete?: string;
  inputClassName?: string;
  containerClassName?: string;
  inputStyle?: CSSProperties;
  prefixPadding?: string;
}

const InputField = ({
  type = "text",
  height,
  width,
  transparent,
  label,
  name,
  placeholder,
  value,
  onChange,
  prefixIcon,
  suffixIcon,
  error,
  disabled,
  onSuffixIconClick,
  showRequired = false,
  withRedBorder,
  matched,
  obscureText,
  autocomplete = "on",
  inputClassName = "",
  containerClassName = "",
  inputStyle,
  prefixPadding,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const widthClass = width ? `w-full sm:w-${width}` : "w-full";
  const backgroundColor = transparent ? "bg-transparent" : "bg-white";
  const prefixIconClass =
    "absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400";
  const suffixIconClass =
    "absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 cursor-pointer";

  // Apply conditional styles for withRedBorder
  const redBorderStyles = withRedBorder
    ? {
        border: "0.5px solid ",
        boxShadow: "0 0 6px #4e2ade05, 0 6px 18px #4e2ade05",
        transition: "border-width 0.35s, border-color 0.35s, color 0.35s",
        outlineColor: "#f4263e",
      }
    : {};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  let defaultSuffixIcon = matched ? (
    <Icon icon={"teenyicons:tick-circle-solid"} className="text-green-600" />
  ) : null;

  let passwordIcon =
    type === "password" || obscureText ? (
      showPassword ? (
        <Icon
          icon="streamline:invisible-1"
          onClick={togglePasswordVisibility}
        />
      ) : (
        <Icon
          icon="streamline:visible-solid"
          onClick={togglePasswordVisibility}
        />
      )
    ) : (
      suffixIcon || defaultSuffixIcon
    );

  return (
    <div
      className={`relative my-2 ${containerClassName}`}
      onClick={onSuffixIconClick}
    >
      {label && (
        <label
          htmlFor={label}
          className="block text-gray-700 text-sm font-light mb-2 capitalize"
        >
          {label}: {showRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {prefixIcon && <span className={prefixIconClass}>{prefixIcon}</span>}
        <input
          type={showPassword ? "text" : type}
          id={label}
          name={name}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autocomplete}
          style={{
            paddingLeft: prefixIcon
              ? prefixPadding
                ? prefixPadding
                : "2.5rem"
              : undefined,
            minHeight: height ?? 44,
            ...redBorderStyles,
            ...inputStyle,
          }}
          className={`pl-${prefixIcon ? "10" : "3"} pr-${
            suffixIcon || defaultSuffixIcon ? "10" : "3"
          }   ${widthClass} px-3 py-2 rounded-sm border-gray-300 border ${backgroundColor} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClassName}`}
          value={value}
          onChange={onChange}
        />
        {/* {(suffixIcon || defaultSuffixIcon) && ( */}
        <span className={suffixIconClass} onClick={onSuffixIconClick}>
          {passwordIcon}
        </span>
        {/* )} */}
      </div>
      {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
    </div>
  );
};

export default InputField;
