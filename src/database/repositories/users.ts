import UserModel, { User } from "../models/user";
import AuthTokenModel from "../models/auth-token";

export default class Users {
    static emailTaken(email: string) {
        return new Promise<boolean>((resolve, reject) => {
            UserModel.countDocuments({ email }, (err, count) => {
                if (err != null) reject(err);
                else resolve(count != 0);
            });
        });
    }

    static getUserByEmail(email: string) {
        return new Promise<User | null>((resolve, reject) => {
            UserModel.findOne({ email }, null, null, (err, user) => {
                if (err != null) reject(err);
                else resolve(user);
            });
        });
    }

    static getUserByID(_id: string) {
        return new Promise<User | null>((resolve, reject) => {
            UserModel.findOne({ _id }, null, null, (err, user) => {
                if (err != null) reject(err);
                else resolve(user);
            });
        });
    }

    static checkUserHasAuthToken(userId: string, token: string) {
        return new Promise<boolean>((resolve, reject) => {
            AuthTokenModel.countDocuments({ user_id: userId, token }, (err, count) => {
                if (err != null) reject(err);
                else resolve(count != 0);
            });
        });
    }

    static addUserAuthToken(userId: string, token: string) {
        return new Promise<null>((resolve, reject) => {
            AuthTokenModel.create({ user_id: userId, token }, (err) => {
                if (err != null) reject(err);
                else resolve(null);
            });
        });
    }

    static insert(user: Partial<User>) {
        return new Promise<User>((resolve, reject) => {
            UserModel.create(user, (err, doc) => {
                if (err != null) reject(err);
                else resolve(doc);
            });
        });
    }

    static updateById(userId: string, user: Partial<User>) {
        return new Promise<null>((resolve, reject) => {
            UserModel.updateOne({ _id: userId }, user, null, (err) => {
                if (err != null) reject(err);
                else resolve(null);
            });
        });
    }

    static toJSON(user: User) {
        const output = Object.assign(user.toObject(), {
            id: user._id,
        });
        delete output._id;
        delete output.__v;
        delete output.password;
        return output;
    }
}
