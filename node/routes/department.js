var express = require("express");
var router = express.Router();
const departmentController = require("../controllers/department");
router.get("/", departmentController.getDepartments);
router.post("/", departmentController.createDepartment);
router.delete("/:id", departmentController.deleteDepartment);
router.put("/:id", departmentController.updateDepartment);
module.exports = router;
