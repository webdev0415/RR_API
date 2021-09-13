import BaseController from "../utils/baseController";
import { GlobalSetting } from "../models";

export default class SettingsController extends BaseController {
  getSettings = async (req, res) => {
    const settings = await GlobalSetting.findAll();
    return this.success(res, settings);
  };

  getSettingByName = async (req, res) => {
    const { name } = req.params;
    const setting = await GlobalSetting.findOne({ where: { settingName: name } });
    return this.success(res, setting);
  };
}
