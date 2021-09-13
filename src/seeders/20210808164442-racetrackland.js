const dataJson = require("../data/database");

const lands = Object.entries(dataJson)
  .filter(([key]) => key.indexOf("tl") === 0)
  .map(([_, data], index) => ({ id: index + 1, ...data }));

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert("RacetrackLands", lands, {}),

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete("RacetrackLands", null, {}),
};
