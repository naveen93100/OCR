import User from "../models/userModel.js";
import {
    generateRefreshToken,
    generateAccessToken,
} from "../utils/tokenGenerate.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
    try {
        let { userId, password } = req.body;

        if (!userId || !password)
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid userId and password..",
                });

        let user = await User.findOne({
            userId,
        });

        if (!user)
            return res
                .status(400)
                .json({ success: false, message: "User not found.." });

        let match = await bcrypt.compare(password, user.password);

        if (!match)
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid userId and password..",
                });

        let refresh_token = generateRefreshToken(user);
        let access_token = generateAccessToken(user);

        return res
            .cookie("refreshToken", refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .cookie("accessToken", access_token, {
                httpOnly: true,
                secure: false,
                sameStime: "strict",
                maxAge: 15 * 60 * 1000,
            })
            .status(200)
            .json({
                success: true,
                access_token,
                user: {
                    _id: user._id,
                    name: user?.name,
                    userId: user?.userId,
                    role: user?.role,
                },
            });
    } catch (er) {
        console.log(er);
        return res.status(500).json({ success: false, message: er?.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        return res
            .status(200)
            .json({ success: true, message: "Logout successfully" });
    } catch (er) {
        return res.status(500).json({
            success: false,
            message: er?.message,
        });
    }
};
