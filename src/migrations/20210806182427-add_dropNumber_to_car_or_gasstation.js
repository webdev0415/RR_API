module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn("Cars", "dropNumber", {
      type: Sequelize.INTEGER,
    }),
    queryInterface.addColumn("Gasstations", "dropNumber", {
      type: Sequelize.INTEGER,
    }),
  ]),

  down: async (queryInterface) => Promise.all([
    queryInterface.removeColumn("Cars", "dropNumber"),
    queryInterface.removeColumn("Gasstations", "dropNumber"),
  ]),
};
