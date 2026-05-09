require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Booking = require("../models/booking");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res
        .status(400)
        .send({ message: "User Already Exists! Please Login" });
    }

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).send({ message: "User Registered Successfully" });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "Login Failed" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        { _id: user._id, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: "1h" },
      );
      res.send({
        token: token,
        message: "Login Successfull",
        role: user.isAdmin ? "admin" : "user",
        status: 200,
      });
    } else {
      return res.status(400).json({ message: "Login Failed" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/verifyuser", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Use `req.user` from authMiddleware
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getallusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/updatepassword/:id", authMiddleware, async (req, res) => {
  const { password } = req.body;
  const id = req.params.id;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true },
    );
    if (user) {
      res.send({ message: "Request submitted successfully", status: 200 });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

router.post("/googlesign", async (req, res) => {
  const { code } = req.body;

  try {
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
      code,
    });

    const { id_token } = data;

    // Verify and decode the ID token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload(); // This contains user data

    const userExist = await User.findOne({ email: payload.email });

    if (userExist) {
      const token = jwt.sign(
        { _id: userExist._id, isAdmin: userExist.isAdmin },
        JWT_SECRET,
        { expiresIn: "1h" },
      );
      return res.send({ token, role: userExist.isAdmin ? "admin" : "user" });
    } else {
      const hashedPassword = await bcrypt.hash(payload.sub, 10);
      const newUser = new User({
        name: payload.name,
        email: payload.email,
        password: hashedPassword, // Generate a random password
      });

      await newUser.save(); // Await user creation

      const token = jwt.sign(
        { _id: newUser._id, isAdmin: newUser.isAdmin },
        JWT_SECRET,
        { expiresIn: "1h" },
      );

      return res.send({ token, role: newUser.isAdmin ? "admin" : "user" }); // Send token in response
    }
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).send("Something went wrong");
  }
});

router.patch("/edit/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;

    // Delete all bookings of user
    await Booking.deleteMany({ userid: id });

    // Delete user
    await User.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
});

const crypto = require("crypto");
const transporter = require("../config/mail");

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.REDIRECT_URI}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"StaySphere" <${process.env.EMAIL}>`,
      to: user.email,
      subject: "Reset Your Password",
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
      
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        
        <div style="background: #0d6efd; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">
            Password Reset
          </h1>
        </div>

        <div style="padding: 30px;">
          
          <h3 style="color: #333;">
            Hello ${user.name},
          </h3>

          <p style="color: #555; line-height: 1.6;">
            We received a request to reset your password.
            Click the button below to create a new password.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a 
              href="${resetUrl}" 
              style="
                background: #0d6efd;
                color: #ffffff;
                padding: 14px 30px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
                font-weight: bold;
              "
            >
              Reset Password
            </a>
          </div>

          <p style="color: #777; line-height: 1.6;">
            This link will expire in <strong>10 minutes</strong>.
          </p>

          <p style="color: #777; line-height: 1.6;">
            If you did not request a password reset, please ignore this email.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

          <p style="font-size: 13px; color: #999; text-align: center;">
            © 2026 Hotel Booking System. All rights reserved.
          </p>

        </div>
      </div>
    </div>
  `,
    });

    res.send({
      message: "Reset link sent to email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Something went wrong",
    });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.send({
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Something went wrong",
    });
  }
});

module.exports = router;
