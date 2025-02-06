const express = require("express");
const employeeUtil = require('../modules/employee-util');

const router = express.Router();

router.get('/', (req, res) => {
    res.render("general/home", {
        employees: employeeUtil.getAllEmployees(),
        title: "Employees"
    });
});

router.get('/about', (req, res) => {
    res.render("general/about", {
        title: "About Us"
    });
});

module.exports = router;