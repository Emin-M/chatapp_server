const User = require("../model/user");
const {
    asyncCatch
} = require("../utils/asyncCatch");
const jwt = require("jsonwebtoken");

//! Creating JWT Token For User
const signJWT = (id) => {
    const token = jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    return token;
};

//! Registering The User
exports.signup = asyncCatch(async (req, res, next) => {
    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    res.status(200).json({
        success: true,
        user,
    });
});