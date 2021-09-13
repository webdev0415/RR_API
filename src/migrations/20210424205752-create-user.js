module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING(30),
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      nonce: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      publicAddress: {
        type: Sequelize.STRING,
        unique: true,
      },
      garageName: {
        type: Sequelize.STRING(100),
      },
      gasBalance: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      selectedCar: {
        type: Sequelize.INTEGER,
      },
      picture: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("Users");
  },
};
