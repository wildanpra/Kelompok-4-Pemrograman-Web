// controllers/DashboardController.js

const DashboardModel = require('../models/DashboardModel');

class DashboardController {

  // GET /dashboard
  async index(req, res, next) {
    try {
      const data = await DashboardModel.getSummary();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

}

const object = new DashboardController();
module.exports = object;
