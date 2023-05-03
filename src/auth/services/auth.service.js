import User from '../schemas/auth.schema.js';
import {getToken} from '../../utility/utils.js';

export const loginService = async (req) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            throw new Error('Something wrong with your email and password');
        }

        const user = await User.findOne({email});
        if (!user) {
            throw new Error('User does not exist');
        }

        if (password !== user.password) {
            throw new Error('Something wrong with your email and password');
        }

        const token = getToken(email);
        await User.findByIdAndUpdate(user._id, {token}, {new: true});
        return {token, email};
    } catch (error) {
        throw new Error('User login failed');
    }
};

export const registerService = async (req) => {
    try {
        const {
            email, password, name,
            publicKey,
            secret
        } = req.body;

        if (!email || !password || !name) {
            throw new Error('Invalid fields');
        }

        const user = await User.findOne({email});
        if (user) {
            throw new Error('User Exist');
        }

        await User.create({
            email,
            password,
            name,
            publicKey,
            secret
        });
    } catch (error) {
        throw new Error('User creation failed');
    }
};
