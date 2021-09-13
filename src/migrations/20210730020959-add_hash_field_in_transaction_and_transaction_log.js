

module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn("Transactions", "lastTransactionHash", {
      type: Sequelize.STRING,
    }),
    queryInterface.addColumn("TransactionLogs", "transactionHash", {
      type: Sequelize.STRING,
    }),
  ]),

  down: async (queryInterface) => Promise.all([
    queryInterface.removeColumn("Transactions", "lastTransactionHash"),
    queryInterface.removeColumn("TransactionLogs", "transactionHash"),
  ]),
};


