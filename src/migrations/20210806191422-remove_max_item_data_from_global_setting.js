module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.query("delete from GlobalSettings where settingName = 'maxItemsInCart'", {
    type: Sequelize.QueryTypes.DELETE,
  }),
  down: async (queryInterface, Sequelize) => queryInterface.sequelize.query(
    "insert into GlobalSettings (settingName, settingDescription, settingNumber) values ('maxItemsInCart','Max Items In Cart Per User', 3)",
    {
      type: Sequelize.QueryTypes.INSERT,
    },
  ),
};
