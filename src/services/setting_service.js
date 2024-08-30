const SettingModel = require('../models/setting_model')

// Lấy nội dung giới thiệu
exports.getIntroduction = async () => {
    const setting = await SettingModel.findOne()

    return setting.introduction
}

// Lấy nội dung footer
exports.getFooter = async () => {
    const setting = await SettingModel.findOne()

    return setting.footer
}

// Tải xuống ứng dụng
exports.getAppFilePath = async () => {
    const setting = await SettingModel.findOne()

    return setting.app_file_path
}

// Tải xuống hướng dẫn sử dụng
exports.getInstructionFilePath = async () => {
    const setting = await SettingModel.findOne()

    return setting.instruction_file_path
}

// Cập nhật trang giới thiệu
exports.updateIntroduction = async (newIntroduction) => {
    const setting = await SettingModel.findOne()

    setting.introduction = newIntroduction
    await setting.save()

    return setting
}

// Cập nhật footer
exports.updateFooter = async (newFooter) => {
    const setting = await SettingModel.findOne()

    setting.footer = newFooter
    await setting.save()

    return setting
}

// Cập nhật file ứng dụng
exports.updateApp = async (newPath) => {
    const setting = await SettingModel.findOne()

    setting.app_file_path = newPath
    await setting.save()

    return setting
}

// Cập nhật file hướng dẫn
exports.updateInstruction = async (newPath) => {
    const setting = await SettingModel.findOne()

    setting.instruction_file_path = newPath
    await setting.save()

    return setting
}
