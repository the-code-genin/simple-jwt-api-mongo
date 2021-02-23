import { Document, model, Schema } from "mongoose";

export interface User extends Document {
    email?: string,
    password?: string,
    userAuthTokens?: string[],
    created_at?: Date,
    updated_at?: Date,
    hasToken: (token: string) => Promise<number>,
    toPlainJSON: () => Omit<User, 'password'|'userAuthTokens'>
}

let schema = new Schema<User>({
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

schema.methods.toPlainJSON = function() {
    return {
        email: this.email,
        created_at: this.created_at,
        updated_at: this.updated_at
    }
}

export default model('User', schema);