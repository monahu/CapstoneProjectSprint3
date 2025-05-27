const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        user_name: {
            type: String,
            required: true,
            unique: true,
            maxlength: 20,
        },
        phone: { type: String, required: true, unique: true, maxlength: 20 },
        email: { type: String, required: true, unique: true, maxlength: 100 },
        password: { type: String, required: true, maxlength: 20 },
        first_name: { type: String, maxlength: 40 },
        last_name: { type: String, maxlength: 40 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
