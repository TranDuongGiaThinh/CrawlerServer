const axios = require('axios')
const xml2js = require('xml2js')
const { DELIMITER_CHARACTERS, ERROR_CODES} = require('../untils/constants')

// Lấy dữ liệu 1 đối tượng
exports.singleCrawl = async (crawlConfig, crawlDetails) => {
    // Mảng lưu trữ lỗi
    const errors = []

    // Mảng lưu kết quả trả về
    const itemDetails = []

    try {
        // Lấy rss
        const response = await axios.get(crawlConfig.url)
        const   apiResults = response.data

        // Phân tích cú pháp XML sang đối tượng JavaScript
        const parser = new xml2js.Parser({ explicitArray: false })
        const parsedData = await parser.parseStringPromise(apiResults)

        // Lấy danh sách item
            // Tách các thuộc tính lồng nhau
            const attributes = crawlConfig.item_selector.split(DELIMITER_CHARACTERS.MEMBER_ACCESS_CHARACTER)

            // Truy cập vào nơi chứa item
            let itemDatas = parsedData
            for (const attr of attributes) {
                itemDatas = itemDatas[attr]
            }

            if (!itemDatas) {
                value = ''
                if (!checkErrorExists(errors, item_selector)) {
                    errors.push({ 
                        error_at: item_selector, 
                        error_code: ERROR_CODES.item_selector, 
                        error_message: 'Element attribute not found!' 
                    })
                }
            }

        // Duyệt qua từng chi tiết cần crawl
        for (const crawlDetail of crawlDetails) {
            const { name, selector: attribute, is_detail_url, is_contain_keywords, is_primary_key } = crawlDetail

            // Lấy giá trị của thuộc tính cần lấy
                // Tách các thuộc tính lồng nhau bằng cách sử dụng dấu chấm
                const attributes = attribute.split('.')

                // Lấy giá trị của thuộc tính cần lấy
                let value = itemDatas
                for (const attr of attributes) {
                    value = value[attr]
                }

                if (!value) {
                    value = ''
                    if (!checkErrorExists(errors, name)) {
                        errors.push({ 
                            error_at: name, 
                            error_code: ERROR_CODES.ELEMENT_VALUE_NOT_FOUND, 
                            error_message: 'Element attribute not found!' 
                        })
                    }
                }

            // Thêm vào kết quả
            itemDetails.push({ name, value, is_detail_url, is_contain_keywords, is_primary_key })
        }

        return {items: [itemDetails], errors};
    } catch (error) {
        errors.push({ error_at: '?', error_code: ERROR_CODES.UNKNOWN_ERROR, error_message: error.message})

        return {items: [itemDetails], errors}
    }
};

// Lấy dữ liệu tất cả đối tượng
exports.multiCrawl = async (crawlConfig, crawlDetails) => {
    // Khai báo mảng kết quả
    const results = []

    // Mảng lưu trữ lỗi
    const errors = []

    try {
        // Lấy rss
        const response = await axios.get(crawlConfig.url)
        const   apiResults = response.data

        // Phân tích cú pháp XML sang đối tượng JavaScript
        const parser = new xml2js.Parser({ explicitArray: false })
        const parsedData = await parser.parseStringPromise(apiResults)

        // Lấy danh sách item
            // Tách các thuộc tính lồng nhau
            const attributes = crawlConfig.item_selector.split(DELIMITER_CHARACTERS.MEMBER_ACCESS_CHARACTER)

            // Truy cập vào nơi chứa item
            let itemDatas = parsedData
            for (const attr of attributes) {
                itemDatas = itemDatas[attr]
            }

            if (!itemDatas) {
                itemDatas = []
                if (!checkErrorExists(errors, item_selector)) {
                    errors.push({ 
                        error_at: item_selector, 
                        error_code: ERROR_CODES.item_selector, 
                        error_message: 'Element attribute not found!' 
                    })
                }
            }

        // Duyệt qua từ item
        for (const itemData of itemDatas) {
            const itemDetails = []

            // Duyệt qua các thuộc tính
            for (const crawlDetail of crawlDetails) {
                const { name, selector: attribute, is_detail_url, is_contain_keywords, is_primary_key } = crawlDetail

                // Lấy giá trị của thuộc tính cần lấy
                    // Tách các thuộc tính lồng nhau bằng cách sử dụng dấu chấm
                    const attributes = attribute.split(DELIMITER_CHARACTERS.MEMBER_ACCESS_CHARACTER)

                    // Lấy giá trị của thuộc tính cần lấy
                    let value = itemData;
                    for (const attr of attributes) {
                        value = itemData[attr]
                    }

                    if (!value) {
                        value = ''
                        if (!checkErrorExists(errors, name)) {
                            errors.push({ 
                                error_at: name, 
                                error_code: ERROR_CODES.ELEMENT_VALUE_NOT_FOUND,
                                error_message: 'Element attribute not found!' 
                            })
                        }
                    }

                // Thêm vào kết quả
                itemDetails.push({ name, value, is_detail_url, is_contain_keywords, is_primary_key })
            }

            results.push(itemDetails)
        }
        
        return {items: results, errors}
    } catch (error) {
        errors.push({ 
            error_at: '?', 
            error_code: ERROR_CODES.UNKNOWN_ERROR, 
            error_message: error.message
        })

        return {items: results, errors}
    }
};

// Hàm kiểm tra xem một lỗi đã tồn tại trong mảng errors chưa
function checkErrorExists(errors, name) {
    return errors.some(error => error.error_at === name)
}
