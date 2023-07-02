const methodNotAllowed = (req, res, next) => {
  next({
    status: 405,
    message: `${req.method} not allowed for ${req.originalUrl} ::: Method Not Allowed`,
  });
};

module.exports = methodNotAllowed;
