import express from "express";
import UserController from "../controllers/users";
import { catchErrors } from "../middleware/errorHandlers";
import { authenticate } from "../middleware/auth";
import validate from "../middleware/validate";

const {
  find,
  create,
  checkUserName,
  update,
  getGasBalance,
  addGasBalance,
  spendGas,
  selectCar,
  getActivities,
  authenticateUser,
  renewToken,
} = new UserController();

const router = express.Router();

router.get("/", catchErrors(find));

router.post("/", validate("userCreate"), catchErrors(create));

router.get("/username/:username", catchErrors(checkUserName));

router.put("/:id", validate("id", "params"), authenticate, catchErrors(update));

router.get("/authenticate", authenticate, catchErrors(authenticateUser));

router.post("/select-car", validate("selectCar"), authenticate, catchErrors(selectCar));

router.get("/:id/gas-balance", validate("id", "params"), authenticate, catchErrors(getGasBalance));

router.post("/gas-balance", validate("addGasBalance"), authenticate, catchErrors(addGasBalance));

router.post("/spend-gas", validate("spendGas"), authenticate, catchErrors(spendGas));

router.get("/activities", authenticate, catchErrors(getActivities));

router.get("/renew-token", authenticate, catchErrors(renewToken));

module.exports = router;
