import { CronJob } from "cron";
import {
  checkCarOwners,
  checkStationOwners,
  checkRacetrackLandOwners,
  checkMechanicShopOwners,
  checkEthTransactions,
} from "./ploygon";

require("dotenv").config();

const { REFRESH_TIME = "*/20 * * * * *", ETH_REFRESH_TIME = "*/60 * * * * *" } = process.env;

export const cronJobInit = () => {
  const job1 = new CronJob(
    REFRESH_TIME,
    () => {
      checkCarOwners();
      checkStationOwners();
      checkRacetrackLandOwners();
      checkMechanicShopOwners();
      console.log("fetching assets owners");
    },
    null,
    true,
    "America/Los_Angeles",
  );

  const job2 = new CronJob(
    ETH_REFRESH_TIME,
    () => {
      checkEthTransactions();
      console.log("fetching eth transactions");
    },
    null,
    true,
    "America/Los_Angeles",
  );

  job1.start();
  job2.start();
};
