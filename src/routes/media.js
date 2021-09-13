import express from "express";
import MediaController from "../controllers/media";
import uploader from "../middleware/s3";
import validate from "../middleware/validate";
import { catchErrors } from "../middleware/errorHandlers";

const { create, remove } = new MediaController();

const router = express.Router();

router.post("/", uploader, catchErrors(create));

router.delete("/", validate("removeFile"), catchErrors(remove));

export default router;
