'use client';

import { useProjects } from '@/core/hooks/useProjects';
import { ProjectListShimmer } from '@/components/Loaders/ShimmerLoader';
import { Project } from '../types/project';

interface ProjectListProps {
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

const ProjectList = ({
  status,
  search,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: ProjectListProps) => {
  const { projects, loading, error, refetch } = useProjects({
    status,
    search,
    sortBy,
    sortOrder,
  });

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error loading projects</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return <ProjectListShimmer count={6} />;
  }

  if (projects.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
        <p className="text-gray-600">Try adjusting your filters or create a new project to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const statusColors: Record<string, { bg: string; text: string }> = {
    active: { bg: 'bg-green-100', text: 'text-green-800' },
    on_hold: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-800' },
  };

  const statusColor = statusColors[project.status] || statusColors.active;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
            {project.name}
          </h3>
          <p className="text-sm text-gray-500">{project.clientName}</p>
        </div>
        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusColor.bg} ${statusColor.text}`}>
          {project.status}
        </span>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-500 text-xs mb-1">Start Date</p>
          <p className="text-gray-900 font-medium">
            {new Date(project.startDate).toLocaleDateString()}
          </p>
        </div>
        {project.endDate && (
          <div>
            <p className="text-gray-500 text-xs mb-1">End Date</p>
            <p className="text-gray-900 font-medium">
              {new Date(project.endDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Footer with Actions */}
      <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
        <button className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition font-medium">
          View Details
        </button>
        <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-900 text-sm rounded-lg hover:bg-gray-200 transition font-medium">
          Update Status
        </button>
      </div>
    </div>
  );
};

export default ProjectList;
