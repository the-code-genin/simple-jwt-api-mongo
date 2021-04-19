import { Document, LeanDocument, model, Schema } from "mongoose";


// Default user interface
export interface User extends Document {
    email?: string,
    password?: string,
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
    return {
        id: this._id,
        email: this.email,
        created_at: this.created_at,
        updated_at: this.updated_at
    }
}


export default model('User', schema);