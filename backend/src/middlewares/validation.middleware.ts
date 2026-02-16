import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { errorResponse } from '../utils/baseApiResponse';

export const validationMiddleware = (schema: Joi.ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = schema.validate(
        { ...req.query, ...req.body },
        { abortEarly: false }
      );

      if (error) {
        const messages = error.details.map((detail: Joi.ValidationErrorItem) => detail.message);
        return res.status(400).json(
          errorResponse('Validation error', messages.join(', '))
        );
      }

      Object.assign(req.body, value);
      next();
    } catch (err) {
      res.status(500).json(
        errorResponse('Validation error', (err as any).message)
      );
    }
  };
};
