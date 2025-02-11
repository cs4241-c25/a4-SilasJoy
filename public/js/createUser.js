const mongoose = require("mongoose");

// MongoDB Connection
mongoose.connect("mongodb+srv://sidog2004:bw1j8t5f3RXeRB0w@testcluster.litrf.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

// Function to create a user
async function createUser(username, password) {
    const newUser = new User({ username, password });

    try {
        await newUser.save();
        console.log("User created successfully!");
    } catch (error) {
        console.error("Error creating user:", error);
    } finally {
        mongoose.connection.close();
    }
}

// Example usage
createUser("testUser", "12345");
