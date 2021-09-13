import {
  Car, Gasstation, RacetrackLands, MechanicShops, Transaction, sequelize, TransactionLog,
} from "models";
import { QueryTypes } from "sequelize";
import NodeCache from "node-cache";
import { differenceBy, isEmpty } from "lodash";
import BaseController from "../utils/baseController";
import { SALE_STATUS } from "../config/constants";
import { paginate } from "../utils/paginate";
import { addWebHookAddress } from "../services/alchemy";

const request = require("request");

const myCache = new NodeCache();

const { REACT_APP_RECAPTCHA_SECRET_KEY } = process.env;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default class MarketplaceController extends BaseController {
  buyById = async (req, res) => {
    const { id } = req.params;
    const { publicAddress } = req.user;
    const { assetType, captcha } = req.body;
    const startTransaction = "START TRANSACTION;";
    const commitTransaction = "COMMIT;";
    const rollbackTransaction = "ROLLBACK;";
    const queryTransactionLog = "INSERT INTO TransactionLogs (ethAddress, assetType, assetID, action, timeStamp, toAddress) VALUES (:ethAddress, :assetType, :assetID, :action, :timeStamp, :toAddress )";

    // Check that our reCAPTCHA token is valid (to prevent users from circumventing it and calling the API directly)
    request.post(
      {
        url: "https://www.google.com/recaptcha/api/siteverify",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${REACT_APP_RECAPTCHA_SECRET_KEY}&response=${captcha}`,
      },
      async (err, result, body) => {
        console.log("response body", body);

        if (err || body.success === false) {
          console.log("error -----");
          // Verification error occured
          return this.badRequest(res, "reCAPTCHA verification failed");
        }

        // If we made it here, we've passed required checks and can input this item into our transaction log
        await sequelize.query(queryTransactionLog, {
          replacements: {
            ethAddress: publicAddress,
            assetType,
            assetID: id,
            action: "buy attempt",
            timeStamp: new Date(),
            toAddress: null,
          },
          type: QueryTypes.INSERT,
        });

        console.log("Created a Record in TransactionLog, id =", id);

        switch (assetType) {
        case "car":
          await sequelize.query(startTransaction);
          try {
            const carInfo = await sequelize.query(
              "SELECT * FROM Cars where id = :id AND saleStatus = 1 FOR UPDATE;",
              {
                replacements: { id },
                type: QueryTypes.SELECT,
              },
            );

            if (!carInfo.length) {
              await sequelize.query(commitTransaction);

              return this.badRequest(res, "Error while adding the item to the cart");
            }

            const queryFirst = "UPDATE Transactions SET buyerEthAddress = :buyerEthAddress, saleStartTimeStamp = NOW() WHERE transactionId = (SELECT saleCurrentTransactionId FROM cars WHERE id = :id);";
            const querySecond = "UPDATE Cars SET saleStatus = 2 WHERE id = :id;"; // set to sale pending if the user try to buy it sales_status = 2

            console.log("Set BuyerAddress in Transactions");
            console.log("Updated saleStatus = 2 in Cars ");

            const [_results, metadata] = await sequelize.query(queryFirst, {
              replacements: { id, buyerEthAddress: publicAddress },
              type: QueryTypes.UPDATE,
            });

            if (metadata === 1) {
              const [_secondResult, secondMetadata] = await sequelize.query(querySecond, {
                replacements: { id },
                type: QueryTypes.UPDATE,
              });
              if (secondMetadata !== 1) {
                throw new Error("Error on adding cart, Try again");
              }
              await addWebHookAddress(carInfo[0].ethAddress);
              await sequelize.query(commitTransaction);

              return this.success(res, {
                id,
                assetType,
                assetHoldResult: true,
                saleStatus: carInfo[0].saleStatus,
              });
            }
            await sequelize.query(commitTransaction);
            return this.success(res, {
              id,
              assetType,
              assetHoldResult: false,
              saleStatus: carInfo[0].saleStatus,
            });
          } catch (error) {
            console.error(error.message ? error.message : error);
            await sequelize.query(rollbackTransaction);
            throw error;
          }
        case "gasstation":
          await sequelize.query(startTransaction);
          try {
            const gasstationInfo = await sequelize.query(
              "SELECT * FROM GasStations where id = :id and saleStatus = 1 FOR UPDATE;",
              {
                replacements: { id },
                type: QueryTypes.SELECT,
              },
            );
            if (!gasstationInfo.length) {
              await sequelize.query(commitTransaction);
              return this.success(res, {
                id,
                assetType,
                assetHoldResult: false,
                saleStatus: gasstationInfo[0].saleStatus,
              });
            }

            const queryFirst = "UPDATE Transactions SET buyerEthAddress = :buyerEthAddress, saleStartTimeStamp = NOW() WHERE transactionId = (Select saleCurrentTransactionId From Gasstations where id = :id);";
            const querySecond = "UPDATE Gasstations SET saleStatus = 2 WHERE id = :id;";
            const [_results, metadata] = await sequelize.query(queryFirst, {
              replacements: { id, buyerEthAddress: publicAddress },
              type: QueryTypes.UPDATE,
            });
            if (metadata === 1) {
              const [_secondResult, secondMetadata] = await sequelize.query(querySecond, {
                replacements: { id },
                type: QueryTypes.UPDATE,
              });
              if (secondMetadata !== 1) {
                throw new Error("Error on adding cart, Try again");
              }
              await addWebHookAddress(gasstationInfo[0].ethAddress);
              await sequelize.query(commitTransaction);

              return this.success(res, {
                id,
                assetType,
                assetHoldResult: true,
                saleStatus: gasstationInfo[0].saleStatus,
              });
            }
            await sequelize.query(commitTransaction);
            return this.success(res, {
              id,
              assetType,
              assetHoldResult: false,
              saleStatus: gasstationInfo[0].saleStatus,
            });
          } catch (error) {
            console.error(error.message ? error.message : error);
            await sequelize.query(rollbackTransaction);
            throw error;
          }

        case "racetrackland":
          await sequelize.query(startTransaction);
          try {
            const raceTrackInfo = await sequelize.query(
              "SELECT * FROM RaceTrackLands where id = :id and saleStatus = 1 FOR UPDATE;",
              {
                replacements: { id },
                type: QueryTypes.SELECT,
              },
            );
            if (!raceTrackInfo.length) {
              await sequelize.query(commitTransaction);
              return this.success(res, {
                id,
                assetType,
                assetHoldResult: false,
                saleStatus: raceTrackInfo[0].saleStatus,
              });
            }

            const queryFirst = "UPDATE Transactions SET buyerEthAddress = :buyerEthAddress, saleStartTimeStamp = NOW() WHERE transactionId = (Select saleCurrentTransactionId From RaceTrackLands where id = :id);";
            const querySecond = "UPDATE RaceTrackLands SET saleStatus = 2 WHERE id = :id;";
            const [_results, metadata] = await sequelize.query(queryFirst, {
              replacements: { id, buyerEthAddress: publicAddress },
              type: QueryTypes.UPDATE,
            });
            if (metadata === 1) {
              const [_secondResult, secondMetadata] = await sequelize.query(querySecond, {
                replacements: { id },
                type: QueryTypes.UPDATE,
              });
              if (secondMetadata !== 1) {
                throw new Error("Error on adding cart, Try again");
              }
              await addWebHookAddress(raceTrackInfo[0].ethAddress);
              await sequelize.query(commitTransaction);

              return this.success(res, {
                id,
                assetType,
                assetHoldResult: true,
                saleStatus: raceTrackInfo[0].saleStatus,
              });
            }
            await sequelize.query(commitTransaction);
            return this.success(res, {
              id,
              assetType,
              assetHoldResult: false,
              saleStatus: raceTrackInfo[0].saleStatus,
            });
          } catch (error) {
            console.error(error.message ? error.message : error);
            await sequelize.query(rollbackTransaction);
            throw error;
          }

        case "mechanicshop":
          await sequelize.query(startTransaction);
          try {
            const mechanicShopInfo = await sequelize.query(
              "SELECT * FROM MechanicShops where id = :id and saleStatus = 1 FOR UPDATE;",
              {
                replacements: { id },
                type: QueryTypes.SELECT,
              },
            );
            if (!mechanicShopInfo.length) {
              await sequelize.query(commitTransaction);
              return this.success(res, {
                id,
                assetType,
                assetHoldResult: false,
                saleStatus: mechanicShopInfo[0].saleStatus,
              });
            }

            const queryFirst = "UPDATE Transactions SET buyerEthAddress = :buyerEthAddress, saleStartTimeStamp = NOW() WHERE transactionId = (Select saleCurrentTransactionId From MechanicShops where id = :id);";
            const querySecond = "UPDATE MechanicShops SET saleStatus = 2 WHERE id = :id;";
            const [_results, metadata] = await sequelize.query(queryFirst, {
              replacements: { id, buyerEthAddress: publicAddress },
              type: QueryTypes.UPDATE,
            });
            if (metadata === 1) {
              const [_secondResult, secondMetadata] = await sequelize.query(querySecond, {
                replacements: { id },
                type: QueryTypes.UPDATE,
              });
              if (secondMetadata !== 1) {
                throw new Error("Error on adding cart, Try again");
              }
              await addWebHookAddress(mechanicShopInfo[0].ethAddress);
              await sequelize.query(commitTransaction);

              return this.success(res, {
                id,
                assetType,
                assetHoldResult: true,
                saleStatus: mechanicShopInfo[0].saleStatus,
              });
            }
            await sequelize.query(commitTransaction);
            return this.success(res, {
              id,
              assetType,
              assetHoldResult: false,
              saleStatus: mechanicShopInfo[0].saleStatus,
            });
          } catch (error) {
            console.error(error.message ? error.message : error);
            await sequelize.query(rollbackTransaction);
            throw error;
          }

        default:
          return this.badRequest(res, "assetType Bad request!");
        }
      },
    );
  };

  getCarsOnCart = async (req, res) => {
    const { page = 1, size = 9 } = req.query;
    if (page < 1 || size < 1) {
      return this.badRequest(res, "page number or page size was wrong!");
    }
    const { publicAddress } = req.user;
    let carts = [];
    let counts = [];
    const query = "SELECT Cars.id as id, Cars.name as name, Cars.ethAddress as ethAddress , Cars.classFactory as classFactory, Cars.modelFactory as modelFactory, Cars.image as image, Cars.animation_url as animation_url, Cars.saleStatus as saleStatus, Cars.saleCurrentTransactionId as saleCurrentTransactionId, transactions.assetType as 'transaction.assetType', transactions.id as 'transaction.id', transactions.saleStart as 'transaction.saleStart', transactions.saleStartTimeStamp as 'transaction.saleStartTimeStamp', transactions.salePrice as 'transaction.salePrice', transactions.saleCurrency as 'transaction.saleCurrency' from Cars inner join transactions on cars.saleCurrentTransactionId = transactions.transactionId where transactions.buyerEthAddress = :buyerEthAddress AND cars.saleStatus IN( :saleStatus) union all SELECT gasstations.id as id, Gasstations.name as name, Gasstations.ethAddress , NULL, null, Gasstations.image as image, null , Gasstations.saleStatus as saleStatus, Gasstations.saleCurrentTransactionId as saleCurrentTransactionId, transactions.assetType as 'transaction.assetType', transactions.id as 'transaction.id', transactions.saleStart as 'transaction.saleStart', transactions.saleStartTimeStamp as 'transaction.saleStartTimeStamp', transactions.salePrice as 'transaction.salePrice', transactions.saleCurrency as 'transaction.saleCurrency' from gasstations inner join transactions on gasstations.saleCurrentTransactionId = transactions.transactionId where transactions.buyerEthAddress = :buyerEthAddress AND gasstations.saleStatus IN ( :saleStatus ) union all SELECT RacetrackLands.id as id, RacetrackLands.name as name, RacetrackLands.ethAddress , NULL, null, RacetrackLands.image as image, null , RacetrackLands.saleStatus as saleStatus, RacetrackLands.saleCurrentTransactionId as saleCurrentTransactionId, transactions.assetType as 'transaction.assetType', transactions.id as 'transaction.id', transactions.saleStart as 'transaction.saleStart', transactions.saleStartTimeStamp as 'transaction.saleStartTimeStamp', transactions.salePrice as 'transaction.salePrice', transactions.saleCurrency as 'transaction.saleCurrency' from RacetrackLands inner join transactions on RacetrackLands.saleCurrentTransactionId = transactions.transactionId where transactions.buyerEthAddress = :buyerEthAddress AND RacetrackLands.saleStatus IN ( :saleStatus ) union all SELECT MechanicShops.id as id, MechanicShops.name as name, MechanicShops.ethAddress , NULL, null, MechanicShops.image as image, null , MechanicShops.saleStatus as saleStatus, MechanicShops.saleCurrentTransactionId as saleCurrentTransactionId, transactions.assetType as 'transaction.assetType', transactions.id as 'transaction.id', transactions.saleStart as 'transaction.saleStart', transactions.saleStartTimeStamp as 'transaction.saleStartTimeStamp', transactions.salePrice as 'transaction.salePrice', transactions.saleCurrency as 'transaction.saleCurrency' from MechanicShops inner join transactions on MechanicShops.saleCurrentTransactionId = transactions.transactionId where transactions.buyerEthAddress = :buyerEthAddress AND MechanicShops.saleStatus IN ( :saleStatus ) LIMIT :limit OFFSET :offset";
    const countQuery = "SELECT SUM(rows) AS count FROM(SELECT COUNT(*) AS rows from Cars inner join transactions on cars.saleCurrentTransactionId = transactions.transactionId where transactions.buyerEthAddress = :buyerEthAddress AND cars.saleStatus IN ( :saleStatus) union all SELECT COUNT(*) AS rows from Gasstations inner join transactions on Gasstations.saleCurrentTransactionId = transactions.transactionId where transactions.buyerEthAddress = :buyerEthAddress AND gasstations.saleStatus IN ( :saleStatus ) union all SELECT COUNT(*) AS rows from RacetrackLands inner join transactions on RacetrackLands.saleCurrentTransactionId = transactions.transactionId where transactions.buyerEthAddress = :buyerEthAddress AND RacetrackLands.saleStatus IN ( :saleStatus ) union all SELECT COUNT(*) AS rows from MechanicShops inner join transactions on MechanicShops.saleCurrentTransactionId = transactions.transactionId where transactions.buyerEthAddress = :buyerEthAddress AND MechanicShops.saleStatus IN ( :saleStatus ) ) as t";

    if (publicAddress) {
      carts = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        nest: true,
        replacements: {
          saleStatus: [
            SALE_STATUS.SALE_STATUS_SALE_PENDING,
            SALE_STATUS.SALE_STATUS_PAYMENT_PENDING,
            SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
          ],
          buyerEthAddress: publicAddress,
          ...paginate(page - 1, size),
        },
      });
      counts = await sequelize.query(countQuery, {
        type: QueryTypes.SELECT,
        nest: true,
        replacements: {
          saleStatus: [
            SALE_STATUS.SALE_STATUS_SALE_PENDING,
            SALE_STATUS.SALE_STATUS_PAYMENT_PENDING,
            SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
          ],
          buyerEthAddress: publicAddress,
        },
      });
    }
    return this.success(res, { rows: carts, count: +counts[0].count, page: parseInt(page, 10) });
  };

  removeCart = async (req, res) => {
    const { publicAddress } = req.user;
    const { assetType } = req.body;
    const { id } = req.params;

    let instance;
    switch (assetType) {
    case "car":
      instance = await Car.findOne({
        where: { id },
        include: [
          {
            model: Transaction,
            as: "transaction",
            where: {
              buyerEthAddress: publicAddress,
            },
          },
        ],
      });
      break;

    case "gasstation":
      instance = await Gasstation.findOne({
        where: { id },
        include: [
          {
            model: Transaction,
            as: "transaction",
            where: {
              buyerEthAddress: publicAddress,
            },
          },
        ],
      });
      break;

    case "racetrackland":
      instance = await RacetrackLands.findOne({
        where: { id },
        include: [
          {
            model: Transaction,
            as: "transaction",
            where: {
              buyerEthAddress: publicAddress,
            },
          },
        ],
      });
      break;

    case "mechanicshop":
      instance = await MechanicShops.findOne({
        where: { id },
        include: [
          {
            model: Transaction,
            as: "transaction",
            where: {
              buyerEthAddress: publicAddress,
            },
          },
        ],
      });
      break;

    default:
      return this.badRequest(res, "Invalid AssetType");
    }
    if (!instance || instance.saleStatus !== SALE_STATUS.SALE_STATUS_SALE_PENDING) {
      return this.badRequest(res, "Item is not on the cart");
    }

    await instance.update({ saleStatus: SALE_STATUS.SALE_STATUS_FOR_SALE });
    await Transaction.update({ saleStartTimeStamp: null }, { where: { id: instance.transaction.id } });
    const transactionLog = new TransactionLog({
      ethAddress: publicAddress,
      assetType,
      timeStamp: new Date(),
      assetID: id,
      toAddress: instance.ethAddress,
      action: "buy cancelled",
    });
    await transactionLog.save();
    return this.success(res, { message: "success" });
  };

  prePayItem = async (req, res) => {
    try {
      const { publicAddress } = req.user;
      const { assetType, transactionHash } = req.body;
      const { id } = req.params;
      const checkTransaction = await TransactionLog.findOne({ where: { transactionHash } });

      console.log("===> PrePay1 TransactionHash ==>", transactionHash);
      console.log("===> PrePay2 TransactionLog with hash", checkTransaction);

      if (!checkTransaction) {
        let instance;
        switch (assetType) {
        case "car":
          instance = await Car.findOne({ where: { id } });
          break;

        case "gasstation":
          instance = await Gasstation.findOne({ where: { id } });
          break;

        case "racetrackland":
          instance = await RacetrackLands.findOne({ where: { id } });
          break;

        case "mechanicshop":
          instance = await MechanicShops.findOne({ where: { id } });
          break;

        default:
          return this.badRequest(res, "assetType Bad Request");
        }

        if (!instance || instance.saleStatus !== SALE_STATUS.SALE_STATUS_SALE_PENDING) {
          return this.badRequest(res, "Item is not set correctly");
        }

        await instance.update({ saleStatus: SALE_STATUS.SALE_STATUS_PAYMENT_PENDING });

        console.log("===> PrePay3 Updated saleStatus->payment pending in Cars");

        await Transaction.update(
          {
            lastTransactionHash: transactionHash,
          },
          {
            where: {
              transactionId: instance.saleCurrentTransactionId,
            },
          },
        );

        console.log("===> PrePay4 -- SET transactionHash in Transaction");

        if (publicAddress) {
          const transactionLog = new TransactionLog({
            toAddress: instance.ethAddress,
            ethAddress: publicAddress,
            assetType,
            timeStamp: new Date(),
            assetID: id,
            action: "buy started",
            transactionHash,
          });
          await transactionLog.save();
        }

        console.log("===> PrePay5 -> Add buy started log in TransactionLog");

        return this.success(res, { message: "success" });
      }

      switch (assetType) {
      case "car": {
        const [_carResults, carMetadata] = await Car.update(
          {
            saleStatus: SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
            saleLastDate: new Date(),
            saleLastPrice: checkTransaction.price,
            saleLastCurrency: checkTransaction.asset,
          },
          { where: { id, saleStatus: SALE_STATUS.SALE_STATUS_SALE_PENDING } },
        );
        if (carMetadata < 1) {
          console.error("Invalid Car");
        }
        break;
      }
      case "gasstation": {
        const [_stationResults, stationMetadata] = await Gasstation.update(
          {
            saleStatus: SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
            saleLastDate: new Date(),
            saleLastPrice: checkTransaction.price,
            saleLastCurrency: checkTransaction.asset,
          },
          { where: { id, saleStatus: SALE_STATUS.SALE_STATUS_SALE_PENDING } },
        );
        if (stationMetadata < 1) {
          console.error("Invalid Gasstation");
        }
        break;
      }
      case "racetrackland": {
        const [_landResults, landMetadata] = await RacetrackLands.update(
          {
            saleStatus: SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
            saleLastDate: new Date(),
            saleLastPrice: checkTransaction.price,
            saleLastCurrency: checkTransaction.asset,
          },
          { where: { id, saleStatus: SALE_STATUS.SALE_STATUS_SALE_PENDING } },
        );
        if (landMetadata < 1) {
          console.error("Invalid RacetrackLands");
        }
        break;
      }

      case "mechanicshop": {
        const [_mechanicShopsResults, mechanicShopsMetadata] = await MechanicShops.update(
          {
            saleStatus: SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
            saleLastDate: new Date(),
            saleLastPrice: checkTransaction.price,
            saleLastCurrency: checkTransaction.asset,
          },
          { where: { id, saleStatus: SALE_STATUS.SALE_STATUS_SALE_PENDING } },
        );
        if (mechanicShopsMetadata < 1) {
          console.error("Invalid MechanicShops");
        }
        break;
      }

      default:
        console.error("wrong assetType");
      }

      await TransactionLog.update(
        {
          assetID: id,
          assetType,
        },
        { where: { transactionHash } },
      );
      return this.success(res, { message: "success" });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  handleWebhook = async (req, res) => {
    console.info("---- Webhook Body---", JSON.stringify(req.body));
    const activities = req.body.activity;
    await sleep(1000);

    const promises = activities.map(async (activity) => {
      const {
        fromAddress, toAddress, value, hash, asset,
      } = activity;
      console.log("===> HandleWebhook1 hash", hash);

      const transact = await Transaction.findOne({
        where: {
          lastTransactionHash: hash,
          sellerEthAddress: toAddress,
          buyerEthAddress: fromAddress,
          // salePrice: value
        },
      });

      console.log("===> HandleWebhook3 Transaction info  with hash", transact);

      const transactionLog = new TransactionLog({
        ethAddress: fromAddress,
        toAddress,
        asset,
        assetID: transact?.assetId || null,
        price: value,
        transactionHash: hash,
        timeStamp: new Date(),
        action: "payment received",
      });
      await transactionLog.save();

      console.log("===> HandleWebhook2  Payment received Log2", transactionLog);

      if (!transact) {
        console.error("===> HandleWebhook4 -- No Transaction Record Found!");
        return;
      }

      console.error("===> HandleWebhook4 -- Transaction Record Found!");

      switch (transact.assetType) {
      case "car": {
        const [_carResults, carMetadata] = await Car.update(
          {
            ethAddress: fromAddress,
            saleStatus: SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
            saleLastCurrency: asset,
            saleLastPrice: value,
            saleLastDate: new Date(),
          },
          { where: { id: transact.assetId, saleStatus: SALE_STATUS.SALE_STATUS_PAYMENT_PENDING } },
        );

        console.error("===> HandleWebhook5 -- Updated Sales in Car");

        if (carMetadata < 1) {
          console.error("Invalid Car");
        }
        break;
      }

      case "gasstation": {
        const [_stationResults, stationMetadata] = await Gasstation.update(
          {
            ethAddress: fromAddress,
            saleStatus: SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
            saleLastCurrency: asset,
            saleLastPrice: value,
            saleLastDate: new Date(),
          },
          { where: { id: transact.assetId, saleStatus: SALE_STATUS.SALE_STATUS_PAYMENT_PENDING } },
        );
        if (stationMetadata < 1) {
          console.error("Invalid Gasstation");
        }
        break;
      }

      case "racetrackland": {
        const [_landResults, landMetadata] = await RacetrackLands.update(
          {
            ethAddress: fromAddress,
            saleStatus: SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
            saleLastCurrency: asset,
            saleLastPrice: value,
            saleLastDate: new Date(),
          },
          { where: { id: transact.assetId, saleStatus: SALE_STATUS.SALE_STATUS_PAYMENT_PENDING } },
        );
        if (landMetadata < 1) {
          console.error("Invalid RacetrackLands");
        }
        break;
      }

      case "mechanicshop": {
        const [_mechanicShopsResults, mechanicShopsMetadata] = await MechanicShops.update(
          {
            ethAddress: fromAddress,
            saleStatus: SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
            saleLastCurrency: asset,
            saleLastPrice: value,
            saleLastDate: new Date(),
          },
          { where: { id: transact.assetId, saleStatus: SALE_STATUS.SALE_STATUS_PAYMENT_PENDING } },
        );

        if (mechanicShopsMetadata < 1) {
          console.error("Invalid MechanicShops");
        }
        break;
      }

      default:
        console.error("wrong assetType");
      }

      const transaction = await transact.update(
        {
          saleType: SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
        },
        { where: { lastTransactionHash: hash } },
      );

      console.log("===> HandleWebhook-last Updated SalesStatus in Transaction", transaction);
    });
    await Promise.all(promises);
    return this.success(res, { message: "completed to handle webhook" });
  };

  transactionStatusUpdate = (owners) => {
    const oldOwerList = myCache.get("eth_transaction_status") || [];
    const newUpdates = differenceBy(owners, oldOwerList, ({ hash }) => hash);

    if (isEmpty(newUpdates)) {
      console.info("There is no updates in eth ownership");
      return;
    }

    console.log("newUpdates", newUpdates.length);

    Promise.all(
      newUpdates.map(async (item) => {
        const { from: fromAddress, to: toAddress, hash } = item;

        const transact = await Transaction.findOne({
          where: {
            lastTransactionHash: hash,
            sellerEthAddress: toAddress,
            buyerEthAddress: fromAddress,
          },
        });

        if (!transact) {
          return;
        }

        switch (transact?.assetType) {
        case "car": {
          const [_carResults, carMetadata] = await Car.update(
            {
              ethAddress: fromAddress,
              saleStatus: SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
              saleLastDate: new Date(),
            },
            { where: { id: transact.assetId, saleStatus: SALE_STATUS.SALE_STATUS_PAYMENT_PENDING } },
          );

          if (carMetadata < 1) {
            console.error("Invalid Car");
          }
          break;
        }

        case "gasstation": {
          const [_stationResults, stationMetadata] = await Gasstation.update(
            {
              ethAddress: fromAddress,
              saleStatus: SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
              saleLastDate: new Date(),
            },
            { where: { id: transact.assetId, saleStatus: SALE_STATUS.SALE_STATUS_PAYMENT_PENDING } },
          );
          if (stationMetadata < 1) {
            console.error("Invalid Gasstation");
          }
          break;
        }

        case "racetrackland": {
          const [_landResults, landMetadata] = await RacetrackLands.update(
            {
              ethAddress: fromAddress,
              saleStatus: SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
              saleLastDate: new Date(),
            },
            { where: { id: transact.assetId, saleStatus: SALE_STATUS.SALE_STATUS_PAYMENT_PENDING } },
          );
          if (landMetadata < 1) {
            console.error("Invalid RacetrackLands");
          }
          break;
        }

        case "mechanicshop": {
          const [_mechanicShopsResults, mechanicShopsMetadata] = await MechanicShops.update(
            {
              ethAddress: fromAddress,
              saleStatus: SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
              saleLastDate: new Date(),
            },
            { where: { id: transact.assetId, saleStatus: SALE_STATUS.SALE_STATUS_PAYMENT_PENDING } },
          );

          if (mechanicShopsMetadata < 1) {
            console.error("Invalid MechanicShops");
          }
          break;
        }

        default:
          console.error("wrong assetType");
        }

        await transact.update(
          {
            saleType: SALE_STATUS.SALE_STATUS_NOT_FOR_SALE,
          },
          { where: { lastTransactionHash: hash } },
        );
      }),
    ).then((e) => {
      myCache.set("eth_transaction_status", owners);
      console.info(`Updated eth transaction ${newUpdates?.length} transactions`);
    });
  };
}
