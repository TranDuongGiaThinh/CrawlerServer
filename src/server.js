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

app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`)
});
