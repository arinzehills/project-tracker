import mongoose, { Schema, Document } from 'mongoose';
import { ProjectStatus } from '../types';

interface IProjectDocument extends Document {
  name: string;
  clientName: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  deleted: boolean;
}

const projectSchema = new Schema<IProjectDocument>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [1, 'Project name cannot be empty'],
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
      minlength: [1, 'Client name cannot be empty'],
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'on_hold', 'completed'] as ProjectStatus[],
        message: 'Status must be one of: active, on_hold, completed',
      },
      default: 'active',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (this: IProjectDocument, value: Date | null) {
          if (!value) return true; // endDate is optional
          return value >= this.startDate;
        },
        message: 'End date must be greater than or equal to start date',
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for soft delete queries
projectSchema.index({ deleted: 1 });

export const Project = mongoose.model<IProjectDocument>(
  'Project',
  projectSchema
);
