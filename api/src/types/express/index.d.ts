import { Payload } from "../../dtos/jwtPayloadModel"; 

export {}

declare global {
    namespace Express {
      export interface Request {
        user: Payload;
      }
    }
  }