'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User_ques,profile_s}) {
      // define association here
      this.belongsToMany(User_ques,{through:"Ques_Users",foreignKey:'UserId'})
      this.hasOne(profile_s,{foreignKey:'userId'})
    }
  };
  User.init({
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    tableName:'Users',
    modelName: 'User',
  });
  return User;
};