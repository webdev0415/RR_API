const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Transaction, {
        foreignKey: "saleCurrentTransactionId",
        targetKey: "transactionId",
        as: "transaction",
      });

      this.belongsTo(models.User, { foreignKey: "ethAddress", targetKey: "publicAddress", as: "owner" });
      // define association here
    }
  }
  Car.init(
    {
      name: DataTypes.STRING,
      ethAddress: DataTypes.STRING,
      collection: DataTypes.STRING,
      classCurrent: DataTypes.STRING,
      classFactory: DataTypes.STRING,
      colorCurrent: DataTypes.STRING,
      colorStock: DataTypes.STRING,
      carRating: DataTypes.INTEGER,
      dropNumber: DataTypes.INTEGER,
      experiencePoints: DataTypes.INTEGER,
      engineLevel: DataTypes.INTEGER,
      tiresLevel: DataTypes.INTEGER,
      modelFactory: DataTypes.STRING,
      NOSSystem: DataTypes.INTEGER,
      supercharger: DataTypes.INTEGER,
      dualExhaust: DataTypes.INTEGER,
      driveTrainUpgrade: DataTypes.INTEGER,
      performanceChip: DataTypes.INTEGER,
      winPercentage: DataTypes.FLOAT,
      image: DataTypes.STRING,
      animation_url: DataTypes.STRING,
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
    },
    {
      sequelize,
      modelName: "Car",
    },
  );
  return Car;
};
