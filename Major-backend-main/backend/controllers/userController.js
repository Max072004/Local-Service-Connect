import User from "../models/userModel.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import cloudinary from "cloudinary";
import bcrypt from "bcryptjs";

const registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, phone, role } = req.body;

    // Validate required fields based on role
    if (!name || !phone || !password || !role) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
        return res.status(400).json({ success: false, message: "User with this email or phone already exists" });
    }
    // Hash password before storing
    // const hashedPassword = await bcrypt.hash(password, 10);

    let profilePic = {
        public_id: "default_profile",
        url: "https://res.cloudinary.com/demo/image/upload/v1600000000/default-profile.png"
    };

    if (req.file?.path) {
        const uploadedImage = await uploadOnCloudinary(req.file.path, "profile_pictures");
        console.log("this is uploaded image ", uploadedImage)
        profilePic = {
            public_id: uploadedImage.public_id,
            url: uploadedImage.secure_url
        };
    }

    const userData = {
        name,
        email,
        password,
        phone,
        role,
        profilePic
    };

    if (role === "worker") {
        const { location, serviceType, experience } = req.body;

        if (!location || !serviceType || !experience) {
            return res.status(400).json({ success: false, message: "Missing worker-specific fields" });
        }

        userData.location = location;
        userData.serviceType = serviceType;
        userData.experience = experience;
        userData.availability = true; // Default availability
        userData.rating = 0; // Default rating
    }

    const user = await User.create(userData);

    const accessToken = await user.getJWTToken();
    const userWithoutPassword = await User.findById(user._id).select('-password');

    return res
        .status(201)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({ success: true, message: "User registered successfully", user: userWithoutPassword });
});

const   loginUser = catchAsyncError(async (req, res, next) => {
    console.log(req.body)
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ApiError(400, "Please Enter Email & Password"));
    }
    const user = await User.findOne({ email }).select("+password");
    console.log("after user")
    if (!user) {
        return next(new ApiError(401, "Invalid email or password"));
    }
    const isPasswordMatched = await user.comparePassword(password);
    console.log("after password match", isPasswordMatched)
    if (!isPasswordMatched) {
        return next(new ApiError(401, "Invalid email or password"));
    }
    const accessToken = await user.getJWTToken();
    const userWithoutPassword = await User.findById(user._id).select('-password');
    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({ success: true, message: "user Loggedin successfully", user: userWithoutPassword });
});
const logoutUser = catchAsyncError(async (req, res, next) => {
    return res
        .status(200)
        .clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
        })
        .json({ success: true, message: "user Logged out successfully" });
});
const getCurrentUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
});

const updateProfile = catchAsyncError(async (req, res, next) => {
    const { email, name } = req.body;

    const newUserData = { email, name };

    if (req.file) {
        const user = await User.findById(req.user._id);
        if (user.profilePic?.public_id) {
            await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
        }

        const myCloudImage = await uploadOnCloudinary(req.file.path, "profile_pictures");
        newUserData.profilePic = {
            public_id: myCloudImage.public_id,
            url: myCloudImage.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: newUserData },
        { new: true, runValidators: true, useFindAndModify: false }
    ).select("-password");

    res.status(200).json({ success: true, user, message: "User profile updated successfully" });
});

const getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

const getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(
            new ApiError(500, `User does not exist with Id ${req.params.id}`)
        );
    }

    res.status(200).json({
        success: true,
        user,
    });
});

const deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ApiError(500, "User does not exist to id"));
    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted successfully" });
});

const demo = async (req, res, next) => {
    try {
        console.log("inside the demo controller", req.file);
        const avatarLocalPath = req.file?.path;
        let avatar;
        if (avatarLocalPath)
            avatar = await uploadOnCloudinary(avatarLocalPath, "avatar");
    } catch (error) {
        console.log(error);
    }
};
export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateProfile,
    getAllUsers,
    getSingleUser,
    deleteUser,
    demo,
};
