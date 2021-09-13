

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.query(
    "insert into globalsettings (settingName, settingDescription, settingNumber) values ('maxItemsInCart','Max Items In Cart Per User', 3)",
    {
      type: Sequelize.QueryTypes.INSERT,
    },
  ),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.query("delete globalsettings where settingName = 'maxItemsInCart'", {
    type: Sequelize.QueryTypes.DELETE,
  }),
};
