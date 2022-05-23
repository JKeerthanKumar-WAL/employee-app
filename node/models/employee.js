"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.Employeedepartment, {
        foreignKey: "departmentId",
        onDelete: "CASCADE",
      });
    }
  }
  Employee.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      image: DataTypes.STRING,
      employeeId: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Employee",
    }
  );
  return Employee;
};
