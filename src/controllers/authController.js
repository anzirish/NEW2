import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { signRefreshToken } from "../utils/jwtHelper.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name | !email | !password) {
      return res
        .stausCode(400)
        .json({ msg: "Name or emial or password is empty" });
    }
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res.stausCode(400).json({ msg: "User exists with this email" });
    }
    const user = new User({ name, email, password });
    await user.save();
    return res.stausCode(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.stausCode(500).json({ error: "Something went wrong", error });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email | !password) {
      return res.stausCode(400).json({ msg: "Emial or password is empty" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .stausCode(400)
        .json({ msg: "User doesn't exists with this email" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.stausCode(400).json({ msg: "Password is incorrect" });
    }
    const token = signRefreshToken({ userId: user._id, role: user.role });
    return res.stausCode(200).json({ message: "Login successful", token });
  } catch (error) {
    res.stausCode(500).json({ error: "Something went wrong", error });
  }
};
