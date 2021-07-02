'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.User, {
        foreignKey: {
          fieldName: 'userId',
          allowNull: false,
        }
      });
    }
  };

  Course.init({
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
   },
    title: {
      type: DataTypes.STRING, 
      allowNull: false,
      validate:{
        notEmpty:{
          args: true,
          msg: "the title has to be provided" 
       }
      }
    }, 
    description: {
       type: DataTypes.TEXT,
       allowNull: false,
       validate:{
        notEmpty:{
          args: true ,
          msg: "a description has to be provided"
        }
      }
    },
    estimatedTime: {
        type: DataTypes.STRING 
      },
     materialsNeeded: {
        type: DataTypes.STRING
     }, 
  } , {
    sequelize,
    modelName: 'Course',
  });

  //Course.associate = (models) => {
  //  Course.belongsTo(models.User);
  //}  // makes sure to use a userId in Courses as the foreign-key to be used with the primary key (id) of Users. 1:1 means one row with userId belongs to one course
  
  return Course;
};