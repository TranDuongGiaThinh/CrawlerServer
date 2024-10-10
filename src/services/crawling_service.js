const crawlConfigService = require('../services/crawl_config_service')
const crawlDetailService = require('../services/crawl_detail_service')
const actionDetailService = require('../services/crawl_action_detail_service')
const crawlTypeService = require('../services/crawl_type_service')
const crawlResultTypeService = require('../services/crawl_result_type_service')

const htmlCrawlService = require('../services/html_crawl_service')
const apiCrawlService = require('../services/api_crawl_service')
const rssCrawlService = require('../services/rss_crawl_service')

const { CRAWL_RESULT_TYPES, CRAWL_TYPES} = require('../untils/constants')

// Lấy tất cả thông tin của một cấu hình thu thập
exports.getConfigInfor = async (configId) => {
    // Lấy thông tin từ bảng crawl_configs
    const crawlConfigResult = await crawlConfigService.get(configId)

    // Lấy thông tin từ bảng crawl_action_details
    const actionDetailResults = await actionDetailService.getAllOfConfig(configId)

    // Lấy thông tin từ bảng crawl_details và crawl_option_details
    const crawlDetails = await crawlDetailService.getAllOfConfig(configId)

    // Lấy danh sách cấu hình con
    const childConfigs = await crawlConfigService.getListChildConfigs(configId)

    // Lấy tất cả thông tin cấu hình của từ cấu hình con
    const childConfigInfors = []
    if (childConfigs.length > 0) {
        for (const childConfig of childConfigs) {
            const childConfigInfor = await this.getConfigInfor(childConfig.id)

            childConfigInfors.push(childConfigInfor)
        }
    }

    // Trả về kết quả
    return { 
        crawl_config: crawlConfigResult,
        crawl_action_details: actionDetailResults,
        crawl_details: crawlDetails,
        child_configs: childConfigInfors
    }
}

// Hàm thực hiện thu thập dữ liệu
exports.handleCrawlingData = async (crawlConfigInfor, browserObj) => {
    // Lấy loại thu thập (trang danh sách hay trang chi tiết)
    const crawlType = (await crawlTypeService.get(crawlConfigInfor.crawl_config.crawl_type_id)).type
    const resultType = (await crawlResultTypeService.get(crawlConfigInfor.crawl_config.result_type_id)).type

    // Kết quả thu thập
    let crawlResult = []

    // Thực hiện thu thập theo từng loại
    if (crawlType == CRAWL_TYPES.HTML) {
        if(resultType == CRAWL_RESULT_TYPES.SINGLE) {
            crawlResult = await htmlCrawlService.singleCrawl(
                crawlConfigInfor.crawl_config, 
                crawlConfigInfor.crawl_action_details, 
                crawlConfigInfor.crawl_details, 
                browserObj
            )
        } else if (resultType == CRAWL_RESULT_TYPES.MULTIPLE) {
            crawlResult = await htmlCrawlService.multiCrawl(
                crawlConfigInfor.crawl_config, 
                crawlConfigInfor.crawl_action_details, 
                crawlConfigInfor.crawl_details, 
                browserObj
            )
        }
    } else if (crawlType == CRAWL_TYPES.API) {
        if(resultType == CRAWL_RESULT_TYPES.SINGLE) {
            crawlResult = await apiCrawlService.singleCrawl(
                crawlConfigInfor.crawl_config, 
                crawlConfigInfor.crawl_details
            )
        } else if (resultType == CRAWL_RESULT_TYPES.MULTIPLE) {
            crawlResult = await apiCrawlService.multiCrawl(
                crawlConfigInfor.crawl_config, 
                crawlConfigInfor.crawl_details
            )
        }
    } else if (crawlType == CRAWL_TYPES.RSS) {
        if(resultType == CRAWL_RESULT_TYPES.SINGLE) {
            crawlResult = await rssCrawlService.singleCrawl(
                crawlConfigInfor.crawl_config, 
                crawlConfigInfor.crawl_details
            )
        } else if (resultType == CRAWL_RESULT_TYPES.MULTIPLE) {
            crawlResult = await rssCrawlService.multiCrawl(
                crawlConfigInfor.crawl_config,
                crawlConfigInfor.crawl_details
            )
        }
    }

    // Thực hiện vào trang chi tiết của từng item (nếu có cấu hình con)
    const childConfigs = crawlConfigInfor.child_configs
    if (childConfigs) {
        if (childConfigs.length > 0) {
            for (const childConfigInfor of childConfigs) {
                for (let i = 0; i < crawlResult.items.length; i++) {
                    for (const itemDetail of crawlResult.items[i]) {
                        if (itemDetail.is_detail_url) {
                            childConfigInfor.crawl_config.url = itemDetail.value

                            const childCrawlResult = await this.handleCrawlingData(childConfigInfor, browserObj)

                            for ( const itemDetail of childCrawlResult.items){
                                crawlResult.items[i].push(...itemDetail)
                            }

                            break
                        }
                    }
                }
            }
        }
    }

    // Trả về danh sách item thu thập được và các lỗi trong quá trình thu thập
    return {
        items: crawlResult.items, 
        errors: crawlResult.errors
    }
}
