const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");

// Route to the registration page (GET)
router.get("/register", (req, res) => {
    res.render("users/register");
});

// Route to the registration page (POST)
router.post("/register", (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    
    // TODO: Validate the information entered is correct.

    // TODO: On the assignment, first check if the email already exists for a document.
    // WARNING: Do not throw/show any error if a duplicate email is attempted to be added.
    //          Rather, show a friendly error message in the registration form.

    const newUser = new userModel({
        firstName,
        lastName,
        email,
        password
    });

    newUser.save()
        .then(userSaved => {
            console.log(`User ${userSaved.firstName} has been added to the collection`);
            res.redirect("/");
        })
        .catch(err => {
            console.log(`Error adding user to the collection ... ${err}`);
            res.render("users/register");
        });
});

module.exports = router;