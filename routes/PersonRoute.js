const express = require("express");
const { User, validate } = require("../models/Person");
const bcrypt = require("bcrypt");
const router = express.Router();


router.post("/", async (req, res) => {
    try {
        // Validate request data
        const { error } = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) return res.status(409).send({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            father:req.body.father,
            birthday: req.body.birthday, 
            anniversary: req.body.anniversary 
        });

        await newUser.save();
        res.status(201).send({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Internal Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude password from response
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
