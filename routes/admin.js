const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.get('/admin',adminController.loadDashboard)

router.post('/update-role',adminController.updateRole)

router.post('/toggle-suspend',adminController.toggleSuspend)

router.post('/delete',adminController.delete)

router.post('/announcement',adminController.postAnnouncement)

router.post('/deactivate-banner',adminController.deactivateBanner)

module.exports = router;