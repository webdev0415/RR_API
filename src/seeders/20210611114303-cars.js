

const dataJson = require("../data/database");

const cars = Object.entries(dataJson)
  .map(([key, data]) => ({ id: key, ...data }))
  .filter(({ id }) => id.indexOf("gs"));

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert("Cars", cars, {}),

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete("Cars", null, {}),
};
