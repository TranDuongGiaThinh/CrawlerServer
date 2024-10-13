const HttpMethodModel = require('../models/http_method_model')

// Lấy danh sách loại phương thức http
exports.getAll = async () => {
    const httpMethods = await HttpMethodModel.findAll()

    return httpMethods
}

// Lấy loại phương thức http
exports.get = async (id) => {
    const httpMethod = await HttpMethodModel.findByPk(id)

    return httpMethod
}