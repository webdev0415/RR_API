import express from "express";
import StationController from "../controllers/station";
import { catchErrors } from "../middleware/errorHandlers";
import { authenticate } from "../middleware/auth";
import validate from "../middleware/validate";

const router = express.Router();
const {
  getAll, getStationsByAddress, getStationById, update,
} = new StationController();

router.get("/", catchErrors(getAll));
router.get("/address/:ethAddress", validate("ethAddress", "params"), authenticate, catchErrors(getStationsByAddress));
router.get("/:stationId", catchErrors(getStationById));
router.put("/:stationId", catchErrors(update));

module.exports = router;
