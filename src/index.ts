import express from "express";
import apiRouter from "./routes/api";
import cors from "cors";

const app = express();

app.use(cors());
app.use("/api", apiRouter);

export default app;