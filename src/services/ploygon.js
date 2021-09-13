import { uniqBy } from "lodash";
import request from "../utils/request";
import CarsController from "../controllers/cars";
import StationController from "../controllers/station";
import LandController from "../controllers/lands";
import ShopController from "../controllers/shops";
import MarketplaceController from "../controllers/marketplace";

require("dotenv").config();

const { ownerUpdate: carOwnerUpdates } = new CarsController();
const { ownerUpdate: stationOwnerUpdates } = new StationController();
const { ownerUpdate: landsOwnerUpdates } = new LandController();
const { ownerUpdate: shopOwnerUpdates } = new ShopController();
const { transactionStatusUpdate } = new MarketplaceController();

const {
  BASE_PLOYGON_URL,
  BASE_ETHER_SCAN_URL,
  OWNER_ETH_ADDRESS,
  CARS_CONTRACT_ADDRESS,
  STATION_CONTRACT_ADDRESS,
  RACE_TRACK_LAND_ADDRESS,
  MECHAIC_SHOP_ADDRESS,
} = process.env;

export const checkCarOwners = () => {
  request
    .get(`${BASE_PLOYGON_URL}api?module=account&action=tokennfttx&contractaddress=${CARS_CONTRACT_ADDRESS}&sort=desc`)
    .then(({ result, status }) => {
      if (!status) return null;
      const transactions = uniqBy(result, ({ tokenID }) => tokenID);
      const owners = transactions.map(({ tokenID, to }) => ({
        id: tokenID,
        ethAddress: to,
      }));
      carOwnerUpdates(owners);
    });
};

export const checkStationOwners = () => {
  request
    .get(
      `${BASE_PLOYGON_URL}api?module=account&action=tokennfttx&contractaddress=${STATION_CONTRACT_ADDRESS}&sort=desc`,
    )
    .then(({ result, status }) => {
      if (!status) return null;
      const transactions = uniqBy(result, ({ tokenID }) => tokenID);
      const owners = transactions.map(({ tokenID, to }) => ({
        id: tokenID,
        ethAddress: to,
      }));
      stationOwnerUpdates(owners);
    });
};

export const checkRacetrackLandOwners = () => {
  if (!RACE_TRACK_LAND_ADDRESS || RACE_TRACK_LAND_ADDRESS === undefined) {
    return;
  }

  request
    .get(`${BASE_PLOYGON_URL}api?module=account&action=tokennfttx&contractaddress=${RACE_TRACK_LAND_ADDRESS}&sort=desc`)
    .then(({ result, status }) => {
      if (!status) return null;
      const transactions = uniqBy(result, ({ tokenID }) => tokenID);
      const owners = transactions.map(({ tokenID, to }) => ({
        id: tokenID,
        ethAddress: to,
      }));
      landsOwnerUpdates(owners);
    });
};

export const checkMechanicShopOwners = () => {
  if (!MECHAIC_SHOP_ADDRESS || MECHAIC_SHOP_ADDRESS === undefined) {
    return;
  }

  request
    .get(`${BASE_PLOYGON_URL}api?module=account&action=tokennfttx&contractaddress=${MECHAIC_SHOP_ADDRESS}&sort=desc`)
    .then(({ result, status }) => {
      if (!status) return null;
      const transactions = uniqBy(result, ({ tokenID }) => tokenID);
      const owners = transactions.map(({ tokenID, to }) => ({
        id: tokenID,
        ethAddress: to,
      }));
      shopOwnerUpdates(owners);
    });
};

export const checkEthTransactions = () => {
  request
    .get(
      `${BASE_ETHER_SCAN_URL}api?module=account&action=txlist&address=${OWNER_ETH_ADDRESS}&apikey=EDWD1BFPJ7HH259QVNA9PIZTDR82JF64FS&sort=desc`,
    )
    .then(({ result, status }) => {
      if (!status) return null;

      const owners = result.filter(({ txreceipt_status, to }) => parseInt(txreceipt_status, 10) && to.toLowerCase() === OWNER_ETH_ADDRESS.toLowerCase());
      transactionStatusUpdate(owners);
    });
};
