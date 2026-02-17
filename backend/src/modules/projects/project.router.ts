import { Router } from 'express';
import {
  createProjectController,
  listProjectsController,
  getProjectByIdController,
  updateProjectStatusController,
  updateProjectController,
  deleteProjectController,
} from './project.controller';
import {
  createProjectSchema,
  listProjectsSchema,
  updateProjectStatusSchema,
} from './project.validation';
import { validationMiddleware } from '../../middlewares/validation.middleware';

const router = Router();

// POST /api/projects - Create a new project
router.post('/', validationMiddleware(createProjectSchema), createProjectController);

// GET /api/projects - List projects with filtering, search, and sorting
router.get('/', validationMiddleware(listProjectsSchema), listProjectsController);

// GET /api/projects/:id - Get single project by ID
router.get('/:id', getProjectByIdController);

// PATCH /api/projects/:id/status - Update project status
router.patch(
  '/:id/status',
  validationMiddleware(updateProjectStatusSchema),
  updateProjectStatusController
);

// PATCH /api/projects/:id - Update project (generic update for status, priority, etc.)
router.patch('/:id', updateProjectController);

// DELETE /api/projects/:id - Delete project (soft delete)
router.delete('/:id', deleteProjectController);

export default { router, path: '/projects' };
