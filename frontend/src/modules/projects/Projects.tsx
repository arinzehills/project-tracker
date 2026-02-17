"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import ProjectListGrouped from "./components/ProjectListGrouped";
import ProjectGridGrouped from "./components/ProjectGridGrouped";
import ProjectSearch from "./components/ProjectSearch";
import ProjectFilter from "./components/ProjectFilter";
import ActiveFilterChips from "./components/ActiveFilterChips";
import Button from "@components/Button";
import AddProjectModal from "./components/AddProjectModal";
import { useProjectView } from "./hooks/useProjectView";
import { useProjectFilters } from "./hooks/useProjectFilters";
import { useProjects } from "@/core/hooks/useProjects";
import { useDelete } from "@/core/hooks/useDelete";
import { filterFields } from "./data/filterFields";

const Projects = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    filters,
    search,
    handleSearchChange,
    clearSearch,
    handleFilterChange,
    handleRemoveFilter,
    handleClearAllFilters,
  } = useProjectFilters();

  const { toggleView, isList, isGrid } = useProjectView();
  const { projects, loading, error, refetch } = useProjects({
    status: filters.status,
    search,
    sortBy: filters.sortBy || "createdAt",
    sortOrder: filters.sortOrder || "desc",
  });
  const { deleteItem } = useDelete();

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteItem(`/projects/${projectId}`, {
        canToastSuccess: true,
        invalidate: "projects",
      });
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

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
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between flex-1">
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

          {/* View Toggle Button */}
        </div>
        <div className="flex items-center gap-4 my-2 justify-end">
          <button
            onClick={toggleView}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 h-12"
            title={`Switch to ${isGrid ? "list" : "grid"} view`}
          >
            <Icon
              icon={isGrid ? "mdi:format-list-bulleted" : "flowbite:grid-solid"}
              className="text-xl text-gray-600"
            />
            <span className="text-xs font-medium text-gray-600 hidden sm:inline">
              {isGrid ? "List" : "Grid"}
            </span>
          </button>

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

        {/* Project List/Grid - Grouped by Status */}
        {isList ? (
          <ProjectListGrouped
            projects={projects}
            loading={loading}
            error={error}
            onRefetch={refetch}
            onDelete={handleDeleteProject}
          />
        ) : (
          <ProjectGridGrouped
            projects={projects}
            loading={loading}
            error={error}
            onRefetch={refetch}
            onDelete={handleDeleteProject}
          />
        )}
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
