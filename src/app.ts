import "express-async-errors";
import express, { Application } from "express";
import { errorHandler } from "./error";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(errorHandler);

export default app;
