import { Router } from "express";
import isAuthenticatedUser from "../middlewares/auth.js";
import { getAllWorker, getWorkerById, getWorkersByCategory } from "../controllers/workerController.js";

const router = Router();
router.route('/getcategory/:category').get(getWorkersByCategory);
router.route('/getbyid/:id').get(isAuthenticatedUser,getWorkerById);
router.route('/getall').get(getAllWorker);
export default router;
