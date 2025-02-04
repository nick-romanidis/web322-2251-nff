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

app.get('/', (req, res) => {
    let employees = [
        {
            name: 'John',
            age: 23,
            occupation: 'Developer',
            company: 'Scotiabank',
            visible: true,
            imageUrl: "man1.jpg"
        },
        {
            name: 'Frank',
            age: 40,
            occupation: 'Manager',
            company: 'RBC',
            visible: false,
            imageUrl: "man3.jpg"
        },
        {
            name: 'Jane',
            age: 23,
            occupation: 'Manager',
            company: 'RBC',
            visible: true,
            imageUrl: "woman1.jpg"
        }
    ];

    res.render("home", {
        employees,
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