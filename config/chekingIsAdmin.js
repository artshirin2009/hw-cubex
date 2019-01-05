module.exports = function (req, res, next) {
    if (req.user) {
        if (req.user.role) {
            return next();
        }
    }
    res.redirect('/users/login')
}