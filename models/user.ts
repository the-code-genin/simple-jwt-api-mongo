import { Document, model, Schema } from "mongoose";

export interface User extends Document {
    email?: string,
    password?: string,
    userAuthTokens?: string[],
    created_at?: Date,
    updated_at?: Date
}

let userSchema = new Schema({
    email: {
        type: String,
        index: true
    },
    password: String,
    userAuthTokens: [String],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {collection: 'users'});

export default model('user', userSchema);