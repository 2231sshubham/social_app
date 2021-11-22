'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mutual extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Mutual.init({
    requested_by: DataTypes.STRING,
    requested_to: DataTypes.STRING,
    status: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    sequelize,
    tableName:'Mutuals',
    modelName: 'Mutual',
  });
  return Mutual;
};