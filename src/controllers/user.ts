import { Request, Response } from "express";
import { userDBInteractions } from "../database/interactions/user";
import { User, IUserModel } from "../database/models/user";
import { IUser } from "../interfaces/IUser";
import { validationResult } from "express-validator/check";
import { errorMessage } from "../config/errorFormatter";
import { bcryptPassword } from "../config/bcrypt";
import { statusCodes } from "../config/statusCodes";
const userController = {

    index: async (req: Request, res: Response) => {
        try {
            const users = await userDBInteractions.all();
            res.status(statusCodes.SUCCESS).send(users);
        } catch (err) {
            res.status(statusCodes.SERVER_ERROR).send(err);
        }
    },

    show: async (req: Request, res: Response) => {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(errors.formatWith(errorMessage).array()[0]); return;
        }
        try {
            // Get User
            const username: string = req.params.username;
            const user: IUserModel = await userDBInteractions.findByUsername(username);
            // Not Found
            user ? res.status(statusCodes.SUCCESS).send(user) : res.status(statusCodes.NOT_FOUND).send({ status: statusCodes.NOT_FOUND, message: "User not found" });
        } catch (error) {
            res.status(statusCodes.SERVER_ERROR).send(error);
        }
    },

    create: async (req: Request, res: Response) => {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(errors.formatWith(errorMessage).array()[0]); return;
        }
        try {
            // Existing
            const foundUser: IUserModel = await userDBInteractions.findByEmail(req.body.email);
            const foundUserName: IUserModel = await userDBInteractions.findByUsername(req.body.username);
            if (foundUser || foundUserName) {
                res.status(statusCodes.BAD_REQUEST).send({ status: statusCodes.BAD_REQUEST, message: "User already exists" }); return;
            }
            // Create New
            const userData: IUser = {
                ...req.body,
                password: bcryptPassword.generateHash(req.body.password)
            };
            let newUser: IUserModel = await userDBInteractions.create(new User(userData));
            newUser = newUser.toJSON();
            delete newUser.password;
            res.status(statusCodes.SUCCESS).send(newUser);
        } catch (error) {
            res.status(statusCodes.SERVER_ERROR).send(error);
        }
    },

    delete: async (req: Request, res: Response) => {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(errors.formatWith(errorMessage).array()[0]); return;
        }
        try {
            // Does not exist
            const { userId } = req.params;
            const user: IUserModel = await userDBInteractions.find(userId);
            if (!user) {
                res.status(statusCodes.NOT_FOUND).send({ status: statusCodes.NOT_FOUND, message: "User not found" }); return;
            }
            // Delete
            await userDBInteractions.delete(userId);
            res.status(statusCodes.SUCCESS).send();
        } catch (error) {
            res.status(statusCodes.SERVER_ERROR).send(error);
        }
    }
};

export { userController };
