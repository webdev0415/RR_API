

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("GlobalSettings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      settingName: {
        type: Sequelize.STRING,
      },
      settingDescription: {
        type: Sequelize.TEXT,
      },
      settingNumber: {
        type: Sequelize.INTEGER,
      },
      settingString: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("GlobalSettings");
  },
};
