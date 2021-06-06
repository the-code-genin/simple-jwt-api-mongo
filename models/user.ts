import { Document, LeanDocument, model, Schema } from "mongoose";


// Default user interface
export interface User extends Document {
    email?: string,
    password?: string,
    status?: 'active'|'banned',
    created_at?: Date,
    updated_at?: Date,
    hasToken: (token: string) => Promise<number>
}


// Schema
let schema = new Schema<User>({
    email: {
        type: String,
        index: true
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
}, {collection: 'users'});


// Methods
schema.methods.hasToken = async function(token: string): Promise<boolean> {
    return await model('AuthToken').countDocuments({user_id: this._id, token}).exec() != 0;
}

schema.methods.toJSON = function(): LeanDocument<User> {
    let output = Object.assign({id: this._id}, this);
    delete output.password;
    return output;
}

export default model('User', schema);