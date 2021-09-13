const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Transaction.init(
    {
      transactionId: {
        type: DataTypes.UUID,
        unique: true,
      },
      assetId: DataTypes.INTEGER,
      assetType: {
        type: DataTypes.ENUM,
        values: ["car", "gasstation", "racetrackland", "mechanicshop"],
      },
      saleType: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      saleStart: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      saleEnd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      saleStartTimeStamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      sellerEthAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      buyerEthAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      privateSaleBuyerEthAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      saleCurrency: {
        type: DataTypes.ENUM,
        values: ["ETH", "RIOT"],
      },
      salePrice: DataTypes.DECIMAL(36, 18),
      saleDate: DataTypes.DATE,
      lastTransactionHash: DataTypes.STRING,
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
      modelName: "Transaction",
    },
  );
  return Transaction;
};
