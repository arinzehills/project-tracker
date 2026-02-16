"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Button from "@components/Button";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterField {
  key: string;
  label: string;
  type: "text" | "select" | "date";
  options?: FilterOption[];
}

interface ProjectFilterProps {
  fields: FilterField[];
  onFilterChange: (filters: Record<string, string>) => void;
  initialFilters?: Record<string, string>;
}

export const ProjectFilter = ({
  fields,
  onFilterChange,
  initialFilters = {},
}: ProjectFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] =
    useState<Record<string, string>>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== null && value !== "",
  );

  return (
    <div className="relative overflow-visible">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white text-gray-900 font-medium transition whitespace-nowrap"
      >
        <Icon icon="cuida:filter-outline" className="text-lg" />
        Filter
      </button>

      {isOpen && (
        <div
          className="absolute z-50 top-full right-0 mt-2 p-6 bg-white shadow-lg rounded-lg border border-gray-200 "
          style={{ width: "20rem", gap: "2rem" }}
        >
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Advanced Filters
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition"
              aria-label="Close filters"
            >
              <Icon icon="proicons:cancel" className="text-gray-500 text-xl" />
            </button>
          </div>

          <div className="space-y-4 mb-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-20">
                  {field.label}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    placeholder={field.label}
                    value={filters[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                )}

                {field.type === "select" && (
                  <div className="relative">
                    <select
                      value={filters[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className={`w-full bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer ${
                        filters[field.key] ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      <option value="" className="text-gray-400">
                        Select {field.label}...
                      </option>
                      {field.options &&
                        field.options.map((opt) => (
                          <option
                            key={opt.value}
                            value={opt.value}
                            className="text-gray-900"
                          >
                            {opt.label}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {field.type === "date" && (
                  <input
                    type="date"
                    value={filters[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleApply}
              width="full"
              buttonColor="bg-indigo-600 hover:bg-indigo-700"
              textColor="text-white"
            >
              Apply
            </Button>
            {hasActiveFilters && (
              <Button
                onClick={handleClear}
                width="full"
                buttonColor="bg-gray-200 hover:bg-gray-300"
                textColor="text-gray-900"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFilter;
