const {HTTP_STATUS, DELIMITER_CHARACTERS} = require('../untils/constants')
const crawlingService = require('../services/crawling_service')
const userService = require('../services/user_service')
const configService = require('../services/crawl_config_service')
const itemService = require('../services/item_service')
const itemDetailService = require('../services/item_detail_service')

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
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                message: 'Người dùng không có quyền thu thập với cấu hình này!'
            })
        }

        // Lấy tất cả thông tin của cấu hình
        const crawlConfigInfor = await crawlingService.getConfigInfor(crawl_config_id)

        // Thực hiện thu thập
        const crawlResult = await crawling(crawlConfigInfor, browserObj)

        // Đóng trình duyệt khi đã sử dụng xong
        if (browserObj.browser) browserObj.browser.close()

        // Kiểm tra cấu hình đã hoàn thành
        const isComplete = await configService.checkIsComplete(crawl_config_id)
        if (isComplete) {
            // Lưu tất cả kết quả thu thập được vào database
            await saveCrawlResult(crawlResult.items, config.item_type_id, config.website_id, config.id)
        } 

        // Trả về 10 item đầu tiên thu thập được
        res.status(HTTP_STATUS.OK).json({
            items: crawlResult.items.slice(0, 10).flatMap(subArray => subArray.map(item => ({
                name: item.name,
                value: item.value
            }))),
            errors: crawlResult.errors,
            message: 'Thu thập dữ liệu thành công!'
        })
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

    // Trả về kết quả
    return { crawl_config_infor: crawlConfigInfor, items: allItems, errors: allErrors }

}

// Hàm kiểm tra xem một lỗi đã tồn tại trong danh sách lỗi chưa
function checkErrorExists(errors, name) {
    return errors.some(error => error.error_at === name);
}

// Hàm lưu kết quả thu thập được vào database
async function saveCrawlResult(itemDatas, itemTypeId, websiteId, crawlConfigId) {
    // Duyệt qua kết quả thu được - danh sách item
    for (const item of itemDatas) {
        const itemDetails = []

        // Duyệt qua từng phần tử JSON trong mảng con
        for (const itemDetail of item) {
            // Lưu vào mảng để trả về
            itemDetails.push({
                name: itemDetail.name, 
                value: itemDetail.value, 
                is_detail_url: itemDetail.is_detail_url,
                is_contain_keywords: itemDetail.is_contain_keywords,
                is_primary_key: itemDetail.is_primary_key
            })
        }

        await save(
            {item_type_id: itemTypeId, website_id: websiteId, crawl_config_id: crawlConfigId},
            itemDetails
        )
    }
}

// Lưu: cập nhật nếu đã tồn tại và tạo mới khi chưa tồn tại
const save = async (itemData, itemDetailDatas) => {
    // Khai báo
    let url

    // Lấy url
    for (const itemDetail of itemDetailDatas) {
        if (itemDetail.is_primary_key == true) {
            url = itemDetail.value

            break
        }
    }

    // Kiểm tra item đã tồn tại
    const itemPrimary =  await itemService.getItemByUrl(itemData.crawl_config_id, url)

    // Nếu đã tồn tại, cập nhật
    if (itemPrimary) {
        // Lấy thông tin item
        const item = await itemService.get(itemPrimary.id)

        // Cập nhật chi tiết item
        await itemDetailService.updateItemDetails(itemPrimary.id, itemDetailDatas)
    }
    // Thêm mới
    else {
        // Tạo item
        const item = await itemService.add(itemData.item_type_id, itemData.website_id, itemData.crawl_config_id)

        // Tạo các chi tiết item
        for (const itemDetail of itemDetailDatas) {
            await itemDetailService.add(
                item.id, 
                itemDetail.name, 
                itemDetail.value, 
                itemDetail.is_detail_url, 
                itemDetail.is_primary_key,
                itemDetail.is_contain_keywords,
            )
        }
    }
}
