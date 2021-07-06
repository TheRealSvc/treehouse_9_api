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
      Course.belongsTo(models.User) ; // this automatically creates/uses an userId column in Course (see sequelize docu) 
      };
    }
  
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

  return Course;
};