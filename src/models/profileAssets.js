
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProfileAssets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProfileAssets.init(
    {
      originalname: DataTypes.STRING,
      mimetype: DataTypes.STRING,
      fileId: DataTypes.STRING,
      size: DataTypes.FLOAT,
      uri: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
        onUpdate: sequelize.NOW,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProfileAssets",
    },
  );
  return ProfileAssets;
};
