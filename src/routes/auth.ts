import { Router } from "express";
import { authController } from "../controllers/auth";
import { authValidator } from "../validators/auth";

const authRouter: Router = Router();

/**
 * @swagger
 * /auth/login/:
 *  post:
 *      description: Logs in as a user
 *      tags:
 *          - Users
 *      parameters:
 *          - in: body
 *            name: loginData
 *            description: Login information
 *            schema:
 *                type: object
 *                properties:
 *                    email:
 *                        type: string
 *                    password:
 *                        type: integer
 *                example:
 *                    email: "example@gmail.com"
 *                    password: "password"
 *      produces:
 *          -application/json
 *      responses:
 *          200:
 *              description: Returns JWT Token on successful login
 *          400:
 *              description: Invalid Username or Password
 *          422:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
authRouter.post("/login", authValidator("POST /auth/login"), authController.login);

authRouter.post("/introspect", authValidator("POST /auth/introspect"), authController.introspect);

export { authRouter };