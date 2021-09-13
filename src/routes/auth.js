import express from "express";
import AuthController from "controllers/auth";
import { catchErrors } from "../middleware/errorHandlers";
import validate from "../middleware/validate";

const { create } = new AuthController();

const router = express.Router();

router.post("/", validate("auth"), catchErrors(create));

module.exports = router;
