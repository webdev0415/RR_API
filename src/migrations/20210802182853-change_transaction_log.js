

module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn("TransactionLogs", "toAddress", {
      type: Sequelize.STRING,
    }),
    queryInterface.addColumn("TransactionLogs", "price", {
      type: Sequelize.DECIMAL(36, 18),
    }),
    queryInterface.addColumn("TransactionLogs", "asset", {
      type: Sequelize.ENUM,
      values: ["ETH", "RIOT", "WETH", "USD"],
    }),
  ]),

  down: async (queryInterface) => Promise.all([
    queryInterface.removeColumn("TransactionLogs", "toAddress"),
    queryInterface.removeColumn("TransactionLogs", "price"),
    queryInterface.removeColumn("TransactionLogs", "asset"),

  ]),
};


