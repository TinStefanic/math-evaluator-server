import express from "express";
import dotenv from "dotenv";
import apiRouter from "./routes/api";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT ?? "40_004");

app.use("/api", apiRouter);

app.listen(port);