var express = require("express");
var router = express.Router();
const employeeController = require("../controllers/employee");
router.get("/", employeeController.getEmployees);
router.post("/", employeeController.createEmployee);
router.delete("/:id", employeeController.deleteEmployee);
router.put("/:id", employeeController.updateEmployee);
router.get("/:id", employeeController.getEmployeeById);
module.exports = router;
