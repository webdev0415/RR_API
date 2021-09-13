

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("MechanicShops", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ethAddress: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      collection: {
        type: Sequelize.STRING,
      },
      class: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      saleStatus: {
        type: Sequelize.SMALLINT,
        allowNull: true,
      },
      saleCurrentTransactionId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      saleLastCurrency: {
        type: Sequelize.ENUM,
        values: ["ETH", "RIOT", "WETH", "USD"],
      },
      saleLastPrice: {
        type: Sequelize.FLOAT,
      },
      saleLastDate: {
        type: Sequelize.DATE,
      },
      dropNumber: {
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
    await queryInterface.dropTable("MechanicShops");
  },
};
