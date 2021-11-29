'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profile_s extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
      this.belongsTo(User,{foreignKey:"userId"})
    }
  };
  profile_s.init({
    answered:DataTypes.INTEGER,
    total:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'profile_s',
  });
  return profile_s;
};