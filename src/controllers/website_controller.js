const {HTTP_STATUS} = require('../untils/constants')
const websiteService = require('../services/website_service')
const userService = require('../services/user_service')

// Lấy danh sách website mà người dùng tạo
exports.getAllWebsiteOfUser = async (req, res) => {
    try {
        const {id} = req.params

        // Kiểm tra đủ tham số đầu vào
        if (!id) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            });
            
            return;
        }

        // Kiểm tra người dùng có tồn tại
        const exists = await userService.checkUserExists(id)

        if(!exists) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                websites: [],
                message: 'Người dùng không tồn tại!'
            })

            return
        }

        // Thực hiện lấy danh sách website
        const websites = await websiteService.getAllWebsiteOfUser(id)

        res.status(HTTP_STATUS.OK).json({
            websites: websites,
            message: 'Lấy danh sách website mà người dùng sử dụng thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            websites: [],
            message: 'Lỗi khi lấy danh sách website mà người dùng sử dụng!',
            error: e.message
        })
    }
}

// Thêm website thu thập
exports.add = async (req, res) => {
    try {
        const {name, url, user_id} = req.body

        // Kiểm tra đủ tham số đầu vào
        if (!name || !url || !user_id) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            });

            return
        }

        // Rút gọn url
        let shortenedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
        shortenedUrl = shortenedUrl.replace(/^https?:\/\//, '');
        if (shortenedUrl.endsWith('/')) {
            shortenedUrl = shortenedUrl.slice(0, -1);
        }

        // Kiểm tra người dùng có tồn tại
        const exists = await userService.checkUserExists(user_id)

        if(!exists) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Người dùng không tồn tại!'
            })

            return
        }

        // Kiểm tra tên website đã tồn tại
        const checkNameExistsResult = await websiteService.checkNameExists(name)

        if(checkNameExistsResult) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Tên website đã tồn tại!'
            })

            return
        }

        // Kiểm tra url website đã tồn tại
        const checkUrlExistsResult = await websiteService.checkUrlExists(shortenedUrl)

        if(checkUrlExistsResult) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Url website đã tồn tại!'
            })

            return
        }

        // Kiểm tra url hợp lệ
        const valid = await websiteService.checkUrlValid(shortenedUrl)

        if(!valid) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Url không hợp lệ!'
            })

            return
        }

        // Thực hiện thêm website
        const newWebsite = await websiteService.add(name, shortenedUrl, user_id)

        res.status(HTTP_STATUS.OK).json({
            website: newWebsite,
            message: 'Thêm mới website thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi thêm mới website!',
            error: e.message 
        })
    }
}

// Chỉnh sửa website
exports.update = async (req, res) => {
    try {
        const {id, name, url} = req.body

        // Kiểm tra đủ tham số đầu vào
        if (!name || !url || !id) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
            
            return
        }

        // Kiểm tra website có tồn tại
        const exists = await websiteService.checkExists(id)

        if (!exists) {
            res.status(HTTP_STATUS.FORBIDDEN).json({
                message: 'Website không tồn tại!'
            })
            
            return
        }

        // Rút gọn url
        let shortenedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
        shortenedUrl = shortenedUrl.replace(/^https?:\/\//, '');
        if (shortenedUrl.endsWith('/')) {
            shortenedUrl = shortenedUrl.slice(0, -1);
        }

        // Kiểm tra tên website đã tồn tại
        const checkNameExistsResult = await websiteService.checkNameExistsWithId(id, name)

        if(checkNameExistsResult) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Tên website đã tồn tại!'
            })

            return
        }

        // Kiểm tra url website đã tồn tại
        const checkUrlExistsResult = await websiteService.checkNameExistsWithId(id, shortenedUrl)

        if(checkUrlExistsResult) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Url website đã tồn tại!'
            })

            return
        }

        // Kiểm tra url hợp lệ
        const valid = await websiteService.checkUrlValid(shortenedUrl)

        if(!valid) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Url không hợp lệ!'
            })

            return
        }

        // Thực hiện cập nhật website
        const updatedWebsite = await websiteService.update(id, name, shortenedUrl)

        res.status(HTTP_STATUS.OK).json({
            website: updatedWebsite,
            message: 'Cập nhật website thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật website!',
            error: e.message 
        })
    }
}

// Xóa website
exports.delete = async (req, res) => {
    try {
        const {id} = req.params

        // Kiểm tra website có tồn tại
        const exists = await websiteService.checkExists(id)

        if (!exists) {
            res.status(HTTP_STATUS.FORBIDDEN).json({
                message: 'Website không tồn tại!'
            })
            
            return
        }

        // Kiểm tra website có đang được sử dụng
        const isUsing = await websiteService.checkIsUsing(id)

        if (isUsing) {
            res.status(HTTP_STATUS.FORBIDDEN).json({
                message: 'Website đang được sử dụng, không thể xóa!'
            })
            
            return
        }

        // Thực hiện xóa
        await websiteService.delete(id)

        res.status(HTTP_STATUS.OK).json({
            check_result: isUsing,
            message: 'Xóa website thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            check_result: false,
            message: 'Lỗi khi xóa website!',
            error: e.message 
        })
    }
}

// Kiểm tra tên website đã tồn tại
exports.checkNameExists = async (req, res) => {
    try {
        const {id, name} = req.query;

        // Kiểm tra đủ tham số đầu vào
        if (!name) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
            
            return
        }

        let checkResult
        if(id) checkResult = await websiteService.checkNameExistsWithId(id, name)
        else checkResult = await websiteService.checkNameExists(name)

        res.status(HTTP_STATUS.OK).json({
            check_result: checkResult,
            message: 'Kiểm tra tên website thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            check_result: false,
            message: 'Lỗi khi kiểm tra tên website!',
            error: e.message 
        })
    }
}

// Kiểm tra url website đã tồn tại
exports.checkUrlExists = async (req, res) => {
    try {
        const {id, url} =  req.query

        // Kiểm tra đủ tham số đầu vào
        if (!url) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
            
            return
        }

        // Rút gọn url
        let shortenedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
        shortenedUrl = shortenedUrl.replace(/^https?:\/\//, '');
        if (shortenedUrl.endsWith('/')) {
            shortenedUrl = shortenedUrl.slice(0, -1);
        }

        let checkResult
        if(id) checkResult = await websiteService.checkUrlExistsWithId(id, shortenedUrl)
        else checkResult = await websiteService.checkUrlExists(shortenedUrl)

        res.status(HTTP_STATUS.OK).json({
            check_result: checkResult,
            message: 'Kiểm tra url website thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            check_result: false,
            message: 'Lỗi khi kiểm tra url website!',
            error: e.message 
        })
    }
}

// Kiểm tra website đang được sử dụng
exports.checkIsUsing = async (req, res) => {
    try {
        const {id} = req.params

        // Kiểm tra đủ tham số đầu vào
        if (!id) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
            
            return
        }

        const checkResult = await websiteService.checkIsUsing(id)

        res.status(HTTP_STATUS.OK).json({
            check_result: checkResult,
            message: 'Kiểm tra website có đang được sử dụng thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            check_result: false,
            message: 'Lỗi khi kiểm tra website có đang được sử dụng!',
            error: e.message 
        })
    }
}

// Kiểm tra đường dẫn hợp lệ
exports.checkUrlValid = async (req, res) => {
    try {
        const {url} = req.query

        // Kiểm tra đủ tham số đầu vào
        if (!url) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
            
            return
        }

        const valid = await websiteService.checkUrlValid(url)

        res.status(HTTP_STATUS.OK).json({
            check_result: valid,
            message: 'Kiểm tra tính hợp lệ của url thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            check_result: false,
            message: 'Lỗi khi kiểm tra tính hợp lệ của url!',
            error: e.message 
        })
    }
}
