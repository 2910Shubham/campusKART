import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();

const isLoggedin = async function(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        req.flash("logError", "You need to login first");
        return res.redirect("/");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel
            .findOne({ email: decoded.email })
            .select("-password");

        if (!user) {
            req.flash("logError", "User not found");
            return res.redirect("/");
        }

        req.user = user;
        next(); 
    } catch (err) {
        console.error("JWT verification failed:", err);
        req.flash("error", "Something went wrong here");
        res.redirect("/");
    }
};

export default isLoggedin;
