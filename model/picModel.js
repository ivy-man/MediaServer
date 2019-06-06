const Sequelize = require('sequelize');

module.exports = class Pic extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      url: { type: Sequelize.STRING, allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      imageID: { type: Sequelize.STRING, primaryKey: true },
      ownerResourceUUID: { type: Sequelize.UUID, allowNull: false },
      createdAt: Sequelize.DATE,
    }, { sequelize, modelName: 'pics' });
  }
};
