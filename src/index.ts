import express from "express";
import apiRouter from "./routes/api";
import { config } from './configuration/config';

const app = express();

app.use("/api", apiRouter);

app.listen(config.port);