var express = require("express");
var router = express.Router();
const employeeController = require("../controllers/employee");
const authenticationMiddleware = require("../middlewares/authentication");
router.get("/", [authenticationMiddleware, employeeController.getEmployees]);
router.post("/", [authenticationMiddleware, employeeController.createEmployee]);
router.delete("/:id", [
  authenticationMiddleware,
  employeeController.deleteEmployee,
]);
router.put("/:id", [
  authenticationMiddleware,
  employeeController.updateEmployee,
]);
router.get("/:id", [
  authenticationMiddleware,
  employeeController.getEmployeeById,
]);
module.exports = router;
