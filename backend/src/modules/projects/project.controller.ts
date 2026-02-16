import { Request, Response } from 'express';
import {
  _createProject,
  _listProjects,
  _getProjectById,
  _updateProjectStatus,
  _deleteProject,
} from './project.service';
import { successResponse } from '../../utils/baseApiResponse';
import { asyncHandler } from '../../middlewares/errorHandler.middleware';

export const createProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await _createProject(req.body);
    res.status(201).json(successResponse('Project created successfully', project));
  }
);

export const listProjectsController = asyncHandler(
  async (req: Request, res: Response) => {
    const projects = await _listProjects(req.query);
    res.json(successResponse('Projects retrieved successfully', projects));
  }
);

export const getProjectByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const project = await _getProjectById(id);
    res.json(successResponse('Project retrieved successfully', project));
  }
);

export const updateProjectStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const project = await _updateProjectStatus(id, req.body.status);
    res.json(successResponse('Project status updated successfully', project));
  }
);

export const deleteProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await _deleteProject(id);
    res.json(successResponse('Project deleted successfully'));
  }
);
