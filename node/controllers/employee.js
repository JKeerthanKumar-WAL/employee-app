const { body, validationResult } = require("express-validator");
const employeeModel = require("../models").Employee;
const departmentModel = require("../models").Employeedepartment;
const multer = require("multer");

let imageName = null;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    imageName = Date.now() + "-" + file.originalname;
    cb(null, imageName);
  },
});
const upload = multer({
  storage: storage,
  limits: { fieldNameSize: 1000, fileSize: 102400000 },
  fileFilter: (req, file, cb) => {
    console.log("File filter running..");
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png .jpg and .jpeg are allowed"));
    }
  },
});
exports.getEmployees = async (req, res) => {
  try {
    const employee = await employeeModel.findAll({
      include: departmentModel,
    });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.createEmployee = [
  upload.single("image"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Employee name is required")
    .isLength({ min: 3 })
    .withMessage("Lenth of the name should be atleast 3 characters")
    .isAlpha()
    .withMessage("Only alphabets are allowed"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email id is required")
    .isLength({ min: 5 })
    .withMessage("Length of the email should be atleast 5 characters"),
  body("employeeId")
    .trim()
    .notEmpty()
    .withMessage("Employee id is required")
    .isLength({ min: 3 })
    .withMessage("Length of the employee id should be atleast 3 characters")
    .isAlphanumeric()
    .withMessage("Only alphabets and numbers are allowed"),
  body("departmentId")
    .trim()
    .notEmpty()
    .withMessage("Department id is required")
    .isNumeric()
    .withMessage("Only numbers are allowed"),
  async (req, res) => {
    const { name, email, employeeId, departmentId, status } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ result_message: errors });
    } else {
      const checkDepartment = await departmentModel.findOne({
        where: { id: departmentId },
      });
      try {
        if (checkDepartment) {
          const checkEmail = await employeeModel.findOne({ where: { email } });
          if (checkEmail) {
            res.status(400).json({
              result_message: "Employee with this email already exists",
            });
          } else {
            try {
              const result = await employeeModel.create({
                name,
                email,
                image: `/uploads/${imageName}`,
                employeeId,
                departmentId,
                status,
              });
              res
                .status(200)
                .json({ result_message: "Added employee details" });
            } catch (err) {
              res.status(500).json(err);
            }
          }
        } else {
          res.status(404).json({ result_message: "No such department exists" });
        }
      } catch (err) {
        res.statu(500).json(err);
      }
    }
  },
];
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await employeeModel.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ result_message: "Deleted employee details" });
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.updateEmployee = [
  upload.single("image"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Employee name is required")
    .isLength({ min: 3 })
    .withMessage("Length of the name should be atleast 3 characters")
    .isAlpha()
    .withMessage("Only alphabets are allowed"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email id is required")
    .isLength({ min: 5 })
    .withMessage("Length of the email should be atleast 5 characters"),
  body("employeeId")
    .trim()
    .notEmpty()
    .withMessage("Employee id is required")
    .isLength({ min: 3 })
    .withMessage("Length of the employee id should be atleast 3 characters")
    .isAlphanumeric()
    .withMessage("Only alphabets and numbers are allowed"),
  body("departmentId")
    .trim()
    .notEmpty()
    .withMessage("Department id is required")
    .isNumeric()
    .withMessage("Only numbers are allowed"),
  async (req, res) => {
    const { name, email, employeeId, departmentId, status } = req.body;
    try {
      const checkEmployee = await employeeModel.findOne({
        where: { id: req.params.id },
      });
      if (checkEmployee) {
        const checkDepartment = await departmentModel.findOne({
          where: { id: departmentId },
        });
        if (checkDepartment) {
          const checkEmail = await employeeModel.findOne({ where: { email } });
          if (checkEmail) {
            res.status(400).json({
              result_message: "Employee with this email already exists",
            });
          } else {
            try {
              const result = await employeeModel.update(
                {
                  name,
                  email,
                  image: `/uploads/${imageName}`,
                  employeeId,
                  departmentId,
                  status,
                },
                { where: { id: req.params.id } }
              );
              res
                .status(200)
                .json({ result_message: "Updated employee details" });
            } catch (err) {
              res.status(500).json(err);
            }
          }
        } else {
          res.status(404).json({ result_message: "No such department exists" });
        }
      } else {
        res.status(404).json({ result_message: "Employee doesnot exist" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
];
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await employeeModel.findOne({
      where: { id: req.params.id },
    });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json(err);
  }
};
