const ItemModel = require('../models/item_model')
const itemDetailService = require('./item_detail_service')

// Lấy item bằng id
exports.get = async (id) => {
    return await ItemModel.findByPk(id)
}

// Thêm mới
exports.add = async (itemTypeId, websiteId, crawlConfigId) => {
    return await ItemModel.create({
        item_type_id: itemTypeId,
        website_id: websiteId,
        crawl_config_id: crawlConfigId,
        update_at: Date.now()
    })
}

// Lấy id item bằng configId và url (khóa chính)
exports.getIdItemByUrl = async (configId, url) => {
    // Lấy danh sách tất cả id trong bảng items
    const items  = await ItemModel.findAll({
        where:{
            crawl_config_id: configId,
        }
    })

    
    // Lấy chi tiết item chứa url trang chi tiết của từng item
    for (const item of items) {
        const itemDetail = await itemDetailService.getItemDetailContainUrl(item.id)

        // Trả về itemId nếu có
        if (itemDetail && itemDetail.value === url) {
            return item
        }
    }

    return null
}