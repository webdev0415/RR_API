

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.query("insert into globalsettings (settingName, settingDescription, settingNumber) values ('timeToCompletePayment','Amount of time, in seconds, a user has to complete payment for an asset.', 180)", {
    type: Sequelize.QueryTypes.INSERT,
  }),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.query("delete from globalsettings where settingName IN ('timeToCompletePayment')", {
    type: Sequelize.QueryTypes.DELETE,
  }),
};
