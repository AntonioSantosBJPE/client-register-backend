import cors from "cors";
import express, { Application } from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./error";
import * as routers from "./routers";
import swaggerDocs from "./swagger.json";

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use("/api-docs/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/clients", routers.clientRouters);
app.use("/login", routers.loginRouters);
app.use("/contacts", routers.contactRouters);

app.use(errorHandler);

export default app;
