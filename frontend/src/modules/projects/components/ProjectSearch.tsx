"use client";

import React from "react";
import { Icon } from "@iconify/react";

interface SearchInputProps {
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
}

export const ProjectSearch: React.FC<SearchInputProps> = ({
  searchTerm,
  handleSearchChange,
  clearSearch,
}) => {
  return (
    <div className="relative  ">
      <Icon
        icon="flowbite:search-solid"
        className="absolute right-0 -mt-32 top-1/4 transform -translate-y-1/2 text-gray-400 w-5 h-5 text-[30px]"
        style={{ right: "1rem", marginTop: "0.8rem" }}
      />
      <input
        type="text"
        placeholder="Search projects by name or client..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full pl-12 pr-12 pl-2py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
      />
      {searchTerm && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors p-1"
          aria-label="Clear search"
        >
          <Icon icon="material-symbols:close" className="text-xl" />
        </button>
      )}
    </div>
  );
};

export default ProjectSearch;
