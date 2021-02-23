import { model, Schema } from "mongoose";

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
});

let userModel = model('user', userSchema);

export default userModel;