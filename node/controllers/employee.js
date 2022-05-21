const { body, validationResult } = require("express-validator");
const employeeModel = require("../models").Employee;
const departmentModel = require("../models").Employeedepartment;
const authenticationMiddleware = require("../middlewares/authentication");
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

exports.getEmployees = [
  authenticationMiddleware,
  async (req, res) => {
    try {
      const employee = await employeeModel.findAll({
        include: departmentModel,
      });
      res.status(200).json(employee);
    } catch (err) {
      res.status(500).json(err);
    }
  },
];
exports.createEmployee = [
  authenticationMiddleware,
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
      res.status(400).json({ debug_data: errors });
    } else {
      const checkDepartment = await departmentModel
        .findOne({
          where: { id: departmentId },
        })
        .catch((err) => res.status(400).json(err));
      if (checkDepartment) {
        const checkEmail = await employeeModel
          .findOne({ where: { email } })
          .catch((err) => {
            res.status(404).json({ debug_data: "Employee not found" });
          });
        if (checkEmail) {
          res.status(400).json({
            status: 0,
            debug_data: "Employee with this email already exists",
          });
        } else {
          employeeModel
            .create({
              name,
              email,
              image: `/uploads/${imageName}`,
              employeeId,
              departmentId,
              status,
            })
            .then((result) => {
              res
                .status(200)
                .json({ status: 1, debug_data: "Added employee details" });
            }),
            (err) => {
              res.status(500).json(err);
            };
        }
      } else {
        res
          .status(404)
          .json({ status: 0, debug_data: "No such department exists" });
      }
    }
  },
];
exports.deleteEmployee = [
  authenticationMiddleware,
  async (req, res) => {
    try {
      const employee = await employeeModel.destroy({
        where: { id: req.params.id },
      });
      res
        .status(200)
        .json({ status: 1, debug_data: "Deleted employee details" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
];
exports.updateEmployee = [
  authenticationMiddleware,
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
    const checkEmployee = await employeeModel
      .findOne({ where: { id: req.params.id } })
      .catch((err) => {
        res.status(404).json({ debug_data: "Employee doesnot exist" });
      });
    try {
      const checkDepartment = await departmentModel
        .findOne({
          where: { id: departmentId },
        })
        .catch((err) => res.status(400).json(err));
      if (checkDepartment) {
        const checkEmail = await employeeModel
          .findOne({ where: { email } })
          .catch((err) => {
            res.status(404).json({ debug_data: "Employee not found" });
          });
        if (checkEmail) {
          res.status(400).json({
            status: 0,
            debug_data: "Employee with this email already exists",
          });
        } else {
          await employeeModel
            .update(
              {
                name,
                email,
                image: `/uploads/${imageName}`,
                employeeId,
                departmentId,
                status,
              },
              { where: { id: req.params.id } }
            )
            .then((result) => {
              res
                .status(200)
                .json({ status: 1, debug_data: "Updated employee details" });
            }),
            (err) => {
              res.status(500).json(err);
            };
        }
      } else {
        res
          .status(404)
          .json({ status: 0, debug_data: "No such department exists" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
];
exports.getEmployeeById = [
  authenticationMiddleware,
  async (req, res) => {
    try {
      const employee = await employeeModel.findOne({
        where: { id: req.params.id },
      });
      res.status(200).json(employee);
    } catch (err) {
      res.status(500).json(err);
    }
  },
];
