'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

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
         isEmail: {
           args: true,
           msg: "the provided email address seems not to be a valid email address"
          },  
         notEmpty:{
           args: true ,
           msg: "the email address has to be provided"
         }
       }
     }, 
     password: {
        type: DataTypes.STRING,  
        allowNull: false,
        set(val) {
            const hashedPassword = bcrypt.hashSync(val, 10);
            this.setDataValue('password', hashedPassword);
          },
        validate: {
          notNull: {
            msg: 'A password is required'
          },
          notEmpty: {
            msg: 'Please provide a password'
          }
        }
      },
  } , {
    sequelize,
    modelName: 'User',
});

  return User;
};