module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn("DropLimits", "dropLimitType", {
    type: Sequelize.ENUM,
    values: ["car", "gasstation", "racetrackland", "mechanicshop"],
  }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn("DropLimits", "dropLimitType", {
    type: Sequelize.ENUM,
    values: ["car", "gasstation"],
  }),
};
