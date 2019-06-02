const Sequelize = require('sequelize');

module.exports = class Pic extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      url: Sequelize.STRING,
      imageID: Sequelize.STRING,
      ownerResourceUUID: Sequelize.STRING,
      owner: Sequelize.INTEGER,
      createdAt: Sequelize.DATE,
    }, { sequelize, modelName: 'pics' });
  }
};
