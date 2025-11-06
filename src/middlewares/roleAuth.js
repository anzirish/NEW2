export const roleAuth = (req, res, next) => {
  try {
    if (req.user.role === admin) {
      next();
    } else {
      res.json({ msg: "You need to be an admin to perfrom this operation" });
    }
  } catch (error) {
    next(error);
  }
};
