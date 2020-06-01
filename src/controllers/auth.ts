import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { errorMessage } from "../config/errorFormatter";
import { userDBInteractions } from "../database/interactions/user";
import { IUserModel } from "../database/models/user";
import { bcryptPassword } from "../config/bcrypt";
import { statusCodes } from "../config/statusCodes";

const authController = {

    login: async (req: Request, res: Response) => {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(errors.formatWith(errorMessage).array()[0]); return;
        }
        // Business Logic
        try {
            const { email, password } = req.body;
            const user: IUserModel = await userDBInteractions.findByEmail(email, "+password");
            // Does not exist
            if (!user) {
                res.status(statusCodes.BAD_REQUEST).send({ status: statusCodes.BAD_REQUEST, message: "Invalid email or password" }); return;
            }
            // Incorrect password hash
            if (!bcryptPassword.validate(password, user.password)) {
                res.status(statusCodes.BAD_REQUEST).send({ status: statusCodes.BAD_REQUEST, message: "Invalid email or password" }); return;
            }
            // Correct password hash
            // Could attach claims / roles here
            const token = jwt.sign({id: user.id, email: user.email}, process.env.SECRET);
            const userJSON = user.toJSON();
            delete userJSON.password;
            // Return JWT and User
            res.status(statusCodes.SUCCESS).send({token: token, user: userJSON});
        } catch (error) {
            res.status(statusCodes.SERVER_ERROR).send(error);
        }
    },

    introspect: async (req: Request, res: Response) => {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(errors.formatWith(errorMessage).array()[0]); return
        }
        try {
            const { token } = req.query;
            const payload = jwt.verify(token, process.env.SECRET);
            res.status(statusCodes.SUCCESS).send({ active: true, user: payload });
        } catch (error) {
            res.status(statusCodes.UNAUTHORIZED).send({ status: statusCodes.UNAUTHORIZED, message: "Unauthorized", active: false });
        }
    }
};

export { authController };