

module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn("Cars", "saleCurrentTransactionId", {
      type: Sequelize.UUID,
      allowNull: true,
    }),
    queryInterface.changeColumn("Transactions", "transactionId", {
      type: Sequelize.UUID,
      allowNull: true,
    }),
    queryInterface.changeColumn("Gasstations", "saleCurrentTransactionId", {
      type: Sequelize.UUID,
      allowNull: true,
    }),
  ]),

  down: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn("Cars", "saleCurrentTransactionId", {
      type: Sequelize.STRING,
      allowNull: true,
    }),
    queryInterface.changeColumn("Transactions", "transactionId", {
      type: Sequelize.STRING,
      allowNull: true,
    }),
    queryInterface.changeColumn("Gasstations", "saleCurrentTransactionId", {
      type: Sequelize.STRING,
      allowNull: true,
    }),
  ]),
};
