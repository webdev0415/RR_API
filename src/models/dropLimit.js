const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DropLimit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DropLimit.init(
    {
      dropLimitType: {
        type: DataTypes.ENUM,
        values: ["car", "gasstation", "racetrackland", "mechanicshop"],
      },
      dropNumber: DataTypes.INTEGER,
      dropItemLimit: DataTypes.INTEGER,
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
      modelName: "DropLimit",
    },
  );
  return DropLimit;
};
