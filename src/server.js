require('dotenv').config();
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const cron = require('node-cron')

const app = express()
const port = process.env.PORT

const { SCHEDULE } = require('./untils//constants.js')

const accountTypeRoute = require('./routes/account_type_route.js')
const crawlActionTypeRoute = require('./routes/crawl_action_type_route.js')
const crawlDataTypeRoute = require('./routes/crawl_data_type_route.js')
const crawlTypeRoute = require('./routes/crawl_type_route.js')

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

app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`)
});

// Lênh lịch cập nhật tự động
// cron.schedule(SCHEDULE.CRON_EXPRESSION, async () => {
//     try {
//         //
//     } catch (error) {
//         // console.error('Lỗi khi cập nhật dữ liệu hàng ngày:', error);
//     }
// });
