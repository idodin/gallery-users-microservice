import { IUser } from "../../interfaces/IUser";
import { User, IUserModel } from "../models/user";

export const userDBInteractions = {

    create: (user: IUser): Promise<IUserModel> => {
        return User.create(user);
    },

    all: (): Promise<IUserModel[]> => {
        return User.find().select("-images -password").exec();
    },

    find: (userId: string, option: string = "-password"): Promise<IUserModel> => {
        return User.findOne({ _id: userId }).select(`-images ${option}`).exec();
    },

    findByEmail: (email: string, option: string = "-password"): Promise<IUserModel> => {
        return User.findOne({ email: email }).select(`-images ${option}`).exec();
    },

    findByUsername: (username: string, option: string = "-password"): Promise<IUserModel> => {
        return User.findOne({username: username}).select(`-images ${option}`).exec();
    },

    delete: (userId: string): Promise<IUserModel> => {
        return User.findByIdAndDelete(userId).exec();
    },
};