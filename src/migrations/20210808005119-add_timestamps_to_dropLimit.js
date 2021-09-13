module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn("DropLimits", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    }),
    queryInterface.addColumn("DropLimits", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    }),
  ]),

  down: async (queryInterface) => Promise.all([
    queryInterface.removeColumn("DropLimits", "createdAt"),
    queryInterface.removeColumn("DropLimits", "updatedAt"),
  ]),
};
