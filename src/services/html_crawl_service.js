const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const crawlDataTypeService = require('./crawl_data_type_service')
const actionDetailService = require('./crawl_action_detail_service')
const {CRAWL_DATA_TYPES, ERROR_CODES} = require('../untils/constants')

// Hàm khởi tạo trình duyệt
const initPage = async () => {
    try{
        const browser = await puppeteer.launch({
            headless:false
        })

        return browser
    }catch(error){
        console.log("Đã xảy ra lỗi khi khởi tạo browser:", error)
        return null
    }
}

// Lấy dữ liệu 1 đối tượng
exports.singleCrawl = async (crawlConfig, crawlActionDetails, crawlDetails, browserObj) => {
    // Mảng lưu kết quả trả về
    const itemDetails = []

    // Mảng lưu trữ lỗi
    const errors = []
    
    try {
        // Khởi tạo trình duyệt (nếu chưa khởi tạo)
        if (!browserObj.browser) {
            browserObj.browser = await initPage()
        }
        browserObj.page = (await browserObj.browser.pages())[0]
        
        // Lấy trang đầu tiên của trình duyệt để sử dụng
        const page = browserObj.page

        // chuyển đến trang
        await page.goto(crawlConfig.url, { waitUntil: "networkidle2"})

        // Thực hiện các hành động trong quá trình lấy dữ liệu
        if (crawlActionDetails) await actionDetailService.handleActions(page, crawlActionDetails)

        // Khai báo biến lưu tên thuộc tính thu thập
        let name

        // Duyệt qua từng chi tiết cần crawl
        for (const crawlDetail of crawlDetails) {
            // Lấy các thông tin thu thập của thuộc tính
            name = crawlDetail.name
            const { selector, attribute, data_type_id, is_detail_url, is_contain_keywords, is_primary_key } = crawlDetail

            // Lấy cách thu thập 
            const type = (await crawlDataTypeService.get(data_type_id)).type

            let value
            if (type === CRAWL_DATA_TYPES.ATTRIBUTE) {
                try {
                    value = await page.$eval(selector, (el, attr) => el.getAttribute(attr), attribute)
                    
                    if (!value) {
                        value = ''
                        if (!checkErrorExists(errors, name)) {
                            errors.push({ error_at: name, error_code: ERROR_CODES.ELEMENT_VALUE_NOT_FOUND, error_message: 'Element attribute value not found!' })
                        }
                    }
                } catch (err) {
                    if (!checkErrorExists(errors, name)) {
                        errors.push({ error_at: name, error_code: ERROR_CODES.ELEMENT_NOT_FOUND, error_message: err.message })
                    }
                }
            } else if (type === CRAWL_DATA_TYPES.CONTENT) {
                try {
                    value = await page.$eval(selector, el => el.textContent)
                    
                    if (!value) {
                        value = ''
                        if (!checkErrorExists(errors, name)) {
                            errors.push({ error_at: name, error_code: ERROR_CODES.ELEMENT_VALUE_NOT_FOUND, error_message: 'Element content not found!' })
                        }
                    }
                } catch (err) {
                    if (!checkErrorExists(errors, name)) {
                        errors.push({ error_at: name, error_code: ERROR_CODES.ELEMENT_NOT_FOUND, error_message: err.message })
                    }
                }
            } else if (type === CRAWL_DATA_TYPES.COUNT) {
                try {
                    value = await page.$$eval(selector, elements => elements.length)
                } catch (err) {
                    if (!checkErrorExists(errors, name)) {
                        errors.push({ error_at: name, error_code: ERROR_CODES.ELEMENT_NOT_FOUND, error_message: err.message })
                    }
                }
            }

            // Thêm vào mảng kết quả
            itemDetails.push({ name, value: value, is_detail_url, is_contain_keywords, is_primary_key })
        }

        return {items: itemDetails, errors}
    } catch (error) {
        errors.push({ error_at: '?', error_code: ERROR_CODES.UNKNOWN_ERROR, error_message: error.message})

        return {items: itemDetails, errors}
    }
}

// Lấy dữ liệu tất cả đối tượng
exports.multiCrawl = async (crawlConfig, crawlActionDetails, crawlDetails, browserObj) => {
    // Khai báo mảng kết quả
    const results = []

    // Mảng lưu trữ lỗi
    const errors = []
    
    try {
        // Khởi tạo trình duyệt (nếu chưa khởi tạo)
        if (!browserObj.browser) {
            browserObj.browser = await initPage()
        }
        browserObj.page = (await browserObj.browser.pages())[0]
        
        // Lấy trang đầu tiên của trình duyệt để sử dụng
        const page = browserObj.page;

        // Chuyển đến trang 
        await page.goto(crawlConfig.url, { waitUntil: 'networkidle2' })
        
        // Thực hiện các hành động trong lúc thu thập 
        if (crawlActionDetails) await actionDetailService.handleActions(page, crawlActionDetails)
        
        let datasHtml
        try{
            // Lấy nội dung HTML của danh sách item lưu vào mảng
            datasHtml = await page.$$eval(crawlConfig.item_selector, elements => {
                return elements.map(element => element.outerHTML)
            })
        } catch (error) {
            // Thêm lỗi vào mảng chứa lỗi
            errors.push({ error_at: item_selector, error_code: ERROR_CODES.ITEM_LIST_NOT_FOUND, error_message: error.message })

            // Kết thúc thu thập
            return { items: results, errors}
        } 

        // Truy xuất mảng, lấy thông tin từng item
        for (let dataHtml of datasHtml) {
            // Chuyển đổi chuỗi HTML thành một đối tượng DOM ảo
            const $ = cheerio.load(dataHtml)

            // khai báo mảng chứa 1 item
            let data = []

            // Duyệt qua các selector
            for (const crawlDetail of crawlDetails) {
                const { name, selector, attribute, data_type_id, is_detail_url, is_contain_keywords, is_primary_key } = crawlDetail
                const type = (await crawlDataTypeService.get(data_type_id)).type

                let value;
                if (type == CRAWL_DATA_TYPES.ATTRIBUTE) {
                    try {
                        const element = $(selector)
                        value = element.attr(attribute)
                        
                        if (!value) {
                            value = ''
                            if (!checkErrorExists(errors, name)) {
                                errors.push({ error_at: name, error_code: ERROR_CODES.ELEMENT_VALUE_NOT_FOUND, error_message: 'Element attribute not found!' })
                            }
                        }
                    } catch (err) {
                        if (!checkErrorExists(errors, name)) {
                            errors.push({ error_at: name, error_code: ERROR_CODES.ELEMENT_NOT_FOUND, error_message: err.message })
                        }
                    }
                } else if (type == CRAWL_DATA_TYPES.COUNT) {
                    try {
                        value = $(selector).length
                    } catch (err) {
                        if (!checkErrorExists(errors, name)) {
                            errors.push({ error_at: name, error_code: ERROR_CODES.ELEMENT_NOT_FOUND, error_message: err.message })
                        }
                    }
                } else if (type == CRAWL_DATA_TYPES.CONTENT) {
                    try {
                        value = $(selector).text()
                        
                        if (!value) {
                            value = ''
                            if (!checkErrorExists(errors, name)) {
                                errors.push({ error_at: name, error_code: ERROR_CODES.ELEMENT_VALUE_NOT_FOUND, error_message: 'Element content not found!' })
                            }
                        }
                    } catch (err) {
                        if (!checkErrorExists(errors, name)) {
                            errors.push({ error_at: name, error_code: ERROR_CODES.ELEMENT_NOT_FOUND, error_message: err.message })
                        }
                    }
                }

                // Thêm vào kết quả
                data.push({ name, value: value, is_detail_url, is_contain_keywords, is_primary_key })
            }

            results.push(data)
        }
        
        return {items: results, errors}
    } catch (error) {
        errors.push({ error_at: '?', error_code: ERROR_CODES.UNKNOWN_ERROR, error_message: error.message})

        return {items: results, errors}
    }
}

// Hàm kiểm tra xem một lỗi đã tồn tại trong mảng errors chưa
function checkErrorExists(errors, name) {
    return errors.some(error => error.error_at === name)
}
