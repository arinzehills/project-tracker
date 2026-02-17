import * as Joi from 'joi';

export const createProjectSchema = Joi.object({
  name: Joi.string().trim().required().min(1),
  clientName: Joi.string().trim().required().min(1),
  status: Joi.string().valid('active', 'on_hold', 'completed').default('active'),
  priority: Joi.string().valid('high', 'medium', 'low').default('medium'),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
});

export const listProjectsSchema = Joi.object({
  status: Joi.string().valid('active', 'on_hold', 'completed').optional(),
  search: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  // Date range filters
  createdFromDate: Joi.date().optional(),
  createdToDate: Joi.date().min(Joi.ref('createdFromDate')).optional(),
  startFromDate: Joi.date().optional(),
  startToDate: Joi.date().min(Joi.ref('startFromDate')).optional(),
}).unknown(true);

export const updateProjectStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'on_hold', 'completed').required(),
});
