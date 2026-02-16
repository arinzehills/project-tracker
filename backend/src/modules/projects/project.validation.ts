import * as Joi from 'joi';

export const createProjectSchema = Joi.object({
  name: Joi.string().trim().required().min(1),
  clientName: Joi.string().trim().required().min(1),
  status: Joi.string().valid('active', 'on_hold', 'completed').default('active'),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).optional(),
});

export const listProjectsSchema = Joi.object({
  status: Joi.string().valid('active', 'on_hold', 'completed').optional(),
  search: Joi.string().optional(),
  sortBy: Joi.string().valid('createdAt', 'startDate').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
}).unknown(true);

export const updateProjectStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'on_hold', 'completed').required(),
});
