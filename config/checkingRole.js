module.exports = function(req, res, next) {
  console.log(req.user);
  if (req.user) {
    if (req.user.role) {
      return next();
    }
  }
  res.redirect('/users/login');
};
