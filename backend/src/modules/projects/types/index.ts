export type ProjectStatus = 'active' | 'on_hold' | 'completed';
export type ProjectPriority = 'high' | 'medium' | 'low';

export interface IProject {
  _id?: string;
  name: string;
  clientName: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: Date | string;
  endDate?: Date | string;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
