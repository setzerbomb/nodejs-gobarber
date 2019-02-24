const moment = require('moment')
const { User, Appointment } = require('../models')
const { Op } = require('sequelize')

class AppointmentController {
  async create (req, res) {
    const provider = await User.findByPk(req.params.provider)

    return res.render('appointments/create', { provider })
  }

  async list (req, res) {
    try {
      let user = await User.findByPk(req.params.user)
      if (user.provider === true) {
        let appointments = await Appointment.findAll({
          where: {
            provider_id: user.id,
            date: {
              [Op.between]: [
                moment(parseInt(Date.now()))
                  .startOf('day')
                  .format(),
                moment(parseInt(1571047795861))
                  .endOf('day')
                  .format()
              ]
            }
          }
        })

        let content = await Promise.all(
          appointments.map(async ({ user_id, date }) => {
            let { id, name, avatar } = await User.findByPk(user_id)
            date = moment(date).format('MMMM Do YYYY, h:mm:ss a')
            return { client: { id, name, avatar }, date }
          })
        )

        appointments = content

        return res.render('appointments/list', { appointments })
      }
      res.redirect('/')
    } catch (e) {
      console.log(e)
      res.redirect('/')
    }
  }

  async store (req, res) {
    const { id } = req.session.user
    const { provider } = req.params
    const { date } = req.body

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      date
    })

    return res.redirect('/app/dashboard')
  }
}

module.exports = new AppointmentController()
