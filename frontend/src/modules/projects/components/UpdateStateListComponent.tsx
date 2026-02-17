"use client";

import React, { useRef, useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface UpdateOption {
  label: string;
  value: string;
  color?: {
    bg: string;
    text: string;
  };
}

interface UpdateStateListComponentProps {
  currentValue: string;
  options: UpdateOption[];
  label?: string;
  onUpdate: (newValue: string) => Promise<void>;
  isLoading?: boolean;
  type?: "status" | "priority";
}

const UpdateStateListComponent: React.FC<UpdateStateListComponentProps> = ({
  currentValue,
  options,
  label = "Update",
  onUpdate,
  isLoading = false,
  type = "status",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentOption = options.find((opt) => opt.value === currentValue);
  const defaultColors =
    type === "status"
      ? { bg: "bg-gray-100", text: "text-gray-800" }
      : { bg: "bg-gray-100", text: "text-gray-800" };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = async (value: string) => {
    if (value === currentValue) {
      setIsOpen(false);
      return;
    }

    try {
      setIsUpdating(true);
      await onUpdate(value);
      setIsOpen(false);
    } catch (error) {
      console.error(`Failed to update ${type}:`, error);
    } finally {
      setIsUpdating(false);
    }
  };

  const displayColor = currentOption?.color || defaultColors;

  return (
    <div className="w-full">
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">
          {label}
        </label>
      )}

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => !isUpdating && setIsOpen(!isOpen)}
          disabled={isUpdating || isLoading}
          className={`flex items-center gap-2 transition-all ${
            isUpdating || isLoading
              ? "opacity-60 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${displayColor.bg} ${displayColor.text}`}
          >
            {currentOption?.label || currentValue}
          </span>
          {isUpdating && (
            <Icon icon="mdi:loading" className="text-lg animate-spin" />
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && !isUpdating && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="max-h-60 overflow-y-auto">
              {options.map((option, index) => {
                const isSelected = option.value === currentValue;
                const optionColor = option.color || defaultColors;

                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    disabled={isSelected}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center justify-between ${
                      isSelected
                        ? `${optionColor.bg} ${optionColor.text} font-semibold`
                        : `text-gray-700 hover:bg-gray-50 ${
                            index !== options.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          }`
                    }`}
                  >
                    <span className="flex items-center gap-2 capitalize">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${optionColor.bg} ${optionColor.text}`}
                      >
                        {option.label}
                      </span>
                    </span>
                    {isSelected && (
                      <Icon icon="mdi:check" className="text-lg" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateStateListComponent;
