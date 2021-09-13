const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TransactionLog extends Model {
    static associate(models) {
      // define association here
    }
  }
  TransactionLog.init(
    {
      ethAddress: DataTypes.STRING,
      transactionHash: DataTypes.STRING,
      assetType: {
        type: DataTypes.ENUM,
        values: ["car", "gasstation", "racetrackland", "mechanicshop"],
      },
      timeStamp: DataTypes.DATE,
      assetID: DataTypes.INTEGER,
      toAddress: DataTypes.STRING,
      price: DataTypes.DECIMAL(36, 18),
      asset: {
        type: DataTypes.ENUM,
        values: ["ETH", "RIOT", "WETH", "USD"],
      },
      action: {
        type: DataTypes.ENUM,
        values: ["buy attempt", "buy started", "payment received", "asset sent", "hold time expired", "buy cancelled"],
      },
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
      modelName: "TransactionLog",
    },
  );
  return TransactionLog;
};
