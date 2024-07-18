import jwt from "jsonwebtoken";
import {  JWT_REFRESH_TOKEN_SECRET, JWT_SECRET_KEY } from "../config/secrets";
import { Payload } from "../dtos/jwtPayloadModel";


export const verifyToken = (token: string): Payload | null => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY) as Payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
};

export const generateAccessToken = (userId: string, role: 'admin' | 'employee'): string => {
  return jwt.sign({ userId, role }, JWT_SECRET_KEY, { expiresIn: "6h" });
};

export const generateRefreshToken = (userId: string, role: 'admin' | 'employee'): string => {
  return jwt.sign({ userId, role }, JWT_REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
