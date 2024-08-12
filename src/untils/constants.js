/* Tất cả các hằng được lưu trữ ở đây */

// Các hằng cho lịch cập nhật tự động
const SCHEDULE = {
    CRON_EXPRESSION: '0 0 * * *', // Mỗi ngày vào lúc 0h00

}

// Các hằng dùng cho backup
const BACKUPS = {
    // Thư mục chứa các file backup: ...\shop-server\backups
    // Tên các file backup là: 'backup <thời gian tạo backup> .enc'
    PATH: __dirname,
    FOLDER_NAME: '../../../../backups',

    // Tên file
    // - Bắt đầu là 'backup'
    // - Phần mở rộng là '.enc'
    // - Ở giữa là thời gian tạo file (với định dạng 'yyyy_MM_dd_HHmmss')
    FILE_PREFIX: 'backup',
    FILE_EXTENSION: '.enc',
    DATE_FORMAT: 'yyyy_MM_dd_HHmmss',
};

/* 
    Các ký tự để phân tách chuỗi:
    - Do một số hạn chế trong quá trình thiết kế Database nên tạm thời có một số thuộc tính phải lưu trữ nhiều giá trị cùng lúc
    - Để tách các giá trị đó ra, ta cần có các ký tự để phân tách
*/
const DELIMITER_CHARACTERS = {
    // Ký tự phân tách mảng
    // Ví dụ: một số trường có thể chứa một danh sách (như url trong cấu hình thu thập)
    ARRAY_DELIMITER: ', ',

    // Ký tự phân cách phạm vi
    // Ví dụ: cần xóa 1 chuỗi từ a đến b người dùng có thể nhập "a...b" (option_value ở bảng chi tiết lựa chọn)
    RANGE_DELIMITER: '...',

    // Ký tự truy xuất thuộc tính thành viên
    // Ví dụ: truy xuất các thuộc tính bên trong 1 đối tượng: obj.data.name (attribute của chi tiết cấu hình với loại thu thập là API,RSS)
    MEMBER_ACCESS_CHARACTER: '.'
};

// HTTP Status Codes
const HTTP_STATUS = {
    OK: 200, // gọi api thành công
    CREATED: 201, // tạo thành công
    BAD_REQUEST: 400, // lỗi như: xóa dữ liệu thất bại vì id không tồn tại...
    UNAUTHORIZED: 401, // thông tin xác thực sai
    FORBIDDEN: 403, // người dùng không đủ quyền
    NOT_FOUND: 404, // không tìm thấy
    INTERNAL_SERVER_ERROR: 500, // gọi api gặp lỗi không xác định được
};

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
};

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
};

// Các hành động mô phỏng người dùng khi thu thập bằng HTML
const ACTIONS = {
    // CLICK_WHEN_APPEAR: 'Click when appear',
    // SHOW_ALL: 'Show all'
};

// Loại thu thập
const CRAWL_TYPES = {
    HTML: 'HTML',
    API: 'API',
    RSS: 'RSS'
};

// Kết quả thu thập
const CRAWL_RESULT_TYPES = {
    SINGLE: 'Single',
    MULTIPLE: 'Multiple'
};

// Cách thu thập
const CRAWL_DATA_TYPES = {
    CONTENT: 'content',
    COUNT: 'count',
    ATTRIBUTE: 'attribute'
};

// Hằng số về loại tài khoản
const ACCOUNT_TYPES = {
    USER_TYPE_NAME: 'Người dùng', 
};

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
    DELIMITER_CHARACTERS,
    HTTP_METHODS,
    HTTP_STATUS,
    ERROR_CODES,
    ACTIONS,
    CRAWL_TYPES,
    CRAWL_RESULT_TYPES,
    CRAWL_DATA_TYPES,
    ACCOUNT_TYPES,
    CHILD_CONFIGS,
    SCHEDULE,
    BACKUPS
};
