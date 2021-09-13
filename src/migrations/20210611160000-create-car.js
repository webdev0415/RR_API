

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Cars", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      ethAddress: {
        type: Sequelize.STRING,
      },
      initialPrice: {
        type: Sequelize.FLOAT,
      },
      collection: {
        type: Sequelize.STRING,
      },
      classCurrent: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      classFactory: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      modelFactory: {
        type: Sequelize.STRING,
      },
      colorCurrent: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      colorStock: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      carRating: {
        type: Sequelize.INTEGER,
      },
      experiencePoints: {
        type: Sequelize.INTEGER,
      },
      engineLevel: {
        type: Sequelize.INTEGER,
      },
      tiresLevel: {
        type: Sequelize.INTEGER,
      },
      NOSSystem: {
        type: Sequelize.INTEGER,
      },
      supercharger: {
        type: Sequelize.INTEGER,
      },
      dualExhaust: {
        type: Sequelize.INTEGER,
      },
      driveTrainUpgrade: {
        type: Sequelize.INTEGER,
      },
      performanceChip: {
        type: Sequelize.INTEGER,
      },
      winPercentage: {
        type: Sequelize.FLOAT,
      },
      image: {
        type: Sequelize.STRING,
      },
      animation_url: {
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
    await queryInterface.dropTable("Cars");
  },
};
