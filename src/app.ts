import cors from "cors";
import express, { Application } from "express";
import "express-async-errors";
import { errorHandler } from "./error";
import * as routers from "./routers";

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use("/clients", routers.clientRouters);
app.use("/login", routers.loginRouters);
app.use("/contacts", routers.contactRouters);

app.use(errorHandler);

export default app;
