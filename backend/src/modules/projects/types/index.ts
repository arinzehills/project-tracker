export type ProjectStatus = 'active' | 'on_hold' | 'completed';

export interface IProject {
  _id?: string;
  name: string;
  clientName: string;
  status: ProjectStatus;
  startDate: Date | string;
  endDate?: Date | string;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
