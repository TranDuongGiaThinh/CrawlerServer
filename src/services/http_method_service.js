const HttpMethodModel = require('../models/http_method_model')

// Lấy danh sách loại hành động
exports.getAll = async () => {
    const httpMethods = await HttpMethodModel.findAll()

    return httpMethods
}