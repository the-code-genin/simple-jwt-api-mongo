import { Document, LeanDocument, model, Schema } from "mongoose";

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
}, {collection: 'auth_tokens'});

schema.methods.toJSON = function(): LeanDocument<AuthToken> {
    let output = Object.assign({id: this._id}, this);
    delete output._id;
    return output;
}

export default model('AuthToken', schema);