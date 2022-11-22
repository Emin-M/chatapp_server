const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide an username"]
    },

    email: {
        type: String,
        required: [true, "Please provide an email!"],
        unique: true,
        validate: validator.isEmail,
    },

    password: {
        type: String,
        required: [true, "Please provide a password!"],
    },

    photo: String,

    imgId: String, //! deleting image from cloudinary when deleting user

    resetToken: String,

    tokenValidationTime: Date
});

//! hasing password before saving user to the db
userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

//! checking if password correct
userSchema.methods.checkPassword = async function (currentPassword) {
    return await bcrypt.compare(currentPassword, this.password);
};

//! hashing before sending
userSchema.methods.hashResetPassword = async function () {
    const resetPassword = crypto.randomBytes(12).toString("hex");

    const hashedPassword = crypto
        .createHash("md5")
        .update(resetPassword)
        .digest("hex");

    this.resetToken = hashedPassword;
    this.tokenValidationTime = Date.now() + 15 * 60 * 1000;

    return resetPassword;
};

const User = mongoose.model("user", userSchema);
module.exports = User;