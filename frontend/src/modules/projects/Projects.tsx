"use client";

import { useState } from "react";
import ProjectList from "./components/ProjectList";
import ProjectSearch from "./components/ProjectSearch";
import ProjectFilter from "./components/ProjectFilter";
import ActiveFilterChips from "./components/ActiveFilterChips";
import Button from "@components/Button";
import AddProjectModal from "./components/AddProjectModal";

const Projects = () => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [search, setSearch] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  const handleRemoveFilter = (key: string) => {
    setFilters((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const handleClearAllFilters = () => {
    setFilters({});
  };

  const filterFields = [
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { value: "active", label: "Active" },
        { value: "on_hold", label: "On Hold" },
        { value: "completed", label: "Completed" },
      ],
    },
    {
      key: "sortBy",
      label: "Sort By",
      type: "select" as const,
      options: [
        { value: "createdAt", label: "Created Date" },
        { value: "startDate", label: "Start Date" },
      ],
    },
    {
      key: "sortOrder",
      label: "Order",
      type: "select" as const,
      options: [
        { value: "desc", label: "Newest First" },
        { value: "asc", label: "Oldest First" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Projects</h1>
            <p className="text-gray-600">
              Manage and track your projects efficiently
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 overflow-visible flex justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <ProjectSearch
              searchTerm={search}
              handleSearchChange={handleSearchChange}
              clearSearch={clearSearch}
            />

            <div className="w-full sm:w-auto">
              <ProjectFilter
                fields={filterFields}
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />
            </div>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            buttonColor="bg-indigo-600 hover:bg-indigo-700"
            textColor="text-white"
          >
            + Add Project
          </Button>
        </div>

        {/* Active Filters Display */}
        {(Object.keys(filters).length > 0 || search) && (
          <ActiveFilterChips
            filters={{ ...filters, search: search || "" }}
            filterFields={[
              ...filterFields,
              {
                key: "search",
                label: "Search",
                type: "text" as const,
              },
            ]}
            onRemoveFilter={(key) => {
              if (key === "search") {
                clearSearch();
              } else {
                handleRemoveFilter(key);
              }
            }}
            onClearAll={handleClearAllFilters}
          />
        )}

        {/* Project List */}
        <ProjectList
          status={filters.status}
          search={search}
          sortBy={filters.sortBy || "createdAt"}
          sortOrder={filters.sortOrder || "desc"}
        />
      </div>
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          // Optional: You can add additional success logic here
        }}
      />
    </div>
  );
};

export default Projects;
