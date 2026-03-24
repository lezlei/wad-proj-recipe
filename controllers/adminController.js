const admin = require('../models/admin')
const User = require('../models/User')

exports.loadDashboard = async (req,res) => {
    try {
        const allUsers = await admin.getAllUsers()
        res.render("auth/admin",{users: allUsers})
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