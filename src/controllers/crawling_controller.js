const {HTTP_STATUS, DELIMITER_CHARACTERS} = require('../untils/constants')
const crawlingService = require('../services/crawling_service')
const userService = require('../services/user_service')
const configService = require('../services/crawl_config_service')

// Thực hiện thu thập
exports.crawlData = async (req, res) => {
    let browserObj = {}

    try {
        const {user_id, crawl_config_id} = req.body

        // Kiểm tra đủ tham số đầu vào
        if (!user_id || !crawl_config_id) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Kiểm tra user có tồn tại
        const checkUserExists = await userService.checkUserExists(user_id)
        if (!checkUserExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Người dùng không tồn tại!'
            })
        }

        // Kiểm tra cấu hình có tồn tại
        const checkConfigExists = await configService.checkExists(crawl_config_id)
        if (!checkConfigExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Cấu hình không tồn tại!'
            })
        }

        // Lấy thông tin cơ bản của cấu hình
        const config = await configService.get(crawl_config_id)

        // Kiểm tra cấu hình có phải của user
        if (config.user_id != user_id) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Người dùng không có quyền thu thập với cấu hình này!'
            })
        }

        // Lấy tất cả thông tin của cấu hình
        const crawlConfigInfor = await crawlingService.getConfigInfor(crawl_config_id)

        // Thực hiện thu thập
        const crawlResult = await crawling(crawlConfigInfor, browserObj)

        // Kiểm tra cấu hình đã hoàn thành
        const isComplete = await configService.checkIsComplete(crawl_config_id)
        if (isComplete) {
            // Trả về 10 item đầu tiên thu thập được
            res.status(HTTP_STATUS.OK).json({
                items: crawlResult.items.slice(0, 10),
                errors: crawlResult.errors,
                message: 'Thu thập dữ liệu thành công!'
            })

            // Lưu tất cả kết quả thu thập được vào database
            ////////////////////////////////////
            //////////////
        } else {
            // Trả về 10 item đầu tiên thu thập được
            res.status(HTTP_STATUS.OK).json({
                items: crawlResult.items.slice(0, 10),
                errors: crawlResult.errors,
                message: 'Thu thập dữ liệu thành công!'
            })
        }

    } catch (error) {
        // Đóng trình duyệt khi đã sử dụng xong
        if (browserObj.browser) browserObj.browser.close()

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi thu thập dữ liệu!',
            error: error.message
        })
    }
}

// Hàm thực hiện cập nhật lại dữ liệu thu thập, với cấu hình thu tập được lấy từ database theo id
async function crawling(crawlConfigInfor, browserObj) {
    // Tách url thành mảng
    const urls = crawlConfigInfor.crawl_config.url.split(DELIMITER_CHARACTERS.ARRAY_DELIMITER)

    // Khai báo mảng để lưu kết quả và lỗi
    const allItems = []
    const allErrors = []

    // Duyệt từng url và thực hiện thu thập
    for (const url of urls) {
        // Tạo bản sao để thực hiện thu thập
        const crawlConfigInforCopy = JSON.parse(JSON.stringify(crawlConfigInfor))

        // Truyền url hiện tại vào cấu hình
        crawlConfigInforCopy.crawl_config.url = url

        // Thực hiện thu thập
        const { items, errors } = await crawlingService.handleCrawlingData(crawlConfigInforCopy, browserObj)

        // Thêm những lỗi mới vào mảng
        for (const error of errors) {
            if (!checkErrorExists(allErrors, error.error_at)) {
                allErrors.push(error)
            }
        }

        // Thêm kết quả vào mảng
        allItems.push(...items)
    }

    // Đóng trình duyệt khi đã sử dụng xong
    if (browserObj.browser) browserObj.browser.close()

    // Trả về kết quả
    return { crawl_config_infor: crawlConfigInfor, items: allItems, errors: allErrors }

}

// Hàm kiểm tra xem một lỗi đã tồn tại trong danh sách lỗi chưa
function checkErrorExists(errors, name) {
    return errors.some(error => error.error_at === name);
}
