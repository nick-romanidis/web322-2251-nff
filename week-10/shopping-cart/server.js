const path = require("path");
const express = require("express");
const session = require("express-session");

const app = express();

// Set up EJS
// Notice this is slightly different than other code examples. We are not using a main
// layout file and do not need express-ejs-layouts.
app.set('view engine', 'ejs');

// Set up express-session
// Remember to use dotenv to secure the secret.
app.use(session({
    secret: "this_is_a_secret",
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    // res.locals.user is a global EJS variable.
    // This means that every single EJS file can access this variable.
    res.locals.user = req.session.user;
    next();
});

// Set up a faux song database.
const songs = [
    {
        id: 1,
        name: "Life Goes On",
        artist: "BTS",
        price: 0.99
    },
    {
        id: 2,
        name: "Mood",
        artist: "24kGoldn Featuring Ian Dior",
        price: 0.50
    },
    {
        id: 3,
        name: "Positions",
        artist: "Ariana Grande",
        price: 0.99
    }
];

// Find a song from the faux database.
const findSong = function (id) {
    return songs.find(song => {
        return song.id == id;
    });
};

// Define a function to prepare the view model and return a response.
const VIEW_NAME = "musicstore";

const prepareView = function (req, res, message) {
    let viewModel = {
        message,
        hasSongs: false,
        cartTotal: 0,
        songs: []
    };

    if (req.session && req.session.user) {
        // The user is signed in (and a session is established).

        // Get the shopping cart from the session.
        const cart = req.session.cart || [];

        // Check if the cart has songs.
        viewModel.hasSongs = cart.length > 0;

        // If there are songs in the cart, then calculate the order total.
        let cartTotal = 0;

        cart.forEach(cartSong => {
            cartTotal += cartSong.song.price * cartSong.qty;
        });

        viewModel.cartTotal = cartTotal;
        viewModel.songs = cart;
    }

    res.render(VIEW_NAME, viewModel);
}

// Route to the home page:
app.get("/", (req, res) => {
    prepareView(req, res);
});

// Route to add a new song to the cart.
// The ID of the song will be specified as part of the URL.
app.get("/add-song/:id", (req, res) => {

    let message;

    // Parse the ID of the song.
    const songId = parseInt(req.params.id);

    // Check if the user is signed in.
    if (req.session.user) {
        // The user is signed in.

        // Make sure the shopping cart exists and if not
        // add a new empty array to the session.
        let cart = req.session.cart = req.session.cart || [];

        // A shopping cart object will look like this:
        //    id: The ID of the song (number)
        //    qty: The number of licenses to purchase (number)
        //    song: The details about the song (for displaying in the cart)

        let song = findSong(songId);

        if (song) {
            // Song found in the database.

            // Search the shopping cart to see if the song is already added.
            let found = false;

            cart.forEach(cartSong => {
                if (cartSong.id == songId) {
                    // Song is already in the shopping cart.
                    found = true;
                    cartSong.qty++;
                }
            });

            if (found) {
                // Song was found in the cart, already incremented the quantity.
                message = `The song "${song.name}" was already added to the cart, incremented the quantity.`;
            }
            else {
                // Create a new cart object and add it to the shopping cart.
                cart.push({
                    id: songId,
                    qty: 1,
                    song
                });

                // Add logic to sort the cart (by artist name);
                cart.sort((a, b) => a.song.artist.localeCompare(b.song.artist));

                message = `The song "${song.name}" was added to the cart.`;
            }
        }
        else {
            // Song was not found in the database.
            message = "the song was not found in the database.";
        }
    }
    else {
        // The user is not signed in.
        message = "You must be logged in.";
    }

    prepareView(req, res, message);
});

// Route to add a remove song to the cart.
// The ID of the song will be specified as part of the URL.
app.get("/remove-song/:id", (req, res) => {

    let message;

    // Parse the ID of the song.
    const songId = parseInt(req.params.id);

    // Check if the user is signed in.
    if (req.session.user) {
        // The user is signed in.

        // Make sure the shopping cart exists.
        let cart = req.session.cart || [];

        // Find the index of the song in the shopping cart.
        const index = cart.findIndex(cartSong => cartSong.id == songId);

        if (index >= 0) {
            message = `Removed "${cart[index].song.name}" from the cart.`;

            // Song was found in the database.
            cart.splice(index, 1);
        }
        else {
            // Song was not found in the database.
            message = "The song was not found in the database.";
        }
    }
    else {
        // The user is not signed in.
        message = "You must be logged in.";
    }

    prepareView(req, res, message);
});

// Route to check-out the user
app.get("/check-out", (req, res) => {

    let message;

    // Check if the user is signed in.
    if (req.session.user) {
        // The user is signed in.

        // Check that the shopping cart is not empty.
        let cart = req.session.cart || [];

        if (cart.length > 0) {
            // Not empty

            // TODO: Send an email with the cart information.

            // Clear out the shopping cart BUT do not destroy it.
            // If you destroy the session the user is logged out.
            req.session.cart = [];

            message = "You have been checked out. You are still logged in, but something else!";
        }
        else {
            // Cart is empty.
            message = "The shopping cart is empty, buy something!";
        }
    }
    else {
        // The user is not signed in.
        message = "You must be logged in.";
    }

    prepareView(req, res, message);
});

// Route to login the user.
app.get("/login", (req, res) => {

    let message;

    // Check if the user is signed in.
    if (req.session.user) {
        // The user is already signed in.
        message = `${req.session.user.name} is already logged in.`;
    }
    else {
        // Create a new user object and start a new session.
        // This is normally pulled from the database (not hard-coded).
        req.session.user = {
            name: "Nick",
            vip: true
        };

        // Update the "user" global variable before rendering the view.
        // If we used res.redirect, this logic is not needed.
        res.locals.user = req.session.user;

        message = `${req.session.user.name} is now logged in.`
    }

    prepareView(req, res, message);
});

// Route to logout the user.
app.get("/logout", (req, res) => {

    let message;

    // Check if the user is signed in.
    if (req.session.user) {
        // The user is signed in.

        // Log out the user.
        req.session.destroy();

        // DO NOT DO THIS.
        // req.session.user = null;

        // Update the "user" global variable before rendering the view.
        // If we used res.redirect, this logic is not needed.
        res.locals.user = null;

        message = "User has been logged out.";
    }
    else {
        // The user is not signed in.
        message = "A user is not logged in.";
    }

    prepareView(req, res, message);
});

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
app.listen(HTTP_PORT, onHttpStart);