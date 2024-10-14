// const Product = require('../models/product_model');
// const { Op } = require('sequelize');

// // Lấy danh sách tất cả sản phẩm
// exports.getAllProduct = async () => {
//     return await Product.findAll();
// };

// const cache = {};

// exports.getSuggestions = async (key) => {
//     try {
//         // Kiểm tra và lấy dữ liệu từ cache nếu có
//         if (!cache.products) {
//             const products = await Product.findAll();
//             cache.products = products.map(product => product.name);
//             cache.combinationCounts = generateAndCountCombinations(cache.products);
//         }

//         // Lấy các gợi ý phù hợp với key
//         const suggestions = getTopSuggestions(cache.combinationCounts, key);
//        // return suggestions.slice(0, 10);
//        return suggestions;
//     } catch (error) {
//         console.error('Lỗi lấy danh sách gợi ý tìm kiếm: ', error);
//         return [];
//     }
// };

// // Hàm tạo và đếm các tổ hợp từ
// const generateAndCountCombinations = (names) => {
//     const combinationCounts = new Map();

//     names.forEach(name => {
//         const words = name.split(' ').map(word => word.toLowerCase());
//         const combinations = new Set();

//         for (let start = 0; start < words.length; start++) {
//             let combination = '';
//             for (let end = start; end < words.length; end++) {
//                 combination = combination ? `${combination} ${words[end]}` : words[end];
//                 if (combination.length > 5 && isValidCombination(combination)) {
//                     combinations.add(combination);
//                 }
//             }
//         }

//         combinations.forEach(combination => {
//             combinationCounts.set(combination, (combinationCounts.get(combination) || 0) + 1);
//         });
//     });

//     return combinationCounts;
// };

// // Hàm kiểm tra tính hợp lệ của tổ hợp từ
// const isValidCombination = (combination) => {
//     const forbiddenStartWords = ['thoại', 'hàng', 'chính', 'hãng', '(', '['];
//     if (combination.match(/\(|\)/) || !isNaN(parseInt(combination[0])) || forbiddenStartWords.some(word => combination.startsWith(word))) {
//         return false;
//     }
//     return true;
// };

// // Hàm lấy ra các gợi ý phù hợp
// const getTopSuggestions = (combinationCounts, key) => {
//     const sortedCombinations = Array.from(combinationCounts.entries())
//         .filter(([combination]) => combination.includes(key.toLowerCase()))
//         .sort(([, countA], [, countB]) => countB - countA)
//         .map(([combination]) => combination);

//     return sortedCombinations;
// };

// // Tìm kiếm sản phẩm theo tên
// exports.searchProductByName = async (name) => {
//     return await Product.findAll({
//         where: {
//             name: {
//                 [Op.like]: `%${name}%`
//             }
//         }
//     });
// };
