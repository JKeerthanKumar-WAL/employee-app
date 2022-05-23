"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employeedepartment extends Model {
    static associate(models) {
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
