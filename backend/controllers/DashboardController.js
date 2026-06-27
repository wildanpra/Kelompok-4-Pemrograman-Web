// controllers/DashboardController.js

const DashboardModel = require('../models/DashboardModel');

class DashboardController {

  // GET /dashboard
  async index(req, res, next) {
    try {
      const data = req.user?.role === 'admin' || req.user?.role === 'staff'
        ? await DashboardModel.getSummary()
        : await DashboardModel.getSummaryForAssignedUser(req.user.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

}

const object = new DashboardController();
module.exports = object;
