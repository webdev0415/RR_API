import { Op } from "sequelize";
import { Gasstation, Transaction, GlobalSetting } from "models";
import NodeCache from "node-cache";
import { differenceBy, isEmpty } from "lodash";
import BaseController from "../utils/baseController";
import { paginate } from "../utils/paginate";

const myCache = new NodeCache();

export default class StationController extends BaseController {
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
      stations = await Gasstation.findAll();
    } else {
      stations = await Gasstation.findAndCountAll({
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

  getStationById = async (req, res) => {
    const { stationId } = req.params;
    const station = await Gasstation.findByPk(stationId);
    return this.success(res, station);
  };

  getStationsByAddress = async (req, res) => {
    const { ethAddress } = req.params;
    const stations = await Gasstation.findAll({ where: { ethAddress } });
    return this.success(res, stations);
  };

  update = async (req, res) => {
    const { stationId } = req.params;
    const { name } = req.body;
    await Gasstation.update({ name }, { where: { id: stationId } });
    const station = await Gasstation.findByPk(stationId);
    return this.success(res, station);
  };

  ownerUpdate = (owners) => {
    const oldOwerList = myCache.get("stationOwners") || [];
    const newUpdates = differenceBy(owners, oldOwerList, ({ ethAddress }) => ethAddress).filter(({ id }) => id);

    if (isEmpty(newUpdates)) {
      console.info("There is no updates in station ownership");
      return;
    }

    Gasstation.bulkCreate(newUpdates, { updateOnDuplicate: ["ethAddress"] })
      .then(() => {
        myCache.set("stationOwners", owners);
        console.info(`Updated ownership in ${newUpdates?.length} stations`);
      })
      .catch(() => console.error("Failed to update car onwership"));
  };
}
