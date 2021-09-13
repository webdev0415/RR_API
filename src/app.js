import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import "config/passport";
import routes from "routes/index";
import { cronJobInit } from "./services/cron";
import corsMiddleware from "./middleware/cors";
import { errorHandler } from "./middleware/errorHandlers";

const logger = morgan("dev");
const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 100 requests per windowMs
});

app.use(corsMiddleware);
app.use(limiter);
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api", routes);

// catch 404 and forward to error utils
app.use((req, res, next) => {
  next(createError(404));
});

cronJobInit();

app.use(errorHandler);

module.exports = app;
