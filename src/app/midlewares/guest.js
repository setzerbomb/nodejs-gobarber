module.exports = (req, res, next) => {
  if (req.session && !req.session.user) {
    next()
  } else {
    return res.redirect('app/dashboard')
  }
}
