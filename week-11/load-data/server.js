const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

// Set up express.
const app = express();

// Fake database.
const namesToAdd = [
    { nickname: "Nick", fName: "Nicholas", lName: "Romanidis", age: 44 },
    { nickname: "Jane", fName: "Jane", lName: "Doe", age: 30 },
    { nickname: "John", fName: "Johnny", lName: "Smith", age: 35 }
];

// Define a schema and model.
const nameSchema = new mongoose.Schema({
    nickname: {
        type: String,
        unique: true
    },
    fName: String,
    lName: String,
    age: {
        type: Number,
        default: 25
    }
});

const nameModel = mongoose.model("names", nameSchema);

// Default home route.
app.get("/", (req, res) => {
    res.send("Ready to go...");
});

// Add a route to copy the data from the fake database to the MongoDB.
app.get("/load-data/names", (req, res) => {
    // Protect this route, so only "Data Clerks" are able to access.

    // if (req.session && req.session.user && req.session.isClerk) {
    //     // Clerk signed in.
    //     // We can load the data here.
    // }
    // else {
    //     // Customer or no-one is signed in.
    //     // Show an error page.
    //     res.status(401).render("message", { message: "You are not authorized." });
    // }

    nameModel.countDocuments()
        .then(count => {
            if (count === 0) {
                // There are no documents in the MongoDB, proceed.
                nameModel.insertMany(namesToAdd)
                    .then(() => {
                        // res.render("message", { message: "Success, data was loaded!" });
                        res.send("Success, data was loaded!");
                    })
                    .catch(err => {
                        // res.render("message", { message: "Couldn't insert the documents" });
                        res.send("Couldn't insert the documents: " + err);
                    });
            }
            else {
                // res.render("message", { message: "Documents already exist." });
                res.send("Documents already exist.");
            }
        })
        .catch(err => {
            // res.render("message", { message: "Couldn't count the documents" });
            res.send("Couldn't count the documents: " + err);
        });

})

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
// Connect to the MongoDB
mongoose.connect("mongodb+srv://dbUser:Password123@web322-cluster.cuqsx.mongodb.net/names-db?retryWrites=true&w=majority&appName=web322-cluster").then(() => {
    console.log("Connected to the MongoDB");
    app.listen(HTTP_PORT, onHttpStart);
});
