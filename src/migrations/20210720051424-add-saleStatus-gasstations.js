

module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn("Gasstations", "saleStatus", {
      type: Sequelize.SMALLINT,
      allowNull: true,
    }),
    queryInterface.addColumn("Gasstations", "saleCurrentTransactionId", {
      type: Sequelize.STRING,
      allowNull: true,
    }),
  ]),

  down: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn("Gasstations", "saleStatus"),
    queryInterface.removeColumn("Gasstations", "saleCurrentTransactionId"),
  ]),
};


