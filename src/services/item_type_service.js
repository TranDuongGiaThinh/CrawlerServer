const ItemTypeModel = require('../models/item_type_model')
const CrawlConfigModel = require('../models/crawl_config_model')
const ItemModel = require('../models/item_model')


// Kiểm tra chủ đề thu thập có tồn tại
exports.checkExists = async (id) => {
    const itemType = await ItemTypeModel.findByPk(id)

    if (itemType) return true

    return false
}

// Lấy danh sách chủ đề thu thập mà người dùng đã tạo
exports.getAllItemTypeOfUser = async (id) => {
    const itemTypes = await ItemTypeModel.findAll({
        where: {
            user_id: id
        }
    })

    return itemTypes
}

// Kiểm tra tên chủ đề thu thập đã tồn tại
exports.checkNameExists = async (name, userId) => {
    const itemType = await ItemTypeModel.findOne({
        where: {
            type: name,
            user_id: userId
        }
    })

    if (itemType) return true

    return false
}

// Kiểm tra tên chủ đề thu thập có trùng với các chủ đề khác
exports.checkNameExistsWithId = async (id, name) => {
    const itemType = await ItemTypeModel.findOne({
        where: {
            id: id,
            type: name
        }
    })

    if (itemType) return true

    return false
}

// Thêm chủ đề thu thập mới
exports.add = async (type, description, userId) => {
    const newItemType = await ItemTypeModel.create({
        type: type,
        description: description,
        user_id: userId
    })

    return newItemType
}

// Chỉnh sửa chủ đề thu thập
exports.update = async (id, type, description) => {
    const itemType = await ItemTypeModel.findByPk(id)

    itemType.type = type
    itemType.description = description

    itemType.save()

    return itemType
}

// Kiểm tra chủ đề có đang được sử dụng
exports.checkItemTypeIsUsing = async (id) => {
    // Kiểm tra trong bảng cấu hình thu thập
    const crawlConfig = await CrawlConfigModel.findOne({
        where: {
            item_type_id: id
        }
    })

    if(crawlConfig) return true

    // Kiểm tra trong bảng kết quả thu thập
    const item = await ItemModel.findOne({
        where: {
            item_type_id: id
        }
    })

    if(item) return true

    return false
}

// Xóa chủ đề thu thập
exports.delete = async (id) => {
    await ItemTypeModel.destroy({
        where: {
            id: id
        }
    })
}
