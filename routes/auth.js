const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/Person");
const router = express.Router();

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "mySecret123"; 

router.post("/", async (req, res) => {
    try {
        const { email, password, userType, secretKey } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid password" });

        if (userType === "admin") {
            if (!secretKey || secretKey !== ADMIN_SECRET_KEY) {
                return res.status(403).json({ message: "Invalid secret key" });
            }
        }

        const token = jwt.sign({ _id: user._id, isAdmin: userType === "admin" }, process.env.JWTPRIVATEKEY, { expiresIn: "1h" });

        res.json({ token, isAdmin: userType === "admin" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
