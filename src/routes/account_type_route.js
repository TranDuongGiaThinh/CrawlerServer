const express = require('express')
const accountTypeController = require('../controllers/account_type_controller')

const route = express.Router()

// Kiểm tra quyền quản trị của loại tài khoản
route.get('/check-admin-permission/:id', accountTypeController.checkAdminPermission)

module.exports = route
