const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');


const app = express();

// Set up "assets" folder so it is public
app.use(express.static(path.join(__dirname, "/assets")));

// Set up EJS
app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.use(expressLayouts);

// Load the controllers into express
const generalController = require("./controllers/generalController");
const employeesController = require("./controllers/employeesController");

app.use("/", generalController);
app.use("/employees", employeesController);


const HTTP_PORT = process.env.PORT || 8080;

app.listen(HTTP_PORT, () => {
    console.log(`server listening on: ${HTTP_PORT}`);
});