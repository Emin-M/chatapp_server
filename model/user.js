const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
});

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model("user", userSchema);
module.exports = User;