import User from "../models/userModel.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import { ApiError } from "../utils/ApiError.js";

const getWorkersByCategory = catchAsyncError(async (req, res, next) => {
    const { category } = req.params;
    console.log("in get category",category)

    if (!category) {
        return res.status(400).json({ success: false, message: "Category is required" });
    }

    const workers = await User.find({ role: "worker", serviceType: { $in: [category] } });

    if (workers.length === 0) {
        return res.status(404).json({ success: false, message: `No workers found for category: ${category}` });
    }
console.log("workers",workers)
    res.status(200).json({ success: true, workers });
});

const getWorkerById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const worker = await User.findOne({ _id: id, role: "worker" });

    if (!worker) {
        return res.status(404).json({ success: false, message: "Worker not found" });
    }
    if (req.user.free_Count >= 3) {
        return next(new ApiError(403, "You have exceede the free access limit"));
    }
    await User.findByIdAndUpdate(req.user._id, { $inc: { free_Count: 1 } });
    res.status(200).json({ success: true, worker });
});


const getAllWorker = catchAsyncError(async (req, res, next) => {

    const worker = await User.find({ role: "worker" });
    console.log("in get all")

    if (!worker) {
        return res.status(404).json({ success: false, message: "Worker not found" });
    }
    res.status(200).json({ success: true, worker });
});
export { getWorkersByCategory, getWorkerById, getAllWorker }