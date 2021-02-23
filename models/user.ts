import { Document, model, Schema } from "mongoose";

export interface User extends Document {
    email?: string,
    password?: string,
    userAuthTokens?: string[],
    created_at?: Date,
    updated_at?: Date,
    hasToken: (token: string) => Promise<number>
}

let schema = new Schema({
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

schema.methods.hasToken = function(token: string): Promise<number> {
    return model('User').count({_id: this._id, userAuthTokens: token}).exec();
}

export default model('User', schema);