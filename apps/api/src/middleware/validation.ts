import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { logger } from "../config/logger";

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn("Validation failed:", { errors: error.errors });
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.errors,
        });
      }
      next(error);
    }
  };
}

export function validateQuery(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn("Query validation failed:", { errors: error.errors });
        return res.status(400).json({
          success: false,
          error: "Invalid query parameters",
          details: error.errors,
        });
      }
      next(error);
    }
  };
}

export function validateBody(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn("Body validation failed:", { errors: error.errors });
        return res.status(400).json({
          success: false,
          error: "Invalid request body",
          details: error.errors,
        });
      }
      next(error);
    }
  };
}
