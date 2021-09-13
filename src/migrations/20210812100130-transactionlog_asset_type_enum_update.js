module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn("TransactionLogs", "assetType", {
    type: Sequelize.ENUM,
    values: ["car", "gasstation", "racetrackland", "mechanicshop"],
  }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn("TransactionLogs", "assetType", {
    type: Sequelize.ENUM,
    values: ["car", "gasstation", "racetrackland"],
  }),
};
