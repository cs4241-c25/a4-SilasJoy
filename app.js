const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;


// MongoDB Connection
mongoose.connect("mongodb+srv://sidog2004:bw1j8t5f3RXeRB0w@testcluster.litrf.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

app.use(session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Configure Passport Local Strategy
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: "User not found" });
        }
        if (user.password !== password) {
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/data", async (req, res) => {
    try {
        // Make sure the user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'You must be logged in to view data' });
        }

        // Retrieve all entries for the authenticated user
        const entries = await Entry.find({ userID: req.user._id });

        // Send the entries as a JSON response
        res.status(200).json(entries);

    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ message: "Error retrieving data", error: err.message });
    }
});



app.post("/login", async (req, res, next) => {
    const { username, password } = req.body;

    try {
        // Try to find the user by username
        let user = await User.findOne({ username });

        if (!user) {
            // If user does not exist, create a new one
            user = new User({ username, password });

            // Save the new user to the database
            await user.save();
            console.log(`New user created: ${username}`);
        }

        passport.authenticate("local", (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ success: false, message: "Invalid username or password" });

            req.logIn(user, (err) => {
                if (err) return next(err);
                // Redirect to the index page
                res.json({ success: true, redirect: "/home.html" });
            });
        })(req, res, next);

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
const Entry = require('./public/js/mongoose');

app.post("/", async (req, res) => {
    try {
        const { chips, mult, stake, deck } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: 'You must be logged in to save data' });
        }

        // Calculate the score
        const score = chips * mult;

        const newEntry = new Entry({
            chips,
            mult,
            stake,
            deck,
            score,
            userID: req.user._id
        });

        await newEntry.save();

        console.log("Data saved:", newEntry);

        res.status(200).json({ message: "Data successfully saved" });

    } catch (err) {
        console.error("Error saving data:", err);
        res.status(500).json({ message: "Error saving data", error: err.message });
    }
});



// Logout Route
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.json({ message: "Logged out successfully" });
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
