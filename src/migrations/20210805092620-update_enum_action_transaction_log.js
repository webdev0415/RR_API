module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn("TransactionLogs", "action", {
    type: Sequelize.ENUM,
    values: ["buy attempt", "buy started", "payment received", "asset sent", "hold time expired", "buy cancelled"],
  }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn("TransactionLogs", "action", {
    type: Sequelize.ENUM,
    values: ["buy attempt", "buy started", "payment received", "asset sent", "hold time expired"],
  }),
};
