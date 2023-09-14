const router = require("express").Router();
const User = require("../model/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
// register
router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(req.body.password, process.env.AES_SEC),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json("Internal server error" + err);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const getUser = await User.findOne({ email: req.body.email });
    !getUser && res.status(401).json("No user find with this email");

    const { password, ...otherInfo } = getUser._doc;
    const originalPassword = CryptoJS.AES.decrypt(
      password,
      process.env.AES_SEC
    ).toString(CryptoJS.enc.Utf8);
    originalPassword !== req.body.password &&
      res.status(401).json("password doesn't match !");

    const generateToken = jwt.sign({ _id: getUser._id }, process.env.JWT_SEC, {
      expiresIn: "5d",
    });

    res.status(200).json({ ...otherInfo, generateToken });
  } catch (err) {
    res.status(500).json("Internal server error" + err);
  }
});

// Forgot password route
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Generate a reset token with an expiration (e.g., 1 hour)
    const resetToken = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
      expiresIn: "1h",
    });

    // Store the reset token in the user's document
    user.resetToken = resetToken;
    await user.save();

    // Send a reset password email
    const resetLink = `http://your-app/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      // Configure your email service here
      service: "Gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      // add email address on which you want to send
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json("Email could not be sent");
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json("Password reset email sent");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal server error");
  }
});

module.exports = router;
