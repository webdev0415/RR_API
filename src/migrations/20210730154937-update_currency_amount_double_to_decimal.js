

module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn("Cars", "initialPrice", {
      type: Sequelize.DECIMAL(36, 18),
    }),
    queryInterface.changeColumn("Cars", "saleLastPrice", {
      type: Sequelize.DECIMAL(36, 18),
    }),
    queryInterface.changeColumn("Gasstations", "saleLastPrice", {
      type: Sequelize.DECIMAL(36, 18),
    }),
    queryInterface.changeColumn("Transactions", "salePrice", {
      type: Sequelize.DECIMAL(36, 18),
    }),
  ]),

  down: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn("Cars", "initialPrice", {
      type: Sequelize.FLOAT,
    }),
    queryInterface.changeColumn("Cars", "saleLastPrice", {
      type: Sequelize.FLOAT,
    }),
    queryInterface.changeColumn("Gasstations", "saleLastPrice", {
      type: Sequelize.FLOAT,
    }),
    queryInterface.changeColumn("Transactions", "salePrice", {
      type: Sequelize.FLOAT,
    }),
  ]),
};
