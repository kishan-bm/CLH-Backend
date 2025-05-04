const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, credits: 100 });
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed', details: err.message });
  }
};

exports.login = async (req, res) => {
  console.log("💥 Login attempt");
  console.log("📩 Payload:", req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("❌ No user found");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    console.log("✅ Login success for:", user.email);
    res.json({ token });
  } catch (err) {
    console.error("🔥 Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

