const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

module.exports = (wss, clients) => {
    router.post('/send-notification', (req, res) => notificationController.sendNotification(req, res, wss, clients));
    return router;
};
