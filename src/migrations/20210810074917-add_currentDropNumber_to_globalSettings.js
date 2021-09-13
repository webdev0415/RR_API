

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.query("insert into globalsettings (settingName, settingDescription, settingNumber) values ('currentDropNumber','current drop number', 3)", {
    type: Sequelize.QueryTypes.INSERT,
  }),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.query("delete from globalsettings where settingName IN ('currentDropNumber')", {
    type: Sequelize.QueryTypes.DELETE,
  }),
};
