/* eslint-disable max-len */

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(`${__dirname}/../config/dbConfig.js`)[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// enable event_scheduler
// sequelize.query("SET GLOBAL event_scheduler = ON;");

sequelize.query("DROP EVENT IF EXISTS tsaleStartTimeStamp_event_10_S;");
sequelize.query(`CREATE EVENT IF NOT EXISTS tsaleStartTimeStamp_event_10_S
ON SCHEDULE EVERY 10 SECOND
STARTS CURRENT_TIMESTAMP
DO
  BEGIN
    START TRANSACTION; 
      UPDATE cars SET saleStatus = 1 
        WHERE saleStatus = 2 
        AND saleCurrentTransactionId IN (SELECT transactionId FROM transactions WHERE saleStartTimeStamp < NOW() - INTERVAL (SELECT settingNumber FROM globalsettings WHERE settingName = 'timeToCompletePayment') SECOND AND assetType = 'car');
      UPDATE Gasstations SET saleStatus = 1 
        WHERE saleStatus = 2 
        AND saleCurrentTransactionId IN (SELECT transactionId FROM transactions WHERE saleStartTimeStamp < NOW() - INTERVAL (SELECT settingNumber FROM globalsettings WHERE settingName = 'timeToCompletePayment') SECOND AND assetType = 'gasstation');
      INSERT INTO transactionlogs (timeStamp, ethAddress, assetType, assetID, action, toAddress) 
        SELECT Now(),buyerEthAddress, assetType, assetId, "hold time expired", sellerEthAddress
        FROM transactions where saleStartTimeStamp < NOW() - INTERVAL (SELECT settingNumber FROM globalsettings WHERE settingName = 'timeToCompletePayment') SECOND;
      UPDATE transactions SET saleStartTimeStamp = NULL
       WHERE saleStartTimeStamp < NOW() - INTERVAL (SELECT settingNumber FROM globalsettings WHERE settingName = 'timeToCompletePayment') SECOND;
      COMMIT;
  END`);
// removed one
// UPDATE transactions SET saleStartTimeStamp = "", buyerEthAddress=""
// WHERE saleStartTimeStamp < NOW() - INTERVAL (SELECT settingNumber FROM globalsettings WHERE settingName = 'timeToCompletePayment') SECOND;

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
  .forEach((file) => {
    /* eslint-disable-next-line global-require */
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;
