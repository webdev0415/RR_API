import {
  GlobalSetting, Car, Gasstation, RacetrackLands, MechanicShops, Transaction, DropLimit, sequelize,
} from "models";
import { SALE_STATUS, CART_LIMIT_SETTING_NAME } from "../config/constants";

export const validateLimitCart = async (req, res, next) => {
  const { publicAddress } = req.user;
  const { assetType } = req.body;
  let count;
  switch (assetType) {
  case "car":
    count = await Car.count({
      where: {
        saleStatus: SALE_STATUS.SALE_STATUS_SALE_PENDING,
      },
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
    count = await Gasstation.count({
      where: {
        saleStatus: SALE_STATUS.SALE_STATUS_SALE_PENDING,
      },
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
    count = await RacetrackLands.count({
      where: {
        saleStatus: SALE_STATUS.SALE_STATUS_SALE_PENDING,
      },
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
    count = await MechanicShops.count({
      where: {
        saleStatus: SALE_STATUS.SALE_STATUS_SALE_PENDING,
      },
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
    console.error("Unsupported AssetType");
  }
  const setting = await GlobalSetting.findOne({
    attributes: ["settingNumber"],
    where: { settingName: CART_LIMIT_SETTING_NAME[assetType] },
  });
  if (setting && setting.settingNumber && +setting.settingNumber <= +count) {
    res.status(422).json({ errors: `You have reached the limit number of ${assetType}s in your shopping cart. ${count}` });
  } else {
    next();
  }
};

export const validateDropLimit = async (req, res, next) => {
  const { publicAddress } = req.user;
  const { assetType } = req.body;
  const { id } = req.params;
  let instance;
  let dropLimit;
  let count;
  switch (assetType) {
  case "car":
  {
    instance = await Car.findOne({
      where: {
        id,
      },
    });

    if (!instance || !instance.dropNumber) {
      res.status(400).json({ errors: "Invalid Item for Purchase" });
    } else {
      dropLimit = await DropLimit.findOne({
        where: {
          dropLimitType: assetType,
          dropNumber: instance.dropNumber,
        },
      });

      const carCountA = await Car.count({
        include: [
          {
            model: Transaction,
            as: "transaction",
            where: {
              buyerEthAddress: publicAddress,
            },
          },
        ],
        where: {
          saleStatus: [
            SALE_STATUS.SALE_STATUS_PAYMENT_PENDING,
            SALE_STATUS.SALE_STATUS_SALE_PENDING,
            SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
          ],
          dropNumber: dropLimit ? dropLimit.dropNumber : 0,
        },
      });

      const carCountB = await Car.count({
        where: {
          saleStatus: SALE_STATUS.SALE_STATUS_NOT_FOR_SALE,
          ethAddress: publicAddress,
          dropNumber: dropLimit ? dropLimit.dropNumber : 0,
        },
      });

      count = carCountA + carCountB;
    }
    break;
  }

  case "gasstation": {
    instance = await Gasstation.findOne({
      where: {
        id,
      },
    });

    if (!instance || !instance.dropNumber) {
      res.status(400).json({ errors: "Invalid Item for Purchase" });
    } else {
      dropLimit = await DropLimit.findOne({
        where: {
          dropLimitType: assetType,
          dropNumber: instance.dropNumber,
        },
      });

      const gasCountA = await Gasstation.count({
        include: [
          {
            model: Transaction,
            as: "transaction",
            where: {
              buyerEthAddress: publicAddress,
            },
          },
        ],
        where: {
          saleStatus: [
            SALE_STATUS.SALE_STATUS_PAYMENT_PENDING,
            SALE_STATUS.SALE_STATUS_SALE_PENDING,
            SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
          ],
          dropNumber: dropLimit ? dropLimit.dropNumber : 0,
        },
      });

      const gasCountB = await Gasstation.count({
        where: {
          saleStatus: SALE_STATUS.SALE_STATUS_NOT_FOR_SALE,
          ethAddress: publicAddress,
          dropNumber: dropLimit ? dropLimit.dropNumber : 0,
        },
      });

      count = gasCountA + gasCountB;
    }
    break;
  }

  case "racetrackland":
  {
    instance = await RacetrackLands.findOne({
      where: {
        id,
      },
    });

    if (!instance || !instance.dropNumber) {
      res.status(400).json({ errors: "Invalid Item for Purchase" });
    } else {
      dropLimit = await DropLimit.findOne({
        where: {
          dropLimitType: assetType,
          dropNumber: instance.dropNumber,
        },
      });

      const trackCountA = await RacetrackLands.count({
        include: [
          {
            model: Transaction,
            as: "transaction",
            where: {
              buyerEthAddress: publicAddress,
            },
          },
        ],
        where: {
          saleStatus: [
            SALE_STATUS.SALE_STATUS_PAYMENT_PENDING,
            SALE_STATUS.SALE_STATUS_SALE_PENDING,
            SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
          ],
          dropNumber: dropLimit ? dropLimit.dropNumber : 0,
        },
      });

      const trackCountB = await RacetrackLands.count({
        where: {
          saleStatus: SALE_STATUS.SALE_STATUS_NOT_FOR_SALE,
          ethAddress: publicAddress,
          dropNumber: dropLimit ? dropLimit.dropNumber : 0,
        },
      });

      count = trackCountA + trackCountB;
    }
    break;
  }

  case "mechanicshop":
  {
    instance = await MechanicShops.findOne({
      where: {
        id,
      },
    });

    if (!instance || !instance.dropNumber) {
      res.status(400).json({ errors: "Invalid Item for Purchase" });
    } else {
      dropLimit = await DropLimit.findOne({
        where: {
          dropLimitType: assetType,
          dropNumber: instance.dropNumber,
        },
      });

      const shopCountA = await MechanicShops.count({
        include: [
          {
            model: Transaction,
            as: "transaction",
            where: {
              buyerEthAddress: publicAddress,
            },
          },
        ],
        where: {
          saleStatus: [
            SALE_STATUS.SALE_STATUS_PAYMENT_PENDING,
            SALE_STATUS.SALE_STATUS_SALE_PENDING,
            SALE_STATUS.SALE_STATUS_TRANSFER_PENDING,
          ],
          dropNumber: dropLimit ? dropLimit.dropNumber : 0,
        },
      });

      const shopCountB = await MechanicShops.count({
        where: {
          saleStatus: SALE_STATUS.SALE_STATUS_NOT_FOR_SALE,
          ethAddress: publicAddress,
          dropNumber: dropLimit ? dropLimit.dropNumber : 0,
        },
      });

      count = shopCountA + shopCountB;
    }

    break;
  }

  default: {
    console.error(`Invalid AssetType : ${assetType}`);
  }
  }

  if (dropLimit && +dropLimit.dropItemLimit <= count) {
    res
      .status(422)
      .json({ errors: `You have already purchased the max number allowed for ${assetType}s in this drop` });
  } else {
    next();
  }
};
