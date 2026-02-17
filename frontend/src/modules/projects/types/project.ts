export interface Project {
  _id: string;
  name: string;
  clientName: string;
  status: 'active' | 'on_hold' | 'completed';
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export type ProjectStatus = 'active' | 'on_hold' | 'completed';
export type ProjectPriority = 'high' | 'medium' | 'low';

export interface CreateProjectInput {
  name: string;
  clientName: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate: string;
  endDate?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateProjectInput extends Partial<CreateProjectInput> {}
