const mysql = require('mysql2/promise')

// Lấy toàn bộ dữ liệu hệ thống
exports.getAllData = async () => {
    const { DATABASE, DB_USERNAME, PASSWORD, HOST } = process.env

    // Tạo kết nối đến cơ sở dữ liệu
    const connection = await mysql.createConnection({
        host: HOST,
        user: DB_USERNAME,
        password: PASSWORD,
        database: DATABASE
    })

    try {
        // Lấy danh sách các bảng trong cơ sở dữ liệu
        const [tables] = await connection.query('SHOW TABLES')

        // Lưu dữ liệu từ tất cả các bảng
        const data = {}

        for (const table of tables) {
            const tableName = table[`Tables_in_${DATABASE}`]

            // Truy vấn dữ liệu từ bảng
            const [rows] = await connection.execute(`SELECT * FROM ${tableName}`)
            data[tableName] = rows
        }

        // Trả dữ liệu từ tất cả các bảng
        return data
    } catch (error) {
        console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error)
        throw error
    } finally {
        // Đóng kết nối
        await connection.end()
    }
}

// Khôi phục lại dữ liệu hệ thống
exports.restore = async (data) => {
    const { DATABASE, DB_USERNAME, PASSWORD, HOST } = process.env

    // Tạo kết nối đến cơ sở dữ liệu
    const connection = await mysql.createConnection({
        host: HOST,
        user: DB_USERNAME,
        password: PASSWORD,
        database: DATABASE
    })

    try {
        // Bắt đầu một giao dịch để đảm bảo tính toàn vẹn của dữ liệu
        await connection.beginTransaction()

        // Xóa tất cả dữ liệu hiện có
        const [tables] = await connection.query('SHOW TABLES')
        for (const table of tables) {
            const tableName = table[`Tables_in_${DATABASE}`]
            await connection.query(`DELETE FROM ${tableName}`)
        }

        // Chèn lại dữ liệu vào các bảng
        for (const [tableName, rows] of Object.entries(data)) {
            if (rows.length > 0) {
                const columns = Object.keys(rows[0])
                const values = rows.map(row => columns.map(col => row[col]))
                const placeholders = values.map(() => `(${columns.map(() => '?').join(',')})`).join(',')

                const sql = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES ${placeholders}`
                await connection.query(sql, values.flat())
            }
        }

        // Cam kết giao dịch
        await connection.commit()
    } catch (error) {
        console.error('Lỗi khi khôi phục cơ sở dữ liệu:', error)

        // Nếu có lỗi, rollback giao dịch
        await connection.rollback()
        throw error
    } finally {
        // Đóng kết nối
        await connection.end()
    }
}
