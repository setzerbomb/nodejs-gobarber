const { User } = require('../models')

class UserController {
  create (req, res) {
    return res.render('auth/signup')
  }

  async store (req, res) {
    try {
      const { filename: avatar } = req.file

      await User.create({ ...req.body, avatar })

      return res.redirect('/')
    } catch (e) {
      if (req.file == null || req.file === 'undefined') {
        req.flash('error', 'Insira um avatar')
        return res.redirect('/signup')
      } else {
        req.flash('error', 'Usuário já existe')
        return res.redirect('/signup')
      }
    }
  }
}

module.exports = new UserController()
