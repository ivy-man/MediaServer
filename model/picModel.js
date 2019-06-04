const Sequelize = require('sequelize');

module.exports = class Pic extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      url: Sequelize.STRING,
      name: Sequelize.STRING,
      imageID: Sequelize.STRING,
      ownerResourceUUID: Sequelize.UUID,
      createdAt: Sequelize.DATE,
    }, { sequelize, modelName: 'pics' });
  }
};
