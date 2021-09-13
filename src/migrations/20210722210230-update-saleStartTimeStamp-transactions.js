

module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn("Transactions", "saleStartTimeStamp", {
      type: Sequelize.DATE,
    }),
  ]),

  down: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn("Transactions", "saleStartTimeStamp"),
  ]),
};
