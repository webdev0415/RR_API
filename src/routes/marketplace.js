import express from "express";
import MarketplaceController from "../controllers/marketplace";
import validate from "../middleware/validate";
import { validateLimitCart, validateDropLimit } from "../middleware/limit";
import { catchErrors } from "../middleware/errorHandlers";
import { authenticate, validateWebhook } from "../middleware/auth";

const {
  buyById, getCarsOnCart, removeCart, prePayItem, handleWebhook,
} = new MarketplaceController();

const router = express.Router();

router.post("/buy/:id", authenticate, validate("marketplaceBuy"), validateLimitCart, validateDropLimit, catchErrors(buyById));

router.get("/cart", authenticate, catchErrors(getCarsOnCart));
router.delete("/cart/:id", authenticate, validate("removeCart"), catchErrors(removeCart));

router.post("/prePay/:id", authenticate, validate("marketplacePrePay"), catchErrors(prePayItem));

router.post("/alchemy/webhook", validateWebhook, catchErrors(handleWebhook));

export default router;
