import Sequelize from 'sequelize';
import { Car, User, Transaction, GlobalSetting } from 'models';
import NodeCache from 'node-cache';
import { differenceBy, isEmpty } from 'lodash';
import { convertStrToArr } from '../utils/strings';
import BaseController from '../utils/baseController';
import { paginate } from '../utils/paginate';

const { Op } = Sequelize;

const myCache = new NodeCache();
export default class CarsController extends BaseController {
  getAll = async (req, res) => {
    const { page = 1, size = 9, search, classFactory, modelFactory, saleStatus, currentDrop } = req.query;
    let cars = [];
    if (page === 'all') {
      cars = await Car.findAll();
    } else {
      if (page < 1 || size < 1) {
        return this.badRequest(res, 'page number or page size was wrong!');
      }
      const options = { where: {} };
      if (search) {
        options.where.name = { [Op.like]: `%${search || ''}%` };
      }

      if (classFactory && classFactory !== 'undefined') {
        options.where.classFactory = {};
        options.where.classFactory[Op.or] = convertStrToArr(classFactory).map((x) => ({ [Op.eq]: x }));
      }

      if (saleStatus && saleStatus !== 'undefined') {
        options.where.saleStatus = saleStatus;
      }
      if (currentDrop === 'true') {
        const setting = await GlobalSetting.findOne({ where: { settingName: 'currentDropNumber' } });
        options.where.dropNumber = setting.settingNumber;
      }
      if (modelFactory && modelFactory !== 'undefined') {
        options.where.modelFactory = {};
        options.where.modelFactory[Op.or] = convertStrToArr(modelFactory).map((x) => ({ [Op.eq]: x }));
      }

      cars = await Car.findAndCountAll({
        ...options,
        ...paginate(parseInt(page - 1, 10), parseInt(size, 10)),
        include: +saleStatus === 1 && [
          {
            model: Transaction,
            as: 'transaction',
            where: {
              saleStart: {
                [Op.lt]: new Date(),
              },
            },
          },
        ],
      });
    }
    return this.success(res, { ...cars, page: parseInt(page, 10) });
  };

  getCarById = async (req, res) => {
    const { carId } = req.params;
    const car = await Car.findByPk(carId, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['username'],
        },
      ],
    });
    return this.success(res, car);
  };

  getUserCars = async (req, res) => {
    // TODO: define relationship?
    const { page = 1, size = 'all' } = req.query;
    let query = {};

    if (size !== 'all') {
      if (page < 1 || size < 1) {
        return this.badRequest(res, 'page number or page size was wrong!');
      }
      query = paginate(page - 1, size);
    }
    const { publicAddress } = req.user;

    let cars = [];
    if (publicAddress) {
      cars = await Car.findAndCountAll({
        where: {
          ethAddress: process.env?.TEST_ETH_ADDRESS || publicAddress,
        },
        ...query,
      });
    }

    return this.success(res, { ...cars, page: parseInt(page, 10) });
  };

  getSelectedCar = async (req, res) => {
    const { userId } = req.params;
    const { publicAddress } = req.user;

    const userInfo = await User.findOne({ where: { id: userId, publicAddress } });
    let car;

    if (!isEmpty(userInfo) && userInfo?.selectedCar) {
      car = await Car.findByPk(userInfo?.selectedCar);
    } else {
      car = await Car.findOne({
        where: {
          ethAddress: publicAddress,
        },
      });

      if (car) {
        await User.update({ selectedCar: car.id }, { where: { publicAddress } });
      }
    }

    if (car) return this.success(res, car);
    return this.noContent(res);
  };

  update = async (req, res) => {
    const { carId } = req.params;
    const { name } = req.body;
    const { publicAddress } = req.user;

    const carInfo = await Car.findOne({ where: { name } });

    if (carInfo) {
      return this.badRequest(res, { error: 'That name is already taken.' });
    }

    await Car.update({ name }, { where: { id: carId, ethAddress: publicAddress } });
    const car = await Car.findByPk(carId);

    if (publicAddress.toLowerCase() !== car.ethAddress.toLowerCase()) {
      return this.unAuthorized(res, {
        error: "You don't have permission",
      });
    }
    return this.success(res, car);
  };

  ownerUpdate = (owners) => {
    const oldOwerList = myCache.get('owners') || [];
    const newUpdates = differenceBy(owners, oldOwerList, ({ ethAddress }) => ethAddress).filter(({ id }) => id);

    if (isEmpty(newUpdates)) {
      console.info('There is no updates in car ownership');
      return;
    }

    Car.bulkCreate(newUpdates, { updateOnDuplicate: ['ethAddress'] })
      .then(() => {
        myCache.set('owners', owners);
        console.info(`Updated ownership in ${newUpdates?.length} cars`);
      })
      .catch(() => console.error('Failed to update car onwership'));
  };

  checkCarName = async (req, res) => {
    const { name } = req.params;
    const carInfo = await Car.findOne({ where: { name } });
    if (carInfo) {
      return this.badRequest(res, { error: 'That name is already taken.' });
    }
    return this.success(res, { isCarNameValid: true });
  };
}
