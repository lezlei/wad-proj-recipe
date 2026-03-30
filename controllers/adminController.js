const admin = require('../models/admin')
const User = require('../models/User')
const Announcement = require('../models/Announcement');

exports.loadDashboard = async (req,res) => {
    try {
        const allUsers = await admin.getAllUsers()
        res.render("auth/admin",{users: allUsers, message: null})
    } catch (error) {
        console.error(error)
    }
}

exports.updateRole = async (req,res) => {
    try {
        const userId = req.body.id
        const newRole = req.body.role

        await admin.updateRole(userId, newRole)
        res.redirect('/auth/admin')
    } catch (error) {
        console.error(error)
    }
}

exports.toggleSuspend = async (req,res) => {
    try {
        const userId = req.body.id
        await admin.SuspendUser(userId)
        res.redirect('/auth/admin')
    } catch (error) {
        console.error(error)
    }
}

exports.delete = async (req,res) => {
    try {
        const userId = req.body.id
        await admin.DeleteUser(userId)
        res.redirect('/auth/admin')
    } catch (error) {
        console.error(error)
    }
}

exports.postAnnouncement = async (req, res) => {
    await Announcement.deleteMany({}); 
    
    await Announcement.create({ content: req.body.msg });

    const message = "Announcement posted!"

    const allUsers = await admin.getAllUsers()

    res.render('auth/admin',{message, users: allUsers});
};

exports.deactivateBanner = async (req, res) => {
    await Announcement.updateOne({}, { isActive: false });

    const message = "Banner turned off!"

    const allUsers = await admin.getAllUsers()

    res.render('auth/admin',{message, users: allUsers});
};