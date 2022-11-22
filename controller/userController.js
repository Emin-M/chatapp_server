const User = require("../model/user");
const {
    asyncCatch
} = require("../utils/asyncCatch");
const GlobalError = require("../error/GlobalError");

//! Changing Password When User Signed In
exports.changePassword = asyncCatch(async (req, res, next) => {
    //! checking req.body
    const {
        currentPassword,
        newPassword
    } = req.body;
    if (!currentPassword || !newPassword) return next(new GlobalError("Please provide password!"));

    //! checking if currrentPassword is correct
    const user = await User.findById(req.user._id);
    const isCurrentPasswordCorrect = await user.checkPassword(currentPassword);
    if (!isCurrentPasswordCorrect) return next(new GlobalError("Incorrect Password!", 403));

    //! saving user
    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated",
    });
});

//! Changing User Data When User Signed In
exports.updateUser = asyncCatch(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        username: req.body.username,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        user
    });
});