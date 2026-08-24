import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: "STUDENT" | "LIBRARIAN" | "ADMIN";
  };
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Authentication required."
      });
    }

    // Authorization must be: Bearer <JWT>
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Invalid authorization format."
      });
    }

    // Extract JWT
    const token = authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        error: "Token missing."
      });
    }

    // Get JWT secret
    const secret = process.env.JWT_SECRET?.trim();

    if (!secret) {
      console.error("JWT_SECRET is not configured.");
      return res.status(500).json({
        error: "Server authentication configuration error."
      });
    }

    // Verify token
    const payload = jwt.verify(token, secret) as {
      id: number;
      email: string;
      role: "STUDENT" | "LIBRARIAN" | "ADMIN";
    };

    // Validate payload
    if (
      !payload.id ||
      !payload.email ||
      !payload.role ||
      !["STUDENT", "LIBRARIAN", "ADMIN"].includes(payload.role)
    ) {
      return res.status(401).json({
        error: "Invalid token payload."
      });
    }

    // Attach authenticated user to request
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);

    return res.status(401).json({
      error: "Invalid or expired token."
    });
  }
}

export function authorize(
  ...roles: Array<"STUDENT" | "LIBRARIAN" | "ADMIN">
) {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required."
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Insufficient permissions."
      });
    }

    next();
  };
}