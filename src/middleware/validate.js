import Joi from "joi";
import { ASSET_TYPE_ALL } from "../config/constants";

const schemas = {
  id: Joi.object({
    id: Joi.number()
      .integer()
      .required(),
  }),
  byCar: Joi.object({
    carId: Joi.number()
      .integer()
      .required(),
  }),
  byUser: Joi.object({
    userId: Joi.number()
      .integer()
      .required(),
  }),
  ethAddress: Joi.object({
    ethAddress: Joi.string().required(),
  }),
  winners: Joi.object({
    players: Joi.array()
      .items(
        Joi.object().keys({
          participant: Joi.string().required(),
          chance: Joi.number().required(),
        }),
      )
      .required(),
  }),
  spendGas: Joi.object({
    amount: Joi.number()
      .integer()
      .required(),
    userId: Joi.number()
      .integer()
      .required(),
    raceId: Joi.number()
      .integer()
      .required(),
    carId: Joi.number()
      .integer()
      .required(),
  }),
  addGasBalance: Joi.object({
    amount: Joi.number()
      .integer()
      .required(),
    userId: Joi.number()
      .integer()
      .required(),
    maticTransactionId: Joi.string().required(),
  }),
  selectCar: Joi.object({
    carId: Joi.number()
      .integer()
      .required(),
    userId: Joi.number()
      .integer()
      .required(),
  }),
  removeFile: Joi.object({
    fileId: Joi.string().required(),
  }),
  auth: Joi.object({
    publicAddress: Joi.string().required(),
    signature: Joi.string().required(),
    email: Joi.string().allow(null, ""),
  }),
  removeCart: Joi.object({
    assetType: Joi.string().required().valid(...ASSET_TYPE_ALL),
  }),
  marketplaceBuy: Joi.object({
    assetType: Joi.string().required().valid(...ASSET_TYPE_ALL),
    captcha: Joi.string().required(),
  }),
  marketplacePrePay: Joi.object({
    assetType: Joi.string().required().valid(...ASSET_TYPE_ALL),
    transactionHash: Joi.string().required(),
  }),
  userCreate: Joi.object({
    publicAddress: Joi.string().required(),
    email: Joi.string().required(),
    username: Joi.string().required(),
  }),
};

const validate = (schemaName, prop = "body") => (req, res, next) => {
  if (schemaName in schemas) {
    const schema = schemas[schemaName];
    const { error } = schema.validate(req[prop], {});
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      res.status(422).json({ error: message });
    }
  } else {
    /* eslint-disable no-console */
    console.warn(`validate schema ${schemaName} doesn't exist`);
    next();
  }
};

export default validate;
