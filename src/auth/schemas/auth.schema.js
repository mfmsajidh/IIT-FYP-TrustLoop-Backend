import {Schema,model} from "mongoose";

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    token: { type: String, required: false }
});

const User = model('User', userSchema);

export default User
