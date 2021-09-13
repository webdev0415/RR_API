module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn("Transactions", "assetType", {
    type: Sequelize.ENUM,
    values: ["car", "gasstation", "racetrackland", "mechanicshop"],
  }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn("Transactions", "assetType", {
    type: Sequelize.ENUM,
    values: ["car", "gasstation"],
  }),
};
