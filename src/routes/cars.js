import express from "express";
import CarsController from "../controllers/cars";
import validate from "../middleware/validate";
import { catchErrors } from "../middleware/errorHandlers";
import { authenticate } from "../middleware/auth";

const router = express.Router();
const {
  getAll, getCarById, getUserCars, getSelectedCar, update, checkCarName,
} = new CarsController();

router.get("/all", catchErrors(getAll));
router.get("/c/:carId", validate("byCar", "params"), catchErrors(getCarById));
router.get("/u", authenticate, catchErrors(getUserCars));
router.get("/u/:userId", validate("byUser", "params"), authenticate, catchErrors(getSelectedCar));
router.put("/c/:carId", validate("byCar", "params"), authenticate, catchErrors(update));
router.get("/checkname/:name", catchErrors(checkCarName));

module.exports = router;
