import { Router } from "express";
import { userController } from "../controllers/user";
import { userValidator } from "../validators/user";

const userRouter: Router = Router();

/**
 * @swagger
 * /users/:
 *  get:
 *      description: Gets all Users
 *      tags:
 *          - Users
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Returns all Users
 *          422:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
userRouter.get("/", userValidator("GET /users"), userController.index);

/**
 * @swagger
 * /users/{userId}:
 *  get:
 *      description: Gets a specific User
 *      parameters:
 *          -   in: path
 *              name: userId
 *              description: ID of the User to retrieve
 *              schema:
 *                  type: string
 *                  required: true
 *      tags:
 *          - Users
 *      produces:
 *          - applications/json
 *      responses:
 *          200:
 *              description: Returns specific User
 *          404:
 *              description: User with given ID not found
 *          422:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
userRouter.get("/:userId", userValidator("GET /users/:userId"), userController.show);

/**
 * @swagger
 * /users/:
 *  post:
 *      description: Creates a new User
 *      tags:
 *          - Users
 *      parameters:
 *          - in: body
 *            name: userData
 *            description: new User information
 *            schema:
 *                type: object
 *                properties:
 *                    username:
 *                        type: string
 *                    email:
 *                        type: string
 *                    password:
 *                        type: integer
 *                example:
 *                    email: "example@gmail.com"
 *                    username: "exampleUser"
 *                    password: "password"
 *      produces:
 *          -application/json
 *      responses:
 *          200:
 *              description: Returns created User
 *          400:
 *              description: User already exists
 *          422:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
userRouter.post("/", userValidator("POST /users"), userController.create);

/**
 * @swagger
 * /users/{userId}:
 *  delete:
 *      description: Deletes a specific User
 *      tags:
 *          - Users
 *      parameters:
 *           - in: path
 *             name: userId
 *             schema:
 *                 type: string
 *                 required: true
 *             description: ID of the User to delete
 *      produces:
 *          -application/json
 *      responses:
 *          200:
 *              description: User was successfully deleted
 *          422:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
userRouter.delete("/:userId", userValidator("DELETE /users/:userId"), userController.delete);

export { userRouter };
