

module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn("Cars", "saleStatus", {
      type: Sequelize.SMALLINT,
      allowNull: true,
    }),
    queryInterface.addColumn("Cars", "saleCurrentTransactionId", {
      type: Sequelize.STRING,
      allowNull: true,
    }),
  ]),

  down: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn("Cars", "saleStatus"),
    queryInterface.removeColumn("Cars", "saleCurrentTransactionId"),
  ]),
};


