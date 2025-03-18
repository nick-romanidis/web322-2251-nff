const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const path = require("path");

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

            // Create a unique name for the picture file, so that it can be stored on the web app.
            const profilePicFile = req.files.profilePic;
            const uniqueName = `profile-pic-${userSaved._id}${path.parse(profilePicFile.name).ext}`;

            // Copy the image data to a file on the file system.
            profilePicFile.mv(`assets/profile-pics/${uniqueName}`)
                .then(() => {
                    // Successful
                    console.log("Uploaded the profile pic.");

                    // Update the document so the profile pic is populated.
                    userModel.updateOne({
                        _id: userSaved._id
                    }, {
                        profilePic: uniqueName
                    })
                        .then(() => {
                            // Successfully updated the document.
                            console.log("Updated the user document");
                            res.redirect("/");
                        })
                        .catch(err => {
                            console.log("Error updating the user document: " + err);
                            res.redirect("/");
                        });
                })
                .catch(err => {
                    console.log("Error uploading the user profile pic: " + err);
                    res.redirect("/");
                });

            res.redirect("/");
        })
        .catch(err => {
            console.log(`Error adding user to the collection ... ${err}`);
            res.render("users/register");
        });
});

// Route to the registration page (GET)
router.get("/login", (req, res) => {
    res.render("users/login");
});

// Route to the registration page (POST)
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // TODO: Validate that they are entered.

    let errors = [];

    userModel.findOne({
        email
    })
        .then(user => {
            // Completed the search (succefully)

            if (user) {
                // Found the user document.
                // Compare the password submitted with the document.
                bcryptjs.compare(password, user.password)
                    .then(matched => {
                        // Done comparing the passwords.

                        if (matched) {
                            // Passwords match.

                            // Create a new session.
                            req.session.user = user;
                            console.log("User signed in");

                            res.redirect("/");
                        }
                        else {
                            // Passwords are different.
                            errors.push("The passwords did not match.");
                            console.log(errors[0]);
                            res.render("users/login", { errors });
                        }
                    })
            }
            else {
                // User document not found.
                errors.push("Couldn't find the email in the database");
                console.log(errors[0]);
                res.render("users/login", { errors });
            }
        })
        .catch(err => {
            // Not able to query the database.
            errors.push("Unable to query the database: " + err);
            console.log(errors[0]);
            res.render("users/login", { errors });
        });
});

router.get("/logout", (req, res) => {
    // Clear the session from memory.
    req.session.destroy();

    // Do NOT do this
    // req.session.user = null;

    res.redirect("/users/login");
});

module.exports = router;