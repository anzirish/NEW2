export const authorize = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
      return res.send('No token provided');
    const token = header.split(' ')[1].trim();
    const payload = verifyRefreshToken(token);
    if (!payload) return res.send('Token is invalid or expired');
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};