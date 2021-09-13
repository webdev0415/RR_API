import express from "express";
import RaceController from "../controllers/race";
import validate from "../middleware/validate";

const { winners } = new RaceController();

const router = express.Router();

router.post("/winners", validate("winners"), winners);

export default router;
