const AutoCrawlModel = require('../models/auto_crawl_model')
const CrawlConfigModel = require('../models/crawl_config_model')
const UserModel = require('../models/user_model')
const packageUserService = require('../services/package_user_service')
const userService = require('../services/user_service')

// Kiểm tra cấu hình thu thập tự động đã tồn tại
exports.checkAutoCrawlExistsByConfigId = async (configId) => {
    const autoCrawl = await AutoCrawlModel.findOne({
        where:{
            crawl_config_id: configId
        }
    })

    return autoCrawl ? true : false
}

// Kiểm tra quyền tạo cấu hình thu thập tự động
exports.checkPermission = async (userId) => {
    // Lấy thông gói đang sử dụng
    const packageUser = await packageUserService.getPackageIsUsing(userId)
    if (!packageUser) return false

    // Đếm số lượng cấu hình thu thập tự động của người dùng
    const configsOfUser = await CrawlConfigModel.findAll({
        where: {user_id: userId}
    })
    let autoConfigCount = 0
    for (const config of configsOfUser) {
        const checkAutoCrawl = await this.checkAutoCrawlExistsByConfigId(config.id);
        if (checkAutoCrawl) autoConfigCount++;
    }

    // Trả về kết quả kiểm tra
    return packageUser.max_auto_config - autoConfigCount > 0
}

// Đếm cấu hình thu thập tự động
exports.countAutoCrawlConfig = async (userId) => {
    // Lấy danh sách cấu hình thu thập tự động của người dùng
    const configsOfUser = await CrawlConfigModel.findAll({
        where: {user_id: userId}
    })

    let autoConfigCount = 0
    for (const config of configsOfUser) {
        const checkAutoCrawl = await this.checkAutoCrawlExistsByConfigId(config.id);
        if (checkAutoCrawl) autoConfigCount++;
    }

    // Trả về kết quả kiểm tra
    return autoConfigCount
}

// Thêm cấu hình thu thập tự động
exports.add = async (userId, configId, crawlTime) => {
    // Tính ngày hết hạn
    const packageUser = await packageUserService.getPackageIsUsing(userId)
    const expiryDate = new Date(packageUser.create_at)
    expiryDate.setDate(expiryDate.getDate() + packageUser.days)

    const newAutoCrawl = await AutoCrawlModel.create({
        crawl_config_id: configId,
        crawl_time: crawlTime,
        expiry_date: expiryDate,
        update_at: Date.now(),
        is_crawling: false
    })

    return newAutoCrawl
}

// Xóa cấu hình thu thập tự động
exports.delete = async (configId) => {
    await AutoCrawlModel.destroy({
        where: {
            crawl_config_id: configId
        }
    })
}