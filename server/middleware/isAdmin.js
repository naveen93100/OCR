import jwt from 'jsonwebtoken';


export const isAdmin = (req, res, next) => {
    try {

        let token = req.cookies?.accessToken;

        if (!token) return res.status(400).json({ success: false, message: "Invalid or missing.." });

        const validToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


        if (validToken && validToken.role !== 'super_admin') return res.status(403).json({ success: false, message: "Access Denied.." });

        next();



    } catch (er) {
        if (er.name === 'TokenExpiredError' || er.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Token expired! Please login again.." });
        }

        return res.status(403).json({ success: false, message: er?.message });
    }
}