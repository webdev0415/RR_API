import { Op } from "sequelize";
import { RacetrackLands, Transaction, GlobalSetting } from "models";
import NodeCache from "node-cache";
import { differenceBy, isEmpty } from "lodash";
import BaseController from "../utils/baseController";
import { paginate } from "../utils/paginate";

const myCache = new NodeCache();
export default class LandController extends BaseController {
  getAll = async (req, res) => {
    const {
      page = 1, size = 12, saleStatus, currentDrop,
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
    let lands = [];
    if (page === "all") {
      lands = await RacetrackLands.findAll();
    } else {
      lands = await RacetrackLands.findAndCountAll({
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
    return this.success(res, { ...lands, page: parseInt(page, 10) });
  };

  getLandById = async (req, res) => {
    const { landId } = req.params;
    const land = await RacetrackLands.findByPk(landId);
    return this.success(res, land);
  };

  update = async (req, res) => {
    const { landId } = req.params;
    const { name } = req.body;
    await RacetrackLands.update({ name }, { where: { id: landId } });
    const station = await RacetrackLands.findByPk(landId);
    return this.success(res, station);
  };

  ownerUpdate = (owners) => {
    const oldOwerList = myCache.get("landsOwners") || [];
    const newUpdates = differenceBy(owners, oldOwerList, ({ ethAddress }) => ethAddress).filter(({ id }) => id);

    if (isEmpty(newUpdates)) {
      console.info("There is no updates in RacetrackLand ownership");
      return;
    }

    RacetrackLands.bulkCreate(newUpdates, { updateOnDuplicate: ["ethAddress"] })
      .then(() => {
        myCache.set("landsOwners", owners);
        console.info(`Updated ownership in ${newUpdates?.length} RacetrackLands`);
      })
      .catch(() => console.error("Failed to update RacetrackLand onwership"));
  };
}
