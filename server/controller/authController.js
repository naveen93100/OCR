import User from "../models/userModel.js";
import {
    generateRefreshToken,
    generateAccessToken,
} from "../utils/tokenGenerate.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

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
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                // maxAge: 1 * 60 * 1000,
            })
            .cookie("accessToken", access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
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
            secure: process.env.NODE_ENV === "production",
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


export const refreshToken = async (req, res) => {
    try {

        let token = req.cookies.refreshToken;

        if (!token) return res.status(401).json({ success: false, message: "Invalid or expire token! Please Login again.." });

        let verifyToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        if (!verifyToken) return res.status(401).json({ success: false, message: 'Invalid or expire token! Please Login again..' });

        let user = await User.findOne({ userId: verifyToken?.userId });

        if (!user) return res.status(401).json({ success: false, message: "Something went wrong! please try again later.." })

        let newAccessToken = generateAccessToken(user);


        return res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
             secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        })
            .status(200)
            .json({
                success: true,
                newAccessToken,
                user: {
                    _id: user._id,
                    name: user?.name,
                    userId: user?.userId,
                    role: user?.role,
                },
            });

    } catch (er) {

        if (er.name === 'TokenExpiredError' || er.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Token expired! Please login again.." });
        }

        return res.status(500).json({ success: false, message: er?.message });
    }
}