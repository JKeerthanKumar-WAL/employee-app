const departmentModel = require("../models").Employeedepartment;

exports.getDepartments = async (req, res) => {
  await departmentModel.findAll().then((department) => {
    res.status(200).json(department);
  }),
    (err) => {
      res.status(500).json(err);
    };
};
exports.createDepartment = async (req, res) => {
  await departmentModel
    .create({ department: req.body.department })
    .then((result) => {
      res
        .status(200)
        .json({ status: 1, debug_data: "Added department details" });
    }),
    (err) => {
      res.status(500).json(err);
    };
};
exports.deleteDepartment = async (req, res) => {
  await departmentModel
    .destroy({ where: { id: req.params.id } })
    .then((department) => {
      res
        .status(200)
        .json({ status: 1, debug_data: "Deleted department details" });
    }),
    (err) => {
      res.status(500).json(err);
    };
};
exports.updateDepartment = async (req, res) => {
  await departmentModel
    .update(
      { department: req.body.department },
      { where: { id: req.params.id } }
    )
    .then((result) => {
      res
        .status(200)
        .json({ status: 1, debug_data: "Updated department details" });
    }),
    (err) => {
      res.status(500).json(err);
    };
};
