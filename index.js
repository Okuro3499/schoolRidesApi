import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import childrenRouter from "./routes/children-routes.js";
// import clientsRouter from "./routes/clients-routes.js";
import authRouter from "./routes/auth-routes.js";
// import partnerRouter from "./routes/partner_routes.js";
// import staffRouter from "./routes/staff_routes.js";
import rolesRouter from "./routes/roles-routes.js";
import vehicleRouter from "./routes/vehicle-routes";
import ownerRouter from "./routes/vehicle_owner_routes";
import bodyParser from "body-parser";

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const corsOptions = { credentials: true, origin: process.env.URL || "*" };

app.use(cors(corsOptions));
app.use(json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(carsRouter);
app.use(childrenRouter);
app.use(authRouter);
app.use(vehicleRouter);
app.use(ownerRouter);
app.use(rolesRouter);

//port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server up and listening on port ${port}!`);
});
