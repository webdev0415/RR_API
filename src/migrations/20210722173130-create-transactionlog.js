

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("TransactionLogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      timeStamp: {
        type: Sequelize.DATE,
      },
      ethAddress: {
        type: Sequelize.STRING,
      },
      assetType: {
        type: Sequelize.ENUM,
        values: ["car", "gasstation", "racetrackland"],
      },
      assetID: {
        type: Sequelize.INTEGER,
      },
      action: {
        type: Sequelize.ENUM,
        values: ["buy attempt", "buy started", "payment received", "asset sent", "hold time expired"],
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
    await queryInterface.dropTable("TransactionLogs");
  },
};

