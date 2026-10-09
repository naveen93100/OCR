import jwt from 'jsonwebtoken'

export const isAuth = (req, res, next) => {
    try {

        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        if(decoded?.role!=='executive') return res.status(403).json({success:false,message:"Access denied.."});

        req.user = decoded;

        next();

    } catch (er) {
        console.log(er)
        return res.status(401).json({
            success: false,
            message: "Access token expired or invalid"
        });
    }
};