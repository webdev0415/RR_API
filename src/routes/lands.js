import express from "express";
import LandController from "../controllers/lands";
import { catchErrors } from "../middleware/errorHandlers";

const router = express.Router();
const { getAll, getLandById, update } = new LandController();

router.get("/", catchErrors(getAll));
router.get("/:landId", catchErrors(getLandById));
router.put("/:landId", catchErrors(update));

module.exports = router;
