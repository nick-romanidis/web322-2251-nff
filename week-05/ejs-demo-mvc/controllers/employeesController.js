const express = require("express");
const employeeUtil = require('../modules/employee-util');

const router = express.Router();

router.get('/', (req, res) => {
    res.render("employees/list", {
        employees: employeeUtil.getAllEmployees(),
        title: "Employees"
    });
});

router.get('/visible', (req, res) => {
    res.render("employees/list", {
        employees: employeeUtil.getVisibleEmployees(),
        title: "Employees"
    });
});


module.exports = router;