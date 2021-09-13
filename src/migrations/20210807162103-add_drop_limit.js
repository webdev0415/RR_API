module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize.query(
      "insert into DropLimits (dropLimitType, dropNumber, dropItemLimit) values ('car',1, 5)",
      {
        type: Sequelize.QueryTypes.INSERT,
      },
    ),
    queryInterface.sequelize.query(
      "insert into DropLimits (dropLimitType, dropNumber, dropItemLimit) values ('gasstation',1, 5)",
      {
        type: Sequelize.QueryTypes.INSERT,
      },
    ),
  ]),

  down: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize.query("delete from DropLimits where dropLimitType = 'car' AND dropNumber = 1", {
      type: Sequelize.QueryTypes.INSERT,
    }),
    queryInterface.sequelize.query("delete from DropLimits where dropLimitType = 'gasstation' AND dropNumber = 1", {
      type: Sequelize.QueryTypes.INSERT,
    }),
  ]),
};
