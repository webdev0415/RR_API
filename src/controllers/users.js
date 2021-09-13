import { isNaN } from "lodash";
import {
  RaceFee, GasLog, User, UserLog, Car,
} from "models";
import { generateAuthToken } from "../middleware/auth";
import { deleteFile } from "../middleware/s3";

import BaseController from "../utils/baseController";

class UserController extends BaseController {
  // To Handle email Auth
  find = async (req, res) => {
    const { email } = req.query;
    const user = await User.findRecord({ email });
    if (user && user.email) {
      return this.badRequest(res, { isEmailValid: false });
    }
    return this.success(res, { isEmailValid: true });
  };

  // To Handle MetaMask Auth
  create = async (req, res) => {
    const { publicAddress, email, username } = req.body;
    let user = await User.findRecord({ email });

    if (user && publicAddress && !user.publicAddress) {
      await User.update({ publicAddress, username }, { where: { email } });
      user = await User.findRecord({ email });
    }
    let isCreate = false;

    if (!user) {
      isCreate = true;
      user = await User.create({
        email,
        username,
        publicAddress,
      });
    }

    if (isCreate) {
      await UserLog.create({ userId: user.id, logType: "registered" });
    }
    return this.success(res, { user, token: generateAuthToken(user.id) });
  };

  checkUserName = async (req, res) => {
    const { username } = req.params;
    const user = await User.findRecord({ username });
    if (user) {
      return this.badRequest(res, { error: "This username is already taken." });
    }
    return this.success(res, { isUsernameValid: true });
  };

  authenticateUser = async (req, res) => this.success(res, { user: req.user });

  renewToken = (req, res) => {
    const token = generateAuthToken(req.user.id);
    this.success(res, { token, user: req.user });
  };

  update = async (req, res) => {
    const {
      publicAddress, email, username, picture,
    } = req.body;
    const { id } = req.params;

    if (picture) {
      // remove previous profile picture
      const prevUser = await User.findRecord({ id });
      if (prevUser.profile_picture) {
        deleteFile(prevUser.profile_picture.fileId);
      }
    }

    const user = await User.updateAndRecordById(id, {
      publicAddress,
      email,
      username,
      picture,
    });
    return this.success(res, { user });
  };

  addGasBalance = async (req, res) => {
    const { amount, userId, maticTransactionId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return this.badRequest(res, { message: "User not found!" });
    }
    const nextGasBalance = (user.gasBalance || 0) + amount;
    await User.update({ gasBalance: nextGasBalance }, { where: { id: userId } });
    await GasLog.create({ userId, amount, maticTransactionId });

    return this.success(res, { data: nextGasBalance });
  };

  getGasBalance = async (req, res) => {
    const { id: userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) {
      return this.notFound(res, { message: "User not found!" });
    }
    return this.success(res, { gasBalance: user?.gasBalance });
  };

  spendGas = async (req, res) => {
    const {
      amount, userId, raceId, carId,
    } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return this.notFound(res, { message: "User not found!" });
    }
    const nextBalance = user.gasBalance - amount;
    if (isNaN(nextBalance) && nextBalance < 0) {
      return this.badRequest(res, { message: "You have no enough gas balance" });
    }

    await User.update({ gasBalance: nextBalance }, { where: { id: userId } });
    await RaceFee.create({
      userId,
      amount,
      raceId,
      carId,
    });

    return this.success(res, { data: nextBalance });
  };

  selectCar = async (req, res) => {
    const { userId, carId } = req.body;
    const { publicAddress } = req.user;

    await User.update({ selectedCar: carId }, { where: { id: userId, publicAddress } });

    const car = await Car.findByPk(carId);
    if (publicAddress !== car.ethAddress) {
      return this.unAuthorized(res, {
        error: "You don't have permission",
      });
    }
    return this.success(res, car);
  };

  getActivities = async (req, res) => {
    const activities = await UserLog.findAll({
      where: {
        userId: req.user.id,
      },
    });

    return this.success(res, activities);
  };
}

export default UserController;
