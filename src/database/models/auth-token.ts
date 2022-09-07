import { Document, model, Schema } from "mongoose";

export interface AuthToken extends Document {
    token?: string,
    user_id?: string,
    created_at?: Date,
    updated_at?: Date
}

let schema = new Schema<AuthToken>({
    token: {
        type: String,
        index: true,
        required: true
    },
    user_id: {
        type: String,
        index: true,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, { collection: 'auth_tokens' });

export default model('AuthToken', schema);