
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ProfileAssets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      originalname: {
        type: Sequelize.STRING,
      },
      mimetype: {
        type: Sequelize.STRING,
      },
      fileId: {
        type: Sequelize.STRING,
      },
      size: {
        type: Sequelize.FLOAT,
      },
      uri: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("ProfileAssets");
  },
};
