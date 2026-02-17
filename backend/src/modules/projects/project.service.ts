import { Project } from './schema/Project';
import { ProjectStatus } from './types';

const validTransitions: Record<ProjectStatus, ProjectStatus[]> = {
  active: ['on_hold', 'completed'],
  on_hold: ['active', 'completed'],
  completed: ['active', 'on_hold'],
};

export const _createProject = async (data: any) => {
  const project = new Project({
    name: data.name,
    clientName: data.clientName,
    status: data.status || 'active',
    startDate: data.startDate,
    endDate: data.endDate,
  });

  return await project.save();
};

export const _listProjects = async (filters: any) => {
  const { status, search, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

  const query: any = { deleted: false };

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { clientName: { $regex: search, $options: 'i' } },
    ];
  }

  const sortObj: any = {};
  const validSortFields = ['createdAt', 'startDate'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const order = sortOrder === 'asc' ? 1 : -1;
  sortObj[sortField] = order;

  return await Project.find(query).sort(sortObj);
};

export const _getProjectById = async (id: string) => {
  const project = await Project.findOne({ _id: id, deleted: false });

  if (!project) {
    throw new Error('Project not found');
  }

  return project;
};

export const _updateProjectStatus = async (
  id: string,
  newStatus: ProjectStatus
) => {
  const project = await Project.findOne({ _id: id, deleted: false });

  if (!project) {
    throw new Error('Project not found');
  }

  const currentStatus = project.status as ProjectStatus;
  const allowedTransitions = validTransitions[currentStatus];

  if (!allowedTransitions.includes(newStatus)) {
    throw new Error(
      `Cannot transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowedTransitions.join(', ') || 'none'}`
    );
  }

  project.status = newStatus;
  return await project.save();
};

export const _updateProject = async (id: string, updates: any) => {
  const project = await Project.findOne({ _id: id, deleted: false });

  if (!project) {
    throw new Error('Project not found');
  }

  // Handle status updates with transition validation
  if (updates.status) {
    const currentStatus = project.status as ProjectStatus;
    const newStatus = updates.status as ProjectStatus;
    const allowedTransitions = validTransitions[currentStatus];

    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(
        `Cannot transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowedTransitions.join(', ') || 'none'}`
      );
    }
  }

  // Update allowed fields
  const allowedFields = ['status', 'priority'];
  allowedFields.forEach((field) => {
    if (field in updates) {
      (project as any)[field] = updates[field];
    }
  });

  return await project.save();
};

export const _deleteProject = async (id: string) => {
  const project = await Project.findOne({ _id: id, deleted: false });

  if (!project) {
    throw new Error('Project not found');
  }

  project.deleted = true;
  return await project.save();
};
