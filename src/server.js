require('dotenv').config();
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = process.env.PORT

const accountTypeRoute = require('./routes/account_type_route.js')
const crawlActionTypeRoute = require('./routes/crawl_action_type_route.js')
const crawlDataTypeRoute = require('./routes/crawl_data_type_route.js')
const crawlTypeRoute = require('./routes/crawl_type_route.js')
const httpMethodRoute = require('./routes/http_method_route.js')
const crawlResultTypeRoute = require('./routes/crawl_result_type_route.js')
const itemTypeRoute = require('./routes/item_type_route.js')
const websiteRoute = require('./routes/website_route.js')
const renewalPackageRoute = require('./routes/renewal_package_route.js')
const userTypeRoute = require('./routes/user_type_route.js')
const packageUserRoute = require('./routes/package_user_route.js')
const settingRoute = require('./routes/setting_route.js')
const userRoute = require('./routes/user_route.js')
const backupRoute = require('./routes/backup_route.js')
const crawlConfigRoute = require('./routes/crawl_config_route.js')
const crawlDetailRoute = require('./routes/crawl_detail_route.js')
const crawlActionDetailRoute = require('./routes/crawl_action_detail_route.js')
const autoCrawlRoute = require('./routes/auto_crawl_route.js')
const crawlingRoute = require('./routes/crawling_route.js')
const itemRoute = require('./routes/item_route.js')

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// route loại tài khoản
app.use('/account-type', accountTypeRoute)

// route loại hành động
app.use('/crawl-action-type', crawlActionTypeRoute)

// route loại cách lấy dữ liệu
app.use('/crawl-data-type', crawlDataTypeRoute)

// route loại thu thập
app.use('/crawl-type', crawlTypeRoute)

// route loại phương thức gọi API
app.use('/http-method', httpMethodRoute)

// route loại kết quả trả về khi thu thập
app.use('/crawl-result-type', crawlResultTypeRoute) 

// route chủ đề thu thập
app.use('/item-type', itemTypeRoute)

// route website thu thập
app.use('/website', websiteRoute)

// route gói gia hạn
app.use('/renewal-package', renewalPackageRoute)

// route gói thành viên
app.use('/user-type', userTypeRoute)

// route lịch sử đăng ký gói thành viên
app.use('/package-user', packageUserRoute)

// route cài đặt setting
app.use('/setting', settingRoute)

// route user
app.use('/user', userRoute)

// route backup
app.use('/backup', backupRoute)

// route cấu hình thu thập
app.use('/crawl-config', crawlConfigRoute)

// route chi tiết cấu hình thu thập
app.use('/crawl-detail', crawlDetailRoute)

// route chi tiết hành động thu thập
app.use('/crawl-action-detail', crawlActionDetailRoute)

// route thu thập tự động
app.use('/auto-crawl', autoCrawlRoute)

// route thực hiện thu thập
app.use('/crawling', crawlingRoute)

// route dữ liệu thu thập được
app.use('/item', itemRoute)

app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`)
    await checkPackageUser()
})


const cron = require('node-cron')
const {getActivePackageUsers, setActiveIsFalse} = require('./services/package_user_service.js')
const {resetPermission} = require('./services/user_service.js')

// Thực hiện xử lý các gói hết hạn vào 0:00 mỗi ngày
const hour = 0
const min = 0
cron.schedule(`${min} ${hour} * * *`, async ()  => {
    await checkPackageUser()
}, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
})

const checkPackageUser = async () => {
    try {
        const currentDate = new Date()
        const packageUsers = await getActivePackageUsers()
        for (const packageUser of packageUsers) {
            const createAt = new Date(packageUser.create_at)
            const days = packageUser.days

            // Nếu ngày hiện tại < ngày tạo + số ngày đăng ký
            const expirationDate = new Date(createAt)
            expirationDate.setDate(expirationDate.getDate() + days)

            // Kết thúc gói và reset quyền của người dùng khi hết hạn
            if (currentDate > expirationDate) {
                await setActiveIsFalse(packageUser.id)
                await resetPermission(packageUser.user_id)
            } else {
                // Nếu đến ngày gia hạn, reset quyền cho chu kỳ mới (30 ngày)
                const nextRenewalDate = new Date(createAt);
                while (nextRenewalDate < currentDate) {
                        nextRenewalDate.setDate(nextRenewalDate.getDate() + 30)
                   if (nextRenewalDate > currentDate) {
                        nextRenewalDate.setDate(nextRenewalDate.getDate() - 30)
                        break
                   }
                }
                
                if (nextRenewalDate.getDate() === currentDate.getDate() &&
                    nextRenewalDate.getMonth() === currentDate.getMonth() &&
                    nextRenewalDate.getFullYear() === currentDate.getFullYear()) {
                    await resetPermission(packageUser.user_id)
                }
            }
        }
    } catch (error) {
        console.log('Lỗi khi kiểm tra gói đăng ký hết hạn', error.message)
    }
}