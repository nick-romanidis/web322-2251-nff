const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const employeeUtil = require('./modules/employee-util');

const app = express();

// Set up "assets" folder so it is public
app.use(express.static(path.join(__dirname, "/assets")));

// Set up EJS
app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.use(expressLayouts);

app.get('/', (req, res) => {
    res.render("home", {
        employees: employeeUtil.getAllEmployees(),
        title: "Employees"
    });
});

app.get('/about', (req, res) => {
    res.render("about", {
        title: "About Us"
    });
});

const HTTP_PORT = process.env.PORT || 8080;

app.listen(HTTP_PORT, () => {
    console.log(`server listening on: ${HTTP_PORT}`);
});