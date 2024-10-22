const {HTTP_STATUS} = require('../untils/constants')
const itemService = require('../services/item_service')
const crawlConfigService = require('../services/crawl_config_service')
const itemDetailService = require('../services/item_detail_service')
const packageUserService = require('../services/package_user_service')
const userService = require('../services/user_service')
const websiteService = require('../services/website_service')
const itemTypeService = require('../services/item_type_service')

// Cache cho gợi ý tìm kiếm của từng người dùng
const searchSuggestionCache = {}

// Lấy danh sách dữ liệu mà người dùng đã thu thập
exports.getAllItemOfUser = async (req, res) => {
    try {
        const {user_id} = req.params

        // Lấy danh sách cấu hình của người dùng
        const configs = await crawlConfigService.getAllOfUser(user_id)

        // Lấy danh sách dữ liệu thu thập được của từng cấu hình
        const items = []
        for (const config of configs) {
            const itemOfConfigs = await itemService.getAllItemOfConfig(config.id)

            // Lấy chi tiết từng thuộc tính của item
            for (const item of itemOfConfigs) {
                const itemDetails = await itemDetailService.getAllItemDetailOfItem(item.id)

                items.push({item: item, item_details: itemDetails})
            }
        }
        
        res.status(HTTP_STATUS.OK).json({
            items: items,
            message: 'Lấy danh sách dữ liệu mà người dùng đã thu thập thành công!',
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy danh sách dữ liệu mà người dùng đã thu thập!',
            error: error.message
        })
    }
}

// Lọc dữ liệu
exports.filter = async (req, res) => {
    try {
        // Lấy tham số
        const {user_id} = req.params
        const { type_id, website_id, config_id } = req.query

        // Kiểm tra tham số user_id 
        if (!user_id) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Kiểm tra người dùng tồn tại
        const exists = await userService.checkUserExists(user_id)
        if(!exists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Người dùng không tồn tại!'
            })
        }

        // Chuyển đổi các tham số thành số nguyên hoặc để null nếu không có
        const typeId = type_id ? parseInt(type_id, 10) : null
        const websiteId = website_id ? parseInt(website_id, 10) : null
        const configId = config_id ? parseInt(config_id, 10) : null
        
        let lstItem = []
        // Nếu không truyền tham số lọc, xuất tất cả dữ liệu mà người dùng đã thu thập
        if (typeId == null && websiteId == null && configId == null) {
            const allConfigsOfUser = await crawlConfigService.getAllOfUser(user_id)
            for (const config of allConfigsOfUser) {
                const itemsOfConfig = await itemService.getAllItemOfConfig(config.id)
                lstItem.push(...itemsOfConfig)
            }
        } else {
            // Lọc
            lstItem = await itemService.filter({ typeId, websiteId, configId })
        }  

        // Lấy chi tiết từng thuộc tính của item
        const items = []
        for (const item of lstItem) {
            const itemDetails = await itemDetailService.getAllItemDetailOfItem(item.id)

            items.push({item: item, item_details: itemDetails})
        }
        
        res.status(HTTP_STATUS.OK).json({
            items: items,
            message: 'Lọc dữ liệu thu thập thành công!',
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lọc dữ liệu thu thập!',
            error: error.message
        })
    }
}

// Kiểm tra quyền xuất dữ liệu
exports.checkExportPermission = async (req, res) => {
    try {
        const {user_id} = req.params

        // Kiểm tra người dùng tồn tại
        const exists = await userService.checkUserExists(user_id)
        if(!exists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Người dùng không tồn tại!'
            })
        }

        // Kiểm tra quyền
        const checkResult = await packageUserService.checkExportPermission(user_id)

        res.status(HTTP_STATUS.OK).json({
            check_result: checkResult,
            message: 'Kiểm tra quyền xuất dữ liệu thành công!',
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi kiểm tra quyền xuất dữ liệu!',
            error: error.message
        })
    }
}

// Xuất dữ liệu
exports.export = async (req, res) => {
    try {
        // Lấy tham số
        const {user_id} = req.params
        const { type_id, website_id, config_id } = req.query

        // Kiểm tra tham số user_id 
        if (!user_id) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Kiểm tra người dùng tồn tại
        const exists = await userService.checkUserExists(user_id)
        if(!exists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Người dùng không tồn tại!'
            })
        }

        // Kiểm tra quyền
        const permission = await packageUserService.checkExportPermission(user_id)
        if(!permission) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                message: 'Người dùng không có quyền xuất dữ liệu!'
            })
        }

        // Chuyển đổi các tham số thành số nguyên hoặc để null nếu không có
        const typeId = type_id ? parseInt(type_id, 10) : null
        const websiteId = website_id ? parseInt(website_id, 10) : null
        const configId = config_id ? parseInt(config_id, 10) : null

        // Kiểm tra dữ liệu có phải của người dùng không
        const websites = await websiteService.getAllWebsiteOfUser(user_id)
        const itemTypes = await itemTypeService.getAllItemTypeOfUser(user_id)
        if (websites.length == 0 || itemTypes.length == 0) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                message: 'Người dùng không có dữ liệu để xuất!'
            })
        }

        const itemsResult = []
        const lstItem = []

        // Nếu không truyền tham số lọc, xuất tất cả dữ liệu mà người dùng đã thu thập
        if (typeId == null && websiteId == null && configId == null) {
            const allConfigsOfUser = await crawlConfigService.getAllOfUser(user_id)
            for (const config of allConfigsOfUser) {
                const itemsOfConfig = await itemService.getAllItemOfConfig(config.id)
                lstItem.push(...itemsOfConfig)
            }
        } else {
            // Lọc
            lstItem.push(...await itemService.filter({ typeId, websiteId, configId }))
        }        
    
        // Lấy thông tin chi tiết của từng item
        for (const item of lstItem) {
            // Lấy danh sách chi tiết item
            const itemDetailOfItems = await itemDetailService.getAllItemDetailOfItem(item.id)
            const itemDetails = []
            for (const itemDetail of itemDetailOfItems) {
                itemDetails.push({
                    name: itemDetail.name, 
                    value: itemDetail.value
                })
            }

            // Lấy tên website
            let websiteInfo
            for (const website of websites) {
                if(website.id == item.website_id)
                {
                    websiteInfo = website
                    break
                }
            }

            // Lấy tên loại item
            let itemTypeInfo
            for (const itemType of itemTypes) {
                if(itemType.id == item.item_type_id)
                {
                    itemTypeInfo = itemType
                    break
                }
            }

            itemsResult.push({
                item: {
                    item_type: itemTypeInfo ? itemTypeInfo.type : null,
                    website_name: websiteInfo ? websiteInfo.name : null,
                    website_url: websiteInfo ? websiteInfo.url : null,
                    update_at: item.update_at,
                    item_details: itemDetails
                }
            })
        }

        // Tăng số lần xuất dữ liệu của người dùng
        await userService.increaseExportCount(user_id)
        
        // Đặt tiêu đề file và trả file về client
        res.setHeader('Content-Disposition', `attachment; filename="data.json"`)
        res.setHeader('Content-Type', 'application/octet-stream')

        res.status(HTTP_STATUS.OK).send({data: itemsResult})
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi xuất dữ liệu thu thập!',
            error: error.message
        })
    }
}

// Lấy danh sách từ khóa gợi ý tìm kiếm
exports.getSearchSuggestions = async (req, res) => {
    try {
        const {user_id} = req.params
        let {keyword} = req.query

        if (!keyword) keyword = null
        else if (keyword == '') keyword == null
        
        let lst = []
        let searchSuggestion = []

        // Kiểm tra cache trước
        if (!searchSuggestionCache[user_id] || keyword == null) {
            // Kiểm tra và xóa các cache quá hạn
            cleanupCache()

            // tạo cache mới
            if (!searchSuggestionCache[user_id])
                await createCache(user_id)
            else if (searchSuggestionCache[user_id].all_suggestions && keyword == null)
                lst = searchSuggestionCache[user_id].all_suggestions
            
            // Lấy danh sách cấu hình của người dùng
            const configs = await crawlConfigService.getAllOfUser(user_id)

            // Lấy danh sách item của từng cấu hình
            const allItem = []
            for (const config of configs) {
                const itemOfConfigs = await itemService.getAllItemOfConfig(config.id)

                allItem.push(...itemOfConfigs)
            }

            // Lấy các giá trị có chứa keyword trong từng item
            for (const item of allItem) {
                const itemDetails = await itemDetailService.getItemDetailContainKeywordOfItem(item.id, keyword)

                for (const itemDetail of itemDetails) {
                    lst.push(itemDetail.value)
                }
            }
        } else {
            let preKeyword = null
            for (const key of Object.keys(searchSuggestionCache[user_id])) {
                if (keyword.includes(key)) {
                    if (!preKeyword || key.length > preKeyword.length) {
                        preKeyword = key
                        lst = searchSuggestionCache[user_id][key]
                    }
                }
            }

            if (lst.length == 0 && searchSuggestionCache[user_id].all_suggestions)
                lst = searchSuggestionCache[user_id].all_suggestions
        }

        // Tạo danh sách gợi ý
        searchSuggestion = keyword == null ? lst : await createSuggestion(lst, keyword)
        saveCache(user_id, keyword, lst)

        res.status(HTTP_STATUS.OK).json({
            search_suggestions: searchSuggestion,
            message: 'Lấy danh sách từ khóa gợi ý tìm kiếm thành công!',
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy danh sách từ khóa gợi ý tìm kiếm!',
            error: error.message
        })
    }
}

// Tìm kiếm dữ liệu thu thập bằng từ khóa
exports.search = async (req, res) => {
    try {
        const {user_id, keyword} = req.params

        // Lấy danh sách cấu hình của người dùng
        const configs = await crawlConfigService.getAllOfUser(user_id)

        // Lấy danh sách item của từng cấu hình
        const allItem = []
        for (const config of configs) {
            const itemOfConfigs = await itemService.getAllItemOfConfig(config.id)

            allItem.push(...itemOfConfigs)
        }

        // Kiểm tra từng item có chứa từ khóa cần tìm không
        const items = []
        for (const item of allItem) {
            // Nếu có, lưu lại id item đó
            const checkResult = await itemDetailService.checkIsContainKeyword(item.id, keyword)
            if (checkResult) {
                // Lấy danh sách chi tiết item
                const itemDetails = await itemDetailService.getAllItemDetailOfItem(item.id)

                items.push({item: item, item_details: itemDetails})
            }
        }
        
        res.status(HTTP_STATUS.OK).json({
            items: items,
            message: 'Tìm kiếm dữ liệu thu thập bằng từ khóa thành công!',
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi tìm kiếm dữ liệu thu thập bằng từ khóa!',
            error: error.message
        })
    }
}

// Rút gọn gợi ý từ 1 thuộc tính (vd: tên sản phẩm) thành 1 từ, cụm từ khóa
const createSuggestion = async (lst, keyword) => {
    const combinationCounts = new Map()

    lst.forEach(value => {
        const words = value.split(' ').map(word => word.toLowerCase())
        const combinations = new Set()

        for (let start = 0; start < words.length; start++) {
            if (!words[start].includes(keyword) && !keyword.includes(words[start])) continue

            let combination = ''
            for (let end = start; end < words.length; end++) {
                combination = combination ? `${combination} ${words[end]}` : words[end]
                combinations.add(combination)
            }
        }

        combinations.forEach(combination => {
            combinationCounts.set(combination, (combinationCounts.get(combination) || 0) + 1)
        })
    })
    
    // Lấy gợi ý phù hợp và lưu vào cache
    const suggestions = getTopSuggestions(combinationCounts, keyword)

    return suggestions

}

// Hàm lấy ra các gợi ý phù hợp
const getTopSuggestions = (combinationCounts, keyword) => {
    const sortedCombinations = Array.from(combinationCounts.entries())
        .filter(([combination]) => {
            return keyword ? combination.includes(keyword.toLowerCase()) : true
        })
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([combination]) => combination)

    return sortedCombinations
}

// Hàm tạo cache cho từng user
const createCache = async (userId) => {
    searchSuggestionCache[userId] = {}
}

// Hàm lưu lại cache tìm kiếm
const saveCache = async (userId, keyword, lst) => {
    if (keyword == null) {
        searchSuggestionCache[userId].all_suggestions = lst
    } else {
        searchSuggestionCache[userId][keyword] = lst
    }
    
    // Lấy thời gian hiện tại + 30 phút
    const now = new Date();
    searchSuggestionCache[userId].expire_at = new Date(now.getTime() + 60 * 60 * 1000)
}

// Hàm xóa cache tìm kiếm
const cleanupCache = async () => {
    const now = new Date();
    const userIds = Object.keys(searchSuggestionCache);

    userIds.forEach(userId => {
        const userCache = searchSuggestionCache[userId]
        
        // Kiểm tra thời gian hết hạn
        if (userCache && userCache.expire_at && userCache.expire_at < now) {
            // Xóa nếu hết hạn
            delete searchSuggestionCache[userId]
        }
    })
}
