import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { SpinnerLoader } from "../Loaders/SpinnerLoader";

export interface DropDownOption {
  label: string;
  value: string | number;
}

export const SELECT_RETURN_VALUETYPE = {
  value: "value",
  label: "label",
};

interface CustomDropDownProps {
  options?: DropDownOption[];
  onSelect?: (option: DropDownOption) => void;
  dropDownLabel?: string;
  showSearchBox?: boolean;
  showRequired?: boolean;
  loading?: boolean;
  error?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
  defaultValue?: string | number;
  name?: string;
}

const CustomDropDown: React.FC<CustomDropDownProps> = ({
  options = [{ label: "Select Option", value: "" }],
  onSelect,
  dropDownLabel = "",
  showSearchBox = false,
  showRequired = false,
  loading = false,
  error,
  isEmpty = false,
  emptyMessage = "No items available",
  emptyIcon = "mdi:inbox-outline",
  defaultValue,
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<DropDownOption>(
    options[0],
  );

  const getSelectedOption = (option?: DropDownOption) => {
    const isOption =
      option ||
      options.find(
        (opt) => opt.label === defaultValue || opt.value === defaultValue,
      ) ||
      options[0];
    setSelectedOption(isOption);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionSelect = (option: DropDownOption) => {
    getSelectedOption(option);
    setIsOpen(false);
    onSelect?.(option);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredOptions = options.filter((option) =>
    option?.label?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    getSelectedOption();
  }, [defaultValue]);

  return (
    <div className="w-full">
      {dropDownLabel && (
        <label
          htmlFor={dropDownLabel}
          className="block text-gray-700 text-sm font-light mb-2 capitalize"
        >
          {dropDownLabel}
          {showRequired && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className="relative w-full">
        <button
          type="button"
          name={name}
          className={`w-full text-sm px-4 py-2 flex justify-between items-center border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 transition-all ${
            error
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-indigo-300"
          }`}
          onClick={toggleDropdown}
          style={{ height: "44px" }}
        >
          {selectedOption?.label}
          <span className="text-gray-500">
            <Icon icon={"iconamoon:arrow-down-2-bold"} />
          </span>
        </button>

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            {showSearchBox && (
              <input
                type="text"
                className="w-full p-2 border-b border-gray-200 outline-none text-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            )}

            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <div className="py-8 px-4">
                  <SpinnerLoader />
                </div>
              ) : isEmpty ? (
                <div className="flex flex-col items-center justify-center py-6 px-4">
                  <Icon
                    icon={emptyIcon}
                    className="text-gray-400 text-4xl mb-3"
                  />
                  <p className="text-center text-gray-500 text-sm">
                    {emptyMessage}
                  </p>
                </div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <p className="text-center py-2 text-gray-500">
                  No options found
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDropDown;
