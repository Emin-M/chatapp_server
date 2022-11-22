const User = require("../model/user");
const {
    asyncCatch
} = require("../utils/asyncCatch");
const jwt = require("jsonwebtoken");
const GlobalError = require("../error/GlobalError");

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
    const {
        username,
        email,
        _id
    } = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    res.status(200).json({
        success: true,
        user: {
            username,
            email,
            _id
        },
    });
});

//! Login The User
exports.login = asyncCatch(async (req, res, next) => {
    //! 1) is email and password exist in request?
    const {
        email,
        password
    } = req.body;

    if (!email || !password) return next(new GlobalError("Please provide email and password", 404));

    //! 2) is person exist with this email?
    const user = await User.findOne({
        email
    });

    //! 3) is password correct?
    const pw = user && await user.checkPassword(password);

    if (!user || !pw) return next(new GlobalError("Please check email and password", 403));

    //! 4) sign token
    const token = signJWT(user._id);

    res.json({
        success: true,
        token
    });
});