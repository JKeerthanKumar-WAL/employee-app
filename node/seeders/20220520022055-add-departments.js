"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Employeedepartments",
      [
        {
          department: "Sales Executive",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          department: "Full Stack Developer",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          department: "Branch Manager",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          department: "Testing",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete("Employeedepartments", {
      [Op.or]: [
        { department: "Sales Executive" },
        { department: "Full Stack Developer" },
        { department: "Branch Manager" },
        { department: "Testing" },
      ],
    });
  },
};
