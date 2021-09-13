const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class GlobalSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GlobalSetting.init(
    {
      settingName: DataTypes.STRING,
      settingDescription: DataTypes.TEXT,
      settingNumber: DataTypes.INTEGER,
      settingString: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
        onUpdate: sequelize.NOW,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "GlobalSetting",
    },
  );
  return GlobalSetting;
};
