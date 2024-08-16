const WebsiteModel = require('../models/website_model')
const CrawlConfigModel = require('../models/crawl_config_model')
const ItemModel = require('../models/item_model')

const axios = require('axios')
const Sequelize = require('sequelize');


// Kiểm tra website có tồn tại
exports.checkExists = async (id) => {
    const website = await WebsiteModel.findByPk(id)

    return website ? true : false
}

// Lấy danh sách website mà người dùng tạo
exports.getAllWebsiteOfUser = async (id) => {
    const websites = await WebsiteModel.findAll({
        where: {user_id: id}
    })

    return websites
}

// Thêm website thu thập
exports.add = async (name, url, userId) => {
    const newWebsite = await WebsiteModel.create({
        name: name,
        url: url,
        user_id: userId
    })

    return newWebsite
}

// Chỉnh sửa website
exports.update = async (id, name, url) => {
    const website = await WebsiteModel.findByPk(id)

    website.name = name
    website.url = url.toLowerCase()

    await website.save()

    return website
}

// Xóa website
exports.delete = async (id) => {
    await WebsiteModel.destroy({
        where: {
            id: id
        }
    })
}

// Kiểm tra tên website đã tồn tại
exports.checkNameExists = async (name) => {
    const website = await WebsiteModel.findOne({
        where: {
            name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), Sequelize.fn('LOWER', name))
        }
    })

    return website ? true : false
}
exports.checkNameExistsWithId = async (id, name) => {
    const website = await WebsiteModel.findOne({
        where: {
            id: {
                [Sequelize.Op.ne]: id
            },
            name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), Sequelize.fn('LOWER', name))
        }
    })

    return website ? true : false
}

// Kiểm tra url website đã tồn tại
exports.checkUrlExists = async (url) => {
    url = url.toLowerCase()
    const website = await WebsiteModel.findOne({
        where: {
            url: url
        }
    })

    return website ? true : false
}
exports.checkUrlExistsWithId = async (id, url) => {
    url = url.toLowerCase()
    const website = await WebsiteModel.findOne({
        where: {
            id: {
                [Sequelize.Op.ne]: id
            },
            url: url
        }
    })

    return website ? true : false
}

// Kiểm tra website đang được sử dụng
exports.checkIsUsing = async (id) => {
    // Kiểm tra trong bảng cấu hình thu thập
    const crawlConfig = await CrawlConfigModel.findOne({
        where: {
            website_id: id
        }
    })

    if(crawlConfig) return true

    // Kiểm tra trong bảng kết quả thu thập
    const item = await ItemModel.findOne({
        where: {
            website_id: id
        }
    })

    return item ? true : false
}

// Kiểm tra đường dẫn hợp lệ
exports.checkUrlValid = async (url) => {
    try {
        const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
        await axios.get(urlWithProtocol, {timeout: 5000})

        return true
    } catch (e) {
        return false
    }
}