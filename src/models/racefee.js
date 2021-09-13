const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RaceFee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RaceFee.init(
    {
      amount: DataTypes.INTEGER,
      raceId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      carId: DataTypes.INTEGER,
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
      modelName: "RaceFee",
    },
  );
  return RaceFee;
};
