import express from "express";

import userRoutes from "./users";
import authRoutes from "./auth";
import raceRoutes from "./race";
import carRoutes from "./cars";
import landRoutes from "./lands";
import stationRoutes from "./station";
import shopRoutes from "./shops";
import mediaRoutes from "./media";
import marketplaces from "./marketplace";
import settings from "./setting";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/race", raceRoutes);
router.use("/cars", carRoutes);
router.use("/station", stationRoutes);
router.use("/lands", landRoutes);
router.use("/shops", shopRoutes);
router.use("/file", mediaRoutes);
router.use("/marketplace", marketplaces);
router.use("/setting", settings);

router.use("/", (req, res) => {
  res.send("Riotraces API");
});

module.exports = router;
