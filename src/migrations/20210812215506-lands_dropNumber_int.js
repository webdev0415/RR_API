module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn("RacetrackLands", "dropNumber", {
    type: Sequelize.INTEGER,
    allowNull: true,
  }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn("RacetrackLands", "dropNumber", {
    type: Sequelize.STRING(255),
    allowNull: true,
  }),
};
