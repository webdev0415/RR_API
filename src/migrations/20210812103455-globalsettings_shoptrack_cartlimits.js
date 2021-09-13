

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.query("insert into globalsettings (settingName, settingDescription, settingNumber) values ('cartTrackLimit', 'The max number of race track lands in a cart', 3), ('cartShopLimit', 'The max number of mechanic shops in a cart', 1)", {
    type: Sequelize.QueryTypes.INSERT,
  }),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.query("delete from globalsettings where settingName IN ('cartShopLimit', 'cartTrackLimit')", {
    type: Sequelize.QueryTypes.DELETE,
  }),
};
