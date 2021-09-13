const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsTo(models.ProfileAssets, { foreignKey: "picture", sourceKey: "id", as: "profile_picture" });
    }

    static getRelations() {
      const { models } = this.sequelize;
      return [
        {
          model: models.ProfileAssets,
          as: "profile_picture",
        },
      ];
    }

    static findRecord(where) {
      if (!where) {
        throw new Error("a condition required");
      }
      const relations = this.getRelations();
      return this.findOne({
        where,
        include: relations,
      });
    }

    static async updateAndRecordById(userId, data) {
      const relations = this.getRelations();
      await this.update(data, { where: { id: userId } });
      return this.findByPk(userId, { include: relations });
    }

    static async addLoginLog(userId) {
      const { models } = this.sequelize;
      return models.UserLog.create({ userId, logType: "login" });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING(30),
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      garageName: DataTypes.STRING(100),
      gasBalance: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      selectedCar: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      picture: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      nonce: {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: () => Math.floor(Math.random() * 1000000),
      },
      publicAddress: {
        type: DataTypes.STRING,
        unique: true,
        validate: { isLowercase: true },
      },
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
      modelName: "User",
    },
  );
  return User;
};
