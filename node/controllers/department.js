const departmentModel = require("../models").Employeedepartment;

exports.getDepartments = async (req, res) => {
  try {
    const department = await departmentModel.findAll();
    res.status(200).json(department);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.createDepartment = async (req, res) => {
  try {
    const result = await departmentModel.create({
      department: req.body.department,
    });
    res.status(200).json({ result_message: "Added department details" });
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await departmentModel.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ result_message: "Deleted department details" });
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.updateDepartment = async (req, res) => {
  try {
    const result = await departmentModel.update(
      { department: req.body.department },
      { where: { id: req.params.id } }
    );
    res.status(200).json({ result_message: "Updated department details" });
  } catch (err) {
    res.status(500).json(err);
  }
};
