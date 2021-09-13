import express from "express";
import ShopController from "../controllers/shops";
import { catchErrors } from "../middleware/errorHandlers";

const router = express.Router();
const { getAll, getShopById, update } = new ShopController();

router.get("/", catchErrors(getAll));
router.get("/:shopId", catchErrors(getShopById));
router.put("/:shopId", catchErrors(update));

module.exports = router;
