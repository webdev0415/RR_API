
const {
  Model,
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Gasstation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Transaction, {
        foreignKey: "saleCurrentTransactionId",
        targetKey: "transactionId",
        as: "transaction",
      });

      this.belongsTo(models.User, { foreignKey: "ethAddress", targetKey: "publicAddress", as: "owner" });
    }
  }
  Gasstation.init({
    ethAddress: DataTypes.STRING,
    name: DataTypes.STRING,
    collection: DataTypes.STRING,
    image: DataTypes.STRING,
    dropNumber: DataTypes.INTEGER,
    saleStatus: DataTypes.SMALLINT,
    saleCurrentTransactionId: DataTypes.UUID,
    saleLastCurrency: {
      type: DataTypes.ENUM,
      values: ["ETH", "RIOT", "WETH", "USD"],
    },
    saleLastPrice: DataTypes.DECIMAL(36, 18),
    saleLastDate: DataTypes.DATE,
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
    modelName: "Gasstation",
  });
  return Gasstation;
};
