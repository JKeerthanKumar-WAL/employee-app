"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employeedepartment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employeedepartment.hasMany(models.Employee, {
        foreignKey: "departmentId",
        as: "employees",
      });
    }
  }
  Employeedepartment.init(
    {
      department: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Employeedepartment",
    }
  );
  return Employeedepartment;
};
