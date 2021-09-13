const dataJson = require("../data/database");

const gasstation = Object.entries(dataJson)
  .filter(([key]) => key.indexOf("gs") === 0)
  .map(([_, data], index) => ({ id: index + 1, ...data }));

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert("Gasstations", gasstation, {}),

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete("Gasstations", null, {}),
};
