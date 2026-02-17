"use client";

import { useState } from "react";
import Button from "@components/Button";
import AnimatedModal from "@/components/AnimatedModal/AnimatedModal";
import InputField from "@/components/InputFields/InputField";
import CustomDropDown from "@/components/InputFields/CustomDropDown";
import type { DropDownOption } from "@/components/InputFields/CustomDropDown";
import { usePost } from "@/core/hooks/usePost";
import { refreshRegistry } from "@/core/hooks/useRefreshRegistry";
import type { Project, CreateProjectInput } from "../types/project";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddProjectModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddProjectModalProps) => {
  const [formData, setFormData] = useState<CreateProjectInput>({
    name: "",
    clientName: "",
    status: "active",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { execute, isLoading } = usePost<Project>();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (formData.endDate && formData.startDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = "End date must be >= start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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

    await execute("/projects", payload, {
      canToastSuccess: true,
      invalidate: "projects",
    });

    // Reset form and close modal
    setFormData({
      name: "",
      clientName: "",
      status: "active",
      startDate: "",
      endDate: "",
    });
    setErrors({});

    // Trigger refetch of projects
    refreshRegistry.invalidate("projects");

    onClose();
    onSuccess?.();
  };

  return (
    <AnimatedModal
      openModal={isOpen}
      setOpenModal={onClose}
      maxWidthClass="max-w-md p-6"
      canClose={true}
    >
      <div className=" bg-white p-8 flex flex-col gap-20">
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
          <h2 className="text-2xl font-bold text-gray-900">New Project</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <InputField
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Website Redesign"
            error={errors.name}
            showRequired
          />

          {/* Client Name */}
          <InputField
            label="Client Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="e.g., Acme Corp"
            error={errors.clientName}
            showRequired
          />

          {/* Status */}
          <CustomDropDown
            dropDownLabel="Status"
            name="status"
            options={[
              { label: "Active", value: "active" },
              { label: "On Hold", value: "on_hold" },
              { label: "Completed", value: "completed" },
            ]}
            defaultValue={formData.status}
            onSelect={(option: DropDownOption) =>
              handleChange({
                target: { name: "status", value: option.value as string },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
          />

          {/* Start Date & Time */}
          <InputField
            type="datetime-local"
            label="Start Date & Time"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            error={errors.startDate}
            showRequired
          />

          {/* End Date & Time */}
          <InputField
            type="datetime-local"
            label="End Date & Time"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            error={errors.endDate}
          />

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
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </AnimatedModal>
  );
};

export default AddProjectModal;
