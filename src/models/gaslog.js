
const {
  Model,
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class GasLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GasLog.init({
    amount: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    maticTransactionId: DataTypes.STRING,
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
  }, {
    sequelize,
    modelName: "GasLog",
  });
  return GasLog;
};
