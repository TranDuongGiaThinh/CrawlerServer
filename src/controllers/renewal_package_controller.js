const {HTTP_STATUS} =require('../untils/constants')
const renewalPackageService = require('../services/renewal_package_service')

// Lấy danh sách gói gia hạn
exports.getAll = async (req, res) => {
    try {
        const renewalPackages = await renewalPackageService.getAll()

        res.status(HTTP_STATUS.OK).json({
            renewal_packages: renewalPackages,
            message: 'Lấy danh sách gói gia hạn thành công!'
        })
    } catch(e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            renewal_packages: [],
            message: 'Lỗi khi lấy danh sách gói gia hạn!',
            error: e.message
        })
    }
}

// Kiểm tra tên gói gia hạn đã tồn tại
exports.checkNameExists = async (req, res) => {
    try {
        const {id, name} = req.query

        // Kiểm tra đủ tham số đầu vào
        if (!name) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        if (id) {
            // Kiểm tra gói có tồn tại
            const checkExists = await renewalPackageService.checkExists(id)
            if (!checkExists) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: 'Gói gia hạn không tồn tại!'
                })
            }
        }

        // Thực hiện kiểm tra
        const checkResult = id ? 
            await renewalPackageService.checkNameExistsWithId(id, name)
            : await renewalPackageService.checkNameExists(name) 

        res.status(HTTP_STATUS.OK).json({
            check_result: checkResult,
            message: 'Kiểm tra tên gói gia hạn đã tồn tại thành công!'
        })
    } catch(e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi kiểm tra tên gói gia hạn đã tồn tại!',
            error: e.message
        })
    }
}

// Thêm gói gia hạn
exports.add = async (req, res) => {
    try {
        const {type, description, promotion, days} = req.body

        // Kiểm tra đủ tham số đầu vào
        if (!type || !description || !promotion || !days) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Kiểm tra tên gói đã tồn tại
        const exists = await renewalPackageService.checkNameExists(type)
        if (exists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Tên gói đã tồn tại!'
            })
        }

        // Kiểm tra số ngày hợp lệ
        if (isNaN(days) || days <= 0) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Tham số days phải là số dương lớn hơn 0!'
            })
        }

        // Kiểm tra giá trị khuyến mãi hợp lệ
        if (isNaN(promotion) || promotion < 0 || promotion > 100) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Tham số promotion phải nằm trong khoảng từ 0 đến 100!'
            })
        }

        // Thực hiện thêm
        const newRenewalPackage = await renewalPackageService.add(type, description, promotion, days)

        res.status(HTTP_STATUS.CREATED).json({
            renewal_package: newRenewalPackage,
            message: 'Thêm gói gia hạn thành công!'
        })
    } catch(e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi thêm gói gia hạn!',
            error: e.message
        })
    }
}

// Cập nhật gói gia hạn
exports.update = async (req, res) => {
    try {
    const {id, type, description, promotion, days} = req.body

        // Kiểm tra đủ tham số đầu vào
        if (!id || !type || !description || !promotion || !days) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Kiểm tra gói có tồn tại
        const checkExists = await renewalPackageService.checkExists(id)
        if (!checkExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Gói gia hạn không tồn tại!'
            })
        }

        // Kiểm tra tên gói đã tồn tại
        const checkNameExists = await renewalPackageService.checkNameExistsWithId(id, type)
        if (checkNameExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Tên gói đã tồn tại!'
            })
        }

        // Kiểm tra số ngày hợp lệ
        if (isNaN(days) || days <= 0) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Tham số days phải là số dương lớn hơn 0!'
            })
        }

        // Kiểm tra giá trị khuyến mãi hợp lệ
        if (isNaN(promotion) || promotion < 0 || promotion > 100) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Tham số promotion phải nằm trong khoảng từ 0 đến 100!'
            })
        }

        // Thực hiện cập nhật
        const updatedRenewalPackage = await renewalPackageService.update(id, type, description, promotion, days)

        res.status(HTTP_STATUS.OK).json({
            renewal_package: updatedRenewalPackage,
            message: 'Cập nhật gói gia hạn thành công!'
        })
    } catch(e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật gói gia hạn!',
            error: e.message
        })
    }
}

// Xóa gói gia hạn
exports.delete = async (req, res) => {
    try {
        const {id} = req.params

        // Kiểm tra đủ tham số đầu vào
        if (!id) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Kiểm tra gói có tồn tại
        const checkExists = await renewalPackageService.checkExists(id)
        if (!checkExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Gói gia hạn không tồn tại!'
            })
        }

        // Thực hiện xóa
        await renewalPackageService.delete(id)

        res.status(HTTP_STATUS.OK).json({
            message: 'Xóa gói gia hạn thành công!'
        })
    } catch(e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi xóa gói gia hạn!',
            error: e.message
        })
    }
}
