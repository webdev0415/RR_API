module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("DropLimits", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dropLimitType: {
        type: Sequelize.ENUM,
        values: ["car", "gasstation"],
      },
      dropNumber: Sequelize.INTEGER,
      dropItemLimit: Sequelize.INTEGER,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("DropLimits");
  },
};
