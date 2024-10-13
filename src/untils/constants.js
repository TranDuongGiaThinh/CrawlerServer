/* Tất cả các hằng được lưu trữ ở đây */

// Các hằng cho lịch cập nhật tự động
const SCHEDULE = {
    CRON_EXPRESSION: '0 0 * * *', // Mỗi ngày vào lúc 0h00

}

// HTTP Status Codes
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
}

// Mã lỗi trong quá trình thu thập
const ERROR_CODES = {
    // Lỗi không xác định 
    UNKNOWN_ERROR: 'E000',

    // Lỗi không tìm thấy phần tử
    ELEMENT_NOT_FOUND: 'E001',

    // Lỗi không lấy được giá trị từ phần tử (tìm thấy phần tử nhưng không lấy được giá trị: cách lấy sai, truyền attribute sai)
    ELEMENT_VALUE_NOT_FOUND: 'E002',

    // Lỗi khi tìm danh sách item (item_selector sai)
    ITEM_LIST_NOT_FOUND: 'E003',

    // Lỗi không tìm thấy API (url không hợp lệ)
    API_NOT_FOUND: 'E004',
}

// Ký tự phân cách cac1 phần tử mảng
const DELIMITER_CHARACTERS = {
    ARRAY_DELIMITER: ', ',
    MEMBER_ACCESS_CHARACTER: '.'
}

/* 
    ---------------------------------------------------------------------------------------
    CÁC HẰNG SỐ BÊN DƯỚI BẮT BUỘC PHẢI TRÙNG KHỚP VỚI GIÁ TRỊ TRONG CÁC BẢNG TRONG DATABASE
    ---------------------------------------------------------------------------------------
*/

// HTTP Method Types
const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
}

// Các hành động mô phỏng người dùng khi thu thập bằng HTML
const ACTIONS = {
    CLICK: 'Click',
    CLICK_WHEN_APPEAR: 'Click when appear',
    SHOW_ALL: 'Show all'
}

// Loại thu thập
const CRAWL_TYPES = {
    HTML: 'HTML',
    API: 'API',
    RSS: 'RSS'
}

// Kết quả thu thập
const CRAWL_RESULT_TYPES = {
    SINGLE: 'Single',
    MULTIPLE: 'Multiple'
}

// Cách thu thập
const CRAWL_DATA_TYPES = {
    CONTENT: 'Content',
    COUNT: 'Count',
    ATTRIBUTE: 'Attribute'
}

// Hằng số về loại tài khoản
const ACCOUNT_TYPES = {
    USER_TYPE_NAME: 'Người dùng', 
}

// Các hằng cho cấu hình "con" khi tạo mới
// - Các giá trị này chỉ dùng để hiển thị (nếu cần)
// - Không bao giờ được dùng để kiểm tra logic
// - Vì các thông tin này đã có ở cấu hình "cha"
const CHILD_CONFIGS = {
    // user_id: -1,
    // name: '',
    // description: '',
    // item_type_id: null,
    // url: '',
    // website_id: null,
    // is_complete: false,
    // update_at: new Date()
}

// Export các hằng số
module.exports = {
    HTTP_METHODS,
    HTTP_STATUS,
    ERROR_CODES,
    ACTIONS,
    CRAWL_TYPES,
    CRAWL_RESULT_TYPES,
    CRAWL_DATA_TYPES,
    ACCOUNT_TYPES,
    CHILD_CONFIGS,
    DELIMITER_CHARACTERS,
    SCHEDULE
}
