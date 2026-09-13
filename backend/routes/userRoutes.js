const express = require("express");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const usersFile = path.join(__dirname, "../data/users.json");

function getUsers() {
    const data = fs.readFileSync(usersFile, "utf8");
    return JSON.parse(data);
}

function saveUsers(users) {
    fs.writeFileSync(
        usersFile,
        JSON.stringify(users, null, 2)
    );
}


// GET CURRENT USER PROFILE
router.get("/profile", authMiddleware, (req, res) => {
    const users = getUsers();

    const user = users.find(
        user => user.id === req.user.id
    );

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
});


// UPDATE CURRENT USER PROFILE
router.put("/profile", authMiddleware, (req, res) => {
    const users = getUsers();

    const userIndex = users.findIndex(
        user => user.id === req.user.id
    );

    if (userIndex === -1) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const {
        name,
        bio,
        location
    } = req.body;

    if (name !== undefined) {
        users[userIndex].name = name;
    }

    if (bio !== undefined) {
        users[userIndex].bio = bio;
    }

    if (location !== undefined) {
        users[userIndex].location = location;
    }

    saveUsers(users);

    const { password, ...updatedUser } = users[userIndex];

    res.json({
        message: "Profile updated successfully",
        user: updatedUser
    });
});


// GET USER BY ID
router.get("/:id", (req, res) => {
    const users = getUsers();

    const user = users.find(
        user => user.id === req.params.id
    );

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
});


module.exports = router;