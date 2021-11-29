'use strict';
const {User,User_ques} = require('../models')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ques_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,User_ques}) {
      // define association here
      this.belongsTo(User,{foreignKey:'UserId'})
      this.belongsTo(User_ques,{foreignKey:'UserQueId'})
    }
  };
  Ques_user.init({
    UserId: {
      type: DataTypes.INTEGER,
    },
    user_quesId: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Ques_user',
  });
  return Ques_user;
};