const CrawlConfigModel = require('../models/crawl_config_model')
const userService = require('./user_service')
const packageUserService = require('./package_user_service')

// Lấy thông tin cấu hình
exports.get = async (id) => {
    const crawlConfig = await CrawlConfigModel.findByPk(id)

    return crawlConfig
}

// Lấy danh sách các cấu hình con
exports.getListChildConfigs = async (parentId) => {
    const childConfigs = await CrawlConfigModel.findAll({
        where: {
            parent_id: parentId,
        }
    });

    return childConfigs
}

// Kiểm tra cấu hình có tồn tại
exports.checkExists = async (id) => {
    const crawlConfig = await CrawlConfigModel.findByPk(id)

    return crawlConfig ? true : false
}

// Lấy danh sách cấu hình của người dùng
exports.getAllOfUser = async (userId) => {
    const crawlConfigs = await CrawlConfigModel.findAll({
        where: {user_id: userId}
    })

    return crawlConfigs
}

// Kiểm tra quyền tạo mới cấu hình
exports.checkPermission = async (userId) => {
    // Lấy thông tin gói người dùng đang dùng (số lượng tối đa)
    const packageUserIsUsing = await packageUserService.getPackageIsUsing(userId)

    // Lấy số lượng cấu hình người dùng đã tạo (số lượng đã dùng)
    const user = await userService.getUser(userId)

    // Kiểm tra quyền tạo (số lượng cấu hình đã tạo chưa đạt giới hạn)
    if (!user || !packageUserIsUsing) {
        return false
    }
    else {
        return (packageUserIsUsing.max_config - user.config_count) > 0
    }
}

// Kiểm tra tên cấu hình đã tồn tại
exports.checkNameExists = async (userId, name) => {
    const crawlConfig = await CrawlConfigModel.findOne({
        where: {
            name: name, 
            user_id: userId
        }
    })

    return crawlConfig ? true : false
}

// Kiểm tra trạng thái cấu hình đã hoàn thành
exports.checkIsComplete = async (configId) => {
    const crawlConfig = await CrawlConfigModel.findByPk(configId)

    return crawlConfig.is_completed
}

// Tạo mới cấu hình
exports.add = async (userId, name, description, url, websiteId, crawlTypeId) => {
    const newCrawlConfig = await CrawlConfigModel.create({
        parent_id: null,
        user_id: userId,
        name: name,
        description: description,
        url: url,
        crawl_type_id: crawlTypeId,
        result_type_id: -1,
        item_type_id: -1,
        website_id: websiteId,
        item_selector: "",
        http_method_id: -1,
        headers_api: "",
        body_api: "",
        is_completed: false,
        update_at: Date.now()
    })

    // Tăng số lần tạo cấu hình của người dùng
    if (newCrawlConfig) {
        const user = await userService.getUser(userId)

        user.config_count = user.config_count + 1

        await user.save()
    }

    return newCrawlConfig
}

// Tạo mới cấu hình
exports.update = async (configId, resultTypeId, itemTypeId, httpMethodId, itemSelector, heardersApi, bodyApi) => {
    const config = await CrawlConfigModel.findByPk(configId)

    config.result_type_id = resultTypeId
    config.item_type_id = itemTypeId
    config.http_method_id = httpMethodId
    config.item_selector = itemSelector
    config.headers_api = heardersApi
    config.body_api = bodyApi
    config.update_at = Date.now()

    await config.save()

    return config
}

// Cập nhật trạng thái hoàn thành của cấu hình
exports.complete = async (configId) => {
    const crawlConfig = await CrawlConfigModel.findByPk(configId)

    crawlConfig.is_completed = true
    await crawlConfig.save()

    return true
}
