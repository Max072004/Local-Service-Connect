import dotenv from 'dotenv';
dotenv.config({ path: "backend/.env" });
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabse from "./config/database.js";
import errorHandlerMiddleware from "./middlewares/error.js";
import userRouter from "./Routes/userRoute.js";
import workerRouter from "./Routes/workerRoute.js"


const app = express();
const corsOptions = {
    origin: true,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/users', userRouter)
app.use('/api/v1/worker', workerRouter)

app.use(express.static("public"));
connectToDatabse();

app.use(errorHandlerMiddleware);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
