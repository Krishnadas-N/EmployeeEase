import { Request } from "express";
import { Payload } from "../dtos/jwtPayloadModel"; 

type RequestWithUser = Request & { user: Payload };

export function assertHasUser(req: Request): asserts req is RequestWithUser {
    if (!("user" in req)) {
        throw new Error("Request object without user found unexpectedly");
    }
}
