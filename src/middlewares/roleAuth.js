export const roleAuth = (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ msg: "You need to be an admin to perform this operation" });
    }
  } catch (error) {
    next(error);
  }
};
