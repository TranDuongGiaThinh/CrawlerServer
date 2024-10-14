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
exports.getItemByUrl = async (configId, url) => {
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

// Lấy danh sách dữ liệu của một cấu hình thu thập được
exports.getAllItemOfConfig = async (configId) => {
    const items = await ItemModel.findAll({
        where: {
            crawl_config_id: configId
        }
    })

    return items
}

// Lọc dữ liệu
exports.filter = async ({ typeId = null, websiteId = null, configId = null }) => {
    // Tạo điều kiện lọc
    const whereConditions = {};
    if (typeId) {
        whereConditions.item_type_id = typeId;
    }
    if (websiteId) {
        whereConditions.website_id = websiteId;
    }
    if (configId) {
        whereConditions.crawl_config_id = configId;
    }

    // Lấy danh sách các mục (cần lấy id, crawl_config_id, website_id, item_type_id)
    const items = await ItemModel.findAll({
        where: whereConditions
    })

    return items
}

// Kiểm tra quyền xuất dữ liệu
exports.checkPermission = async (req, res) => {
    
}

// Xuất dữ liệu
exports.export = async (req, res) => {
    
}

// Lấy danh sách từ khóa gợi ý tìm kiếm
exports.getSearchSuggestions = async (req, res) => {
    
}

// Tìm kiếm dữ liệu thu thập bằng từ khóa
exports.search = async (req, res) => {
    
}
