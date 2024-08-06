const router = require("express").Router();

const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



// SIGN-IN API
router.post("/sign-in", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email});
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashPassword
    });

    // Save the new user
    await newUser.save();

    return res.status(200).json({ message: "Sign-in successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// LOG-IN API
router.post("/log-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    bcrypt.compare(password, existingUser.password, (error, isMatch) => {
      if (error) {
        return res.status(500).json({ message: "Server error" });
      }

      if (isMatch) {
        // Generate JWT token
        const token = jwt.sign(
          { id: existingUser._id, username: existingUser.username },
          "3738TM",
          { expiresIn: "2d" }
        );
        return res.status(200).json({ id: existingUser._id,username:existingUser.username, token });
      } else {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
