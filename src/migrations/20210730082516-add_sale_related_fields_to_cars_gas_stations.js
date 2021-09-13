module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn("Cars", "saleLastCurrency", {
      type: Sequelize.ENUM,
      values: ["ETH", "RIOT", "WETH", "USD"],
    }),
    queryInterface.addColumn("Cars", "saleLastPrice", {
      type: Sequelize.FLOAT,
    }),
    queryInterface.addColumn("Cars", "saleLastDate", {
      type: Sequelize.DATE,
    }),
    queryInterface.addColumn("Gasstations", "saleLastCurrency", {
      type: Sequelize.ENUM,
      values: ["ETH", "RIOT", "WETH", "USD"],
    }),
    queryInterface.addColumn("Gasstations", "saleLastPrice", {
      type: Sequelize.FLOAT,
    }),
    queryInterface.addColumn("Gasstations", "saleLastDate", {
      type: Sequelize.DATE,
    }),
  ]),

  down: async (queryInterface) => Promise.all([
    queryInterface.removeColumn("Cars", "saleLastCurrency"),
    queryInterface.removeColumn("Cars", "saleLastPrice"),
    queryInterface.removeColumn("Cars", "saleLastDate"),
    queryInterface.removeColumn("Gasstations", "saleLastCurrency"),
    queryInterface.removeColumn("Gasstations", "saleLastPrice"),
    queryInterface.removeColumn("Gasstations", "saleLastDate"),
  ]),
};
