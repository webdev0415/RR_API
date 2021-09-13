

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      transactionId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      assetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      assetType: {
        type: Sequelize.ENUM,
        values: ["car", "gasstation"],
      },
      saleType: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      saleStart: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      saleEnd: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      saleStartTimeStamp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sellerEthAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      buyerEthAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      privateSaleBuyerEthAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      saleCurrency: {
        type: Sequelize.ENUM,
        values: ["ETH", "RIOT"],
      },
      salePrice: {
        type: Sequelize.FLOAT,
      },
      saleDate: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Transactions");
  },
};
