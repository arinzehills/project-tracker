export interface Project {
  _id: string;
  name: string;
  clientName: string;
  status: 'active' | 'on_hold' | 'completed';
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export type ProjectStatus = 'active' | 'on_hold' | 'completed';

export interface CreateProjectInput {
  name: string;
  clientName: string;
  status?: ProjectStatus;
  startDate: string;
  endDate?: string;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {}
