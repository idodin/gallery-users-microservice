import { body, param, ValidationChain } from "express-validator/check";
import { hasNoSpaces } from "./custom";

export function userValidator(method: string): ValidationChain[] {
    switch (method) {
        case "GET /users": {
            return [];
        }
        case "GET /users/:username": {
            return [
                param("username", "Missing ':username'").exists().isString(),
            ];
        }
        case "POST /users": {
            return [
                body("username", "Missing 'username'").exists(),
                body("username", "Invalid 'username'").isString().custom(hasNoSpaces),
                body("email", "Missing 'email'").exists(),
                body("email", "Invalid 'email'").isEmail(),
                body("password", "Missing 'password'").exists(),
                body("password", "Invalid 'password'").isString().custom(hasNoSpaces)
            ];
        }
        case "DELETE /users/:userId": {
            return [
                param("userId", "Invalid or missing ':userId'").exists().isMongoId()
            ];
        }
    }
}