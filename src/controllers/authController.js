import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { signRefreshToken } from "../utils/jwtHelper.js";
import { sendEmail } from "../utils/sendEmail.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ msg: "Name or email or password is empty" });
    }
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({ msg: "User exists with this email" });
    }
    const user = new User({ name, email, password });
    await user.save();
    
    await sendEmail(
      email,
      "Welcome to Event Booking System",
      `Hello ${name}, welcome to our event booking platform! You can now book tickets for amazing events.`
    );
    
    return res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email or password is empty" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User doesn't exist with this email" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ msg: "Password is incorrect" });
    }
    const token = signRefreshToken({ userId: user._id, role: user.role });
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};
