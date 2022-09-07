import { Document, LeanDocument, model, Schema } from "mongoose";

export interface User extends Document {
    email?: string,
    password?: string,
    status?: 'active' | 'banned',
    created_at?: Date,
    updated_at?: Date
}

let schema = new Schema<User>({
    email: {
        type: String,
        index: true,
        required: true
    },
    password: String,
    status: {
        type: String,
        enum: ['active', 'banned'],
        required: true,
        default: 'active'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, { collection: 'users' });

export default model('User', schema);