import { Project } from './models/projectModel';
import { ProjectStatus } from './types';

const validTransitions: Record<ProjectStatus, ProjectStatus[]> = {
  active: ['on_hold', 'completed'],
  on_hold: ['active', 'completed'],
  completed: [],
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
  const {
    status,
    search,
    sortOrder = 'desc',
    createdFromDate,
    createdToDate,
    startFromDate,
    startToDate,
  } = filters;

  const query: any = { deleted: false };

  // Status filter
  if (status) {
    query.status = status;
  }

  // Search filter
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { clientName: { $regex: search, $options: 'i' } },
    ];
  }

  // Created date range filter
  if (createdFromDate || createdToDate) {
    query.createdAt = {};
    if (createdFromDate) {
      query.createdAt.$gte = new Date(createdFromDate);
    }
    if (createdToDate) {
      query.createdAt.$lte = new Date(createdToDate);
    }
  }

  // Project start date range filter
  if (startFromDate || startToDate) {
    query.startDate = {};
    if (startFromDate) {
      query.startDate.$gte = new Date(startFromDate);
    }
    if (startToDate) {
      query.startDate.$lte = new Date(startToDate);
    }
  }

  // Sort by created date (ascending/descending)
  const order = sortOrder === 'asc' ? 1 : -1;
  const sortObj = { createdAt: order } as any;

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
