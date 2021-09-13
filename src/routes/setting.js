import express from "express";
import SettingsController from "../controllers/setting";
import { catchErrors } from "../middleware/errorHandlers";

const {
  getSettings,
  getSettingByName,
} = new SettingsController();

const router = express.Router();

router.get("/", catchErrors(getSettings));
router.get("/:name", catchErrors(getSettingByName));

export default router;
