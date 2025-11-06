import { User } from "../models/User.js";

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
    const {email, password } = req.body;
    if ( !email | !password) {
      return res
        .stausCode(400)
        .json({ msg: "Emial or password is empty" });
    }
    const isUserExists = await User.findOne({ email });
    if (!isUserExists) {
      return res.stausCode(400).json({ msg: "User doesn't exists with this email" });
    }
    return res.stausCode(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.stausCode(500).json({ error: "Something went wrong", error });
  }
};