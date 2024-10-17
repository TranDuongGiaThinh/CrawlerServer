const ItemDetailMoDel = require('../models/item_detail_model')
const itemService = require('../services/item_service')
const {Op} = require('sequelize')

// Thêm mới
exports.add = async (itemId, name, value, isDetailUrl, isPrimaryKey, isConstainKeyword) => {
    const newItemDetail =  await ItemDetailMoDel.create({
        item_id: itemId,
        name: name,
        value: value,
        is_detail_url: isDetailUrl || false,
        is_primary_key: isPrimaryKey || false,
        is_contain_keywords: isConstainKeyword || false,
    })

    return newItemDetail
}

// Cập nhật
exports.updateItemDetails = async (itemId, newItemDetails) => {
    // Lấy item cần cập nhật
    let item = await itemService.get(itemId)

    // Lấy danh sách itemDetails của item cần cập nhật
    let itemDetails = await ItemDetailMoDel.findAll({
        where:{
            item_id: itemId
        }
    })

    // Duyệt danh sách itemDetail, cập nhật từng thuộc tính (trùng tên)
    for (let i = 0; i < newItemDetails.length; i++) {
        // Biến kiểm tra chi tiết item có được lưu hay chưa
        let saved = false

        // kiểm tra, nếu đã tồn tại thì cập nhật
        for (let j = 0; j < itemDetails.length; j++) {
            if (itemDetails[j].name === newItemDetails[i].name) {
                const updatedItemDetail = await ItemDetailMoDel.findByPk(itemDetails[j].id)
                
                if (updatedItemDetail.value !== newItemDetails[i].value) {
                    updatedItemDetail.value = newItemDetails[i].value
                    await updatedItemDetail.save() 
    
                    // Cập nhật lại thời gian cập nhật (nếu có)
                    item.update_at = Date.now()
                    await item.save()
                }
            
                saved = true
                break
            }
        }

        // Thêm mới nếu chưa tồn tại
        if (!saved) {
            await this.add(
                item, 
                newItemDetails[i].name,
                newItemDetails[i].value,
                newItemDetails[i].is_detail_url,
                newItemDetails[i].is_primary_key,
                newItemDetails[i].is_contain_keywords
            )
        }
    }
}

// Lấy chi tiết item chứa url của một item
exports.getItemDetailContainUrl = async (itemId) => {
    const itemDetail = await ItemDetailMoDel.findOne({
        where: {
            item_id: itemId,
            is_primary_key: true
        }
    })

    return itemDetail
}

// Lấy danh sách chi tiết item của một item 
exports.getAllItemDetailOfItem = async (itemId) => {
    const itemDetails = await ItemDetailMoDel.findAll({
        where: {
            item_id: itemId
        }
    })

    return itemDetails
}

// Kiểm tra chi tiết item có chứa từ khóa cần tìm không
exports.checkIsContainKeyword = async (itemId, keyword) => {
    const itemDetail = await ItemDetailMoDel.findOne({
        where: {
            item_id: itemId,
            value: {
                [Op.like]: `%${keyword}%`
            },
            is_contain_keywords: true
        }
    })

    return itemDetail ? true : false
}

// Lấy danh sách thuộc tính chứa keyword
exports.getItemDetailContainKeywordOfItem = async (itemId, keyword) => {
    const whereCondition = {
        item_id: itemId,
        is_contain_keywords: true
    }

    if (keyword) whereCondition.value = {
        [Op.like]: `%${keyword}%`
    }

    const itemDetails = await ItemDetailMoDel.findAll({
        where: whereCondition
    })

    return itemDetails
}
