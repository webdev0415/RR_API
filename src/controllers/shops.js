import { Op } from "sequelize";
import { MechanicShops, Transaction, GlobalSetting } from "models";
import NodeCache from "node-cache";
import { differenceBy, isEmpty } from "lodash";
import BaseController from "../utils/baseController";
import { paginate } from "../utils/paginate";

const myCache = new NodeCache();

export default class ShopController extends BaseController {
  getAll = async (req, res) => {
    const {
      page = 1, size = 9, saleStatus, currentDrop,
    } = req.query;
    if (page < 1 || size < 1) {
      return this.badRequest(res, "page number or page size was wrong!");
    }
    const options = { where: {} };
    if (saleStatus && saleStatus !== "undefined") {
      options.where.saleStatus = saleStatus;
    }
    const setting = await GlobalSetting.findOne({ where: { settingName: "currentDropNumber" } });
    if (currentDrop === "true") {
      options.where.dropNumber = setting.settingNumber;
    }
    let stations = [];
    if (page === "all") {
      stations = await MechanicShops.findAll();
    } else {
      stations = await MechanicShops.findAndCountAll({
        ...options,
        ...paginate(parseInt(page - 1, 10), parseInt(size, 10)),
        include: +saleStatus === 1 && [
          {
            model: Transaction,
            as: "transaction",
            where: {
              saleStart: {
                [Op.lt]: new Date(),
              },
            },
          },
        ],
      });
    }
    return this.success(res, { ...stations, page: parseInt(page, 10) });
  };

  getShopById = async (req, res) => {
    const { shopId } = req.params;
    const station = await MechanicShops.findByPk(shopId);
    return this.success(res, station);
  };

  ownerUpdate = (owners) => {
    const oldOwerList = myCache.get("shopOwners") || [];
    const newUpdates = differenceBy(owners, oldOwerList, ({ ethAddress }) => ethAddress).filter(({ id }) => id);

    if (isEmpty(newUpdates)) {
      console.info("There is no updates in shop ownership");
      return;
    }

    MechanicShops.bulkCreate(newUpdates, { updateOnDuplicate: ["ethAddress"] })
      .then(() => {
        myCache.set("owners", owners);
        console.info(`Updated ownership in ${newUpdates?.length} shops`);
      })
      .catch(() => console.error("Failed to update shop onwership"));
  };

  update = async (req, res) => {
    const { stationId } = req.params;
    const { name } = req.body;
    await MechanicShops.update({ name }, { where: { id: stationId } });
    const station = await MechanicShops.findByPk(stationId);
    return this.success(res, station);
  };

  ownerUpdate = (owners) => {
    const oldOwerList = myCache.get("mechanicShopsOwners") || [];
    const newUpdates = differenceBy(owners, oldOwerList, ({ ethAddress }) => ethAddress).filter(({ id }) => id);

    if (isEmpty(newUpdates)) {
      console.info("There is no updates in MechanicShop ownership");
      return;
    }

    MechanicShops.bulkCreate(newUpdates, { updateOnDuplicate: ["ethAddress"] })
      .then(() => {
        myCache.set("mechanicShopsOwners", owners);
        console.info(`Updated ownership in ${newUpdates?.length} MechanicShops`);
      })
      .catch(() => console.error("Failed to update MechanicShops onwership"));
  };
}
