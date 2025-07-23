import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String },
    role: {
        type: String,
        enum: ["customer", "worker","admin"],
        required: true
    },
    profilePic: {
        public_id: { type: String, default: "default_profile" },
        url: { type: String, default: "https://res.cloudinary.com/demo/image/upload/default-profile.png" }
    },
    // Worker-specific fields (only required if role = "worker")
    serviceType: { type: [String], default: [] }, // e.g., plumber, electrician
    experience: { type: Number },
    availability: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    free_Count: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


userSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.ACCESS_SECRET_KEY, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
};


userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
