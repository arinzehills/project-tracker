'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '@components/Button';
import { usePost } from '@/core/hooks/usePost';
import { useProjects } from '@/core/hooks/useProjects';
import { refreshRegistry } from '@/core/hooks/useRefreshRegistry';
import type { Project, CreateProjectInput } from '../types/project';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddProjectModal = ({ isOpen, onClose, onSuccess }: AddProjectModalProps) => {
  const [formData, setFormData] = useState<CreateProjectInput>({
    name: '',
    clientName: '',
    status: 'active',
    startDate: '',
    endDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { execute, isLoading } = usePost<Project>();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.endDate && formData.startDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be >= start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      ...formData,
      endDate: formData.endDate || undefined,
    };

    await execute('/projects', payload, {
      canToastSuccess: true,
      invalidate: 'projects',
    });

    // Reset form and close modal
    setFormData({
      name: '',
      clientName: '',
      status: 'active',
      startDate: '',
      endDate: '',
    });
    setErrors({});

    // Trigger refetch of projects
    refreshRegistry.invalidate('projects');

    onClose();
    onSuccess?.();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-lg max-w-md w-full transform transition-all duration-300 scale-100 opacity-100 animate-in fade-in slide-in-from-bottom-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">New Project</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition"
              aria-label="Close modal"
            >
              <Icon icon="proicons:cancel" className="text-gray-500 text-xl" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Website Redesign"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="e.g., Acme Corp"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.clientName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.clientName && <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <Button
                onClick={handleSubmit}
                width="full"
                buttonColor="bg-indigo-600 hover:bg-indigo-700"
                textColor="text-white"
                loading={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProjectModal;
