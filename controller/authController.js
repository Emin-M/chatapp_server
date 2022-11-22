const User = require("../model/user");
const {
    asyncCatch
} = require("../utils/asyncCatch");
const jwt = require("jsonwebtoken");
const GlobalError = require("../error/GlobalError");
const Email = require("../utils/email");
const crypto = require("crypto");

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

    //!Send Email
    const url = `${req.protocol}://${req.get("host")}`;
    const emailHandler = new Email(user, url);
    await emailHandler.sendWelcome();

    res.status(200).json({
        success: true,
        user,
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

//! Sending Email When Forget Password
exports.forgetPassword = asyncCatch(async (req, res, next) => {
    const {
        email
    } = req.body;

    if (!email) return next(new GlobalError("Please provide email!", 404));

    //! checking if user exist with given email
    const user = await User.findOne({
        email
    });

    if (!user) return next(new GlobalError("User with this email does not exist!", 404));

    //! creating resetToken and adding to the user data
    const resetToken = await user.hashResetPassword();
    await user.save({
        validateBeforeSave: false
    });

    //! sending email
    const urlString = `${req.protocol}://${req.get("host")}/${resetToken}`;
    const emailHandler = new Email(user, urlString);
    await emailHandler.sendResetPassword();

    res.status(200).json({
        success: true,
        message: "Email sent!",
    });
});

//! Changing Password Based On Email That Has Been Sent
exports.resetPassword = asyncCatch(async (req, res, next) => {
    const token = req.params.token;
    const {
        password
    } = req.body;

    //! hassing token for checking
    const hashedToken = crypto
        .createHash("md5")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetToken: hashedToken,
        tokenValidationTime: {
            $gt: new Date()
        },
    });

    //! checking if user exist and token is match
    if (!user) return next(new GlobalError("Token wrong or expired!"));

    //! updating user
    user.password = password;
    user.resetToken = undefined;
    user.tokenValidationTime = undefined;
    await user.save();

    res.json({
        success: true,
        message: "Password updated"
    });
});