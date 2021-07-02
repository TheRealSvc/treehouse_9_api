'use strict';
const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  
class User extends Model {

  static associate(models) {
    // define association here
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      }
    });
  }
};
 
User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
   },
    firstName: {
      type: DataTypes.STRING, 
      allowNull: false,
      validate:{
        notEmpty:{
          args: true,
          msg: "the first name has to be provided" 
       }
      }
    }, 
    lastName: {
       type: DataTypes.STRING,
       allowNull: false,
       validate:{
        notEmpty:{
          args: true ,
          msg: "the last name has to be provided"
        }
      }
    },
    emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
         notEmpty:{
           args: true ,
           msg: "the email address has to be provided"
         }
       }
     }, 
     password: {
        type: DataTypes.STRING,  
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A password is required'
          },
          notEmpty: {
            msg: 'Please provide a password'
          },
          len: {
            args: [4, 20],
            msg: 'The password should be between 4 and 20 characters in length'
          }
        }
      },
  } , {
    sequelize,
    modelName: 'User',
});

  return User;
};