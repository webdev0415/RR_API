module.exports = {
  up: async (queryInterface) => queryInterface.removeColumn("Cars", "initialPrice"),

  down: async (queryInterface, Sequelize) => queryInterface.addColumn("Cars", "initialPrice", {
    type: Sequelize.DECIMAL(36, 18),
  }),
};
