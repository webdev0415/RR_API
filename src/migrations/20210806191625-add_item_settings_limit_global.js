module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize.query(
      "insert into globalsettings (settingName, settingDescription, settingNumber) values ('cartCarLimit','Max Car Limit In Cart', 3)",
      {
        type: Sequelize.QueryTypes.INSERT,
      },
    ),
    queryInterface.sequelize.query(
      "insert into globalsettings (settingName, settingDescription, settingNumber) values ('cartStationLimit','Max Gasstation Limit In Cart', 3)",
      {
        type: Sequelize.QueryTypes.INSERT,
      },
    ),
  ]),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.query("delete from globalsettings where settingName IN ('cartCarLimit','cartStationLimit')", {
    type: Sequelize.QueryTypes.DELETE,
  }),
};
