-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 10, 2024 at 03:34 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crawler_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `account_types`
--

CREATE TABLE `account_types` (
  `id` int(11) NOT NULL,
  `type` text NOT NULL,
  `description` text NOT NULL,
  `is_admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account_types`
--

INSERT INTO `account_types` (`id`, `type`, `description`, `is_admin`) VALUES
(1, 'Người quản trị', 'Tài khoản có quyền quản trị hệ thống', 1),
(2, 'Người dùng', 'Người dùng sử dụng dịch vụ của hệ thống', 0);

-- --------------------------------------------------------

--
-- Table structure for table `auto_crawls`
--

CREATE TABLE `auto_crawls` (
  `crawl_config_id` int(11) NOT NULL,
  `crawl_time` time NOT NULL,
  `expiry_date` date NOT NULL,
  `is_crawling` tinyint(1) NOT NULL,
  `update_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auto_crawls`
--

INSERT INTO `auto_crawls` (`crawl_config_id`, `crawl_time`, `expiry_date`, `is_crawling`, `update_at`) VALUES
(1, '06:00:00', '2024-10-16', 0, '2024-10-02');

-- --------------------------------------------------------

--
-- Table structure for table `crawl_action_details`
--

CREATE TABLE `crawl_action_details` (
  `id` int(11) NOT NULL,
  `crawl_config_id` int(11) NOT NULL,
  `action_type_id` int(11) NOT NULL,
  `sort_index` int(11) NOT NULL,
  `selector` text NOT NULL,
  `value` text DEFAULT NULL,
  `is_list` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crawl_action_details`
--

INSERT INTO `crawl_action_details` (`id`, `crawl_config_id`, `action_type_id`, `sort_index`, `selector`, `value`, `is_list`) VALUES
(4, 6, 2, -1, '.cancel-button-top', NULL, 0),
(5, 6, 3, 0, '.button.btn-show-more.button__show-more-product', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `crawl_action_types`
--

CREATE TABLE `crawl_action_types` (
  `id` int(11) NOT NULL,
  `type` text NOT NULL,
  `description` text NOT NULL,
  `have_value` tinyint(1) NOT NULL,
  `have_selector` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crawl_action_types`
--

INSERT INTO `crawl_action_types` (`id`, `type`, `description`, `have_value`, `have_selector`) VALUES
(1, 'Click', 'Ấn vào một đối tượng', 0, 1),
(2, 'Click when appear', 'Ấn vào khi một phần tử chỉ định xuất hiện', 0, 1),
(3, 'Show all', 'Ấn vào nút \'Xem Thêm\' cho đến khi nó không còn xuất hiện', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `crawl_configs`
--

CREATE TABLE `crawl_configs` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `url` text NOT NULL,
  `crawl_type_id` int(11) NOT NULL,
  `result_type_id` int(11) NOT NULL,
  `item_type_id` int(11) NOT NULL,
  `website_id` int(11) NOT NULL,
  `item_selector` text DEFAULT NULL,
  `http_method_id` int(11) DEFAULT NULL,
  `headers_api` text DEFAULT NULL,
  `body_api` text DEFAULT NULL,
  `is_completed` tinyint(1) NOT NULL,
  `update_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crawl_configs`
--

INSERT INTO `crawl_configs` (`id`, `parent_id`, `user_id`, `name`, `description`, `url`, `crawl_type_id`, `result_type_id`, `item_type_id`, `website_id`, `item_selector`, `http_method_id`, `headers_api`, `body_api`, `is_completed`, `update_at`) VALUES
(5, NULL, 2, 'Thu thập chi tiết sản phẩm của CellphoneS dựa trên cấu trúc HTML', 'mô tả, ghi chú', 'https://cellphones.com.vn/iphone-13.html', 1, 2, 1, 2, NULL, NULL, NULL, NULL, 0, '2024-10-08'),
(6, NULL, 2, 'Thu thập danh sách điện thoại của CellphoneS dựa trên HTML', 'Mô tả, ghi chú', 'https://cellphones.com.vn/mobile.html', 1, 1, 1, 2, '.product-info-container.product-item', NULL, NULL, NULL, 0, '2024-10-08'),
(7, NULL, 2, 'Lấy chi tiết sản phẩm Tiki bằng API', 'mô tả', 'https://tiki.vn/api/v2/products/184036446?platform=web&spid=32033721&version=3', 2, 2, 1, 1, NULL, 1, NULL, NULL, 0, '2024-10-10'),
(9, NULL, 2, 'Lấy danh sách sản phẩm Tiki bằng API', 'mô tả', 'https://tiki.vn/api/personalish/v1/blocks/listings?limit=40&include=advertisement&aggregations=2&version=home-persionalized&trackity_id=de9c7848-5276-89fb-a8cb-fd07fbc0b86b&category=1795&page=1&urlKey=dien-thoai-smartphone', 2, 1, 1, 1, 'data', 1, NULL, NULL, 0, '2024-10-10'),
(10, NULL, 2, 'lấy danh sách tin tức của TuoiTre bằng rss', 'mô tả', 'https://tuoitre.vn/rss/thoi-su.rss', 3, 1, 13, 3, 'rss.channel.item', NULL, NULL, NULL, 0, '2024-10-10');

-- --------------------------------------------------------

--
-- Table structure for table `crawl_data_types`
--

CREATE TABLE `crawl_data_types` (
  `id` int(11) NOT NULL,
  `type` text NOT NULL,
  `description` text NOT NULL,
  `have_value` tinyint(1) NOT NULL,
  `crawl_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crawl_data_types`
--

INSERT INTO `crawl_data_types` (`id`, `type`, `description`, `have_value`, `crawl_type_id`) VALUES
(1, 'Content', 'Lấy nội dung của đối tượng', 0, 1),
(2, 'Content', 'Lấy nội dung của đối tượng', 0, 2),
(3, 'Content', 'Lấy nội dung của đối tượng', 0, 3),
(4, 'Attribute', 'Lấy chi tiết thuộc tính bên trong đối tượng', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `crawl_details`
--

CREATE TABLE `crawl_details` (
  `id` int(11) NOT NULL,
  `crawl_config_id` int(11) NOT NULL,
  `sort_index` int(11) NOT NULL,
  `data_type_id` int(11) DEFAULT NULL,
  `name` text NOT NULL,
  `selector` text NOT NULL,
  `attribute` text DEFAULT NULL,
  `is_primary_key` tinyint(1) NOT NULL,
  `is_detail_url` tinyint(1) NOT NULL,
  `is_contain_keywords` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crawl_details`
--

INSERT INTO `crawl_details` (`id`, `crawl_config_id`, `sort_index`, `data_type_id`, `name`, `selector`, `attribute`, `is_primary_key`, `is_detail_url`, `is_contain_keywords`) VALUES
(4, 5, 1, 1, 'Tên sản phẩm', 'h1', NULL, 0, 0, 1),
(5, 5, 2, 1, 'Giá', 'div.tpt-box.active p.tpt---sale-price', NULL, 0, 0, 0),
(7, 6, 1, 1, 'Tên sản phẩm', 'h3', NULL, 0, 0, 1),
(8, 6, 2, 4, 'Url trang chi tiết', 'a.product__link', 'href', 1, 1, 0),
(9, 6, 3, 1, 'Giá', '.product__price--show', NULL, 0, 0, 0),
(10, 7, 1, NULL, 'Link chi tiết sản phẩm', 'url_path', NULL, 1, 1, 0),
(11, 7, 2, NULL, 'Tên sản phẩm', 'name', NULL, 0, 0, 1),
(12, 7, 4, NULL, 'Url ảnh', 'thumbnail_url', NULL, 0, 0, 0),
(13, 7, 3, NULL, 'Giá', 'price', NULL, 0, 0, 0),
(14, 9, 1, NULL, 'Url chi tiết', 'url_path', NULL, 1, 1, 0),
(15, 9, 2, NULL, 'Tên sản phẩm', 'name', NULL, 0, 0, 1),
(16, 9, 3, NULL, 'Giá', 'price', NULL, 0, 0, 0),
(17, 9, 4, NULL, 'Url ảnh', 'thumbnail_url', NULL, 0, 0, 0),
(18, 10, 1, NULL, 'Link trang chi tiết', 'link', NULL, 1, 1, 0),
(19, 10, 2, NULL, 'Tiêu đề tin tức', 'title', NULL, 0, 0, 1),
(20, 10, 3, NULL, 'Mô tả tin tức', 'description', NULL, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `crawl_result_types`
--

CREATE TABLE `crawl_result_types` (
  `id` int(11) NOT NULL,
  `type` text NOT NULL,
  `description` text NOT NULL,
  `have_value` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crawl_result_types`
--

INSERT INTO `crawl_result_types` (`id`, `type`, `description`, `have_value`) VALUES
(1, 'Multiple', 'Kết quả thu thập là danh sách các đối tượng', 1),
(2, 'Single', 'Kết quả trả về là một đối tượng', 0);

-- --------------------------------------------------------

--
-- Table structure for table `crawl_types`
--

CREATE TABLE `crawl_types` (
  `id` int(11) NOT NULL,
  `type` text NOT NULL,
  `description` text NOT NULL,
  `have_http_method` tinyint(1) NOT NULL,
  `have_actions` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crawl_types`
--

INSERT INTO `crawl_types` (`id`, `type`, `description`, `have_http_method`, `have_actions`) VALUES
(1, 'HTML', 'Loại thu thập dựa trên giao diện HTML của trang web', 0, 1),
(2, 'API', 'Loại thu thập dựa trên API mà trang web có cung cấp', 1, 0),
(3, 'RSS', 'Loại thu thập dựa trên trang RSS mà trang web có cung cấp', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `http_methods`
--

CREATE TABLE `http_methods` (
  `id` int(11) NOT NULL,
  `type` text NOT NULL,
  `description` text NOT NULL,
  `have_headers` tinyint(1) NOT NULL,
  `have_body` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `http_methods`
--

INSERT INTO `http_methods` (`id`, `type`, `description`, `have_headers`, `have_body`) VALUES
(1, 'GET', 'Loại phương thức lấy dữ liệu', 1, 0),
(2, 'POST', 'Loại phương thức tạo mới dữ liệu', 1, 1),
(3, 'PUT', 'Loại phương thức cập nhật toàn bộ dữ liệu của một đối tượng', 1, 1),
(4, 'PATCH', 'Loại phương thức cập nhật một phần dữ liệu của đối tượng', 1, 1),
(5, 'DELETE', 'Loại phương thức xóa dữ liệu', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `crawl_config_id` int(11) NOT NULL,
  `item_type_id` int(11) NOT NULL,
  `website_id` int(11) NOT NULL,
  `update_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `crawl_config_id`, `item_type_id`, `website_id`, `update_at`) VALUES
(1, 1, 1, 1, '2024-07-29');

-- --------------------------------------------------------

--
-- Table structure for table `item_details`
--

CREATE TABLE `item_details` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `value` text NOT NULL,
  `is_primary_key` tinyint(1) NOT NULL,
  `is_detail_url` tinyint(1) NOT NULL,
  `is_contain_keywords` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `item_types`
--

CREATE TABLE `item_types` (
  `id` int(11) NOT NULL,
  `type` text NOT NULL,
  `description` text NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_types`
--

INSERT INTO `item_types` (`id`, `type`, `description`, `user_id`) VALUES
(1, 'điện thoại', 'loại dữ liệu là các sản phẩm gồm điện thoại, diện thoại thông minh', 2),
(5, 'Tin tức', 'Các sản phẩm thuộc loại tin tức', 2);

-- --------------------------------------------------------

--
-- Table structure for table `package_users`
--

CREATE TABLE `package_users` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` text NOT NULL,
  `renewal_package` text NOT NULL,
  `days` int(11) NOT NULL,
  `total_price` int(11) NOT NULL,
  `max_auto_config` int(11) NOT NULL,
  `max_config` int(11) NOT NULL,
  `max_export` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `create_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `package_users`
--

INSERT INTO `package_users` (`id`, `user_id`, `user_type`, `renewal_package`, `days`, `total_price`, `max_auto_config`, `max_config`, `max_export`, `is_active`, `create_at`) VALUES
(1, 2, 'tên gói thành viên', 'tên gói gia hạn', 30, 100000, 5, 20, 100, 1, '2024-08-20');

-- --------------------------------------------------------

--
-- Table structure for table `renewal_packages`
--

CREATE TABLE `renewal_packages` (
  `id` int(11) NOT NULL,
  `type` text NOT NULL,
  `description` text NOT NULL,
  `promotion` int(11) NOT NULL,
  `days` int(11) NOT NULL,
  `deleted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `renewal_packages`
--

INSERT INTO `renewal_packages` (`id`, `type`, `description`, `promotion`, `days`, `deleted`) VALUES
(1, '1 tháng', 'Đăng ký gói sử dụng trong một tháng', 0, 30, 0),
(2, '3 tháng', 'Đăng ký gói sử dụng trong 3 tháng', 10, 90, 0),
(3, '1 năm', 'Đăng ký gói sử dụng trong một năm', 25, 366, 1);

-- --------------------------------------------------------

--
-- Table structure for table `setting`
--

CREATE TABLE `setting` (
  `id` int(11) NOT NULL,
  `app_file_path` text DEFAULT NULL,
  `instruction_file_path` text DEFAULT NULL,
  `introduction` text DEFAULT NULL,
  `footer` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `setting`
--

INSERT INTO `setting` (`id`, `app_file_path`, `instruction_file_path`, `introduction`, `footer`) VALUES
(1, 'D:\\Crawler\\crawler_server\\data\\techmo.js', 'D:\\Crawler\\crawler_server\\data\\instruction.js', '<html></html>', '<html></html>');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `account_type_id` int(11) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `fullname` text NOT NULL,
  `email` text NOT NULL,
  `phone` text NOT NULL,
  `config_count` int(11) NOT NULL,
  `export_count` int(11) NOT NULL,
  `locked` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `account_type_id`, `username`, `password`, `fullname`, `email`, `phone`, `config_count`, `export_count`, `locked`) VALUES
(1, 1, 'admin', '123456', 'adminstrator', 'adminstrator@gmail.com', '0999999999', 0, 0, 0),
(2, 2, 'tdgthinh', '123456', 'Trần Dương Gia Thịnh', 'tdgthinh@gmail.com', '0987654321', 19, 0, 0),
(3, 2, 'tdgthinh2', '123456789', 'Trần Dương Gia Thịnh', 'tdgthinh@gmail.com', '0987654321', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_types`
--

CREATE TABLE `user_types` (
  `id` int(11) NOT NULL,
  `type` text NOT NULL,
  `description` text NOT NULL,
  `max_auto_config` int(11) NOT NULL,
  `max_config` int(11) NOT NULL,
  `max_export` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `deleted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_types`
--

INSERT INTO `user_types` (`id`, `type`, `description`, `max_auto_config`, `max_config`, `max_export`, `price`, `deleted`) VALUES
(1, 'Gói dùng thử', 'Gói dùng thử trong 7 ngày', 1, 10, 20, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `websites`
--

CREATE TABLE `websites` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `url` text NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `websites`
--

INSERT INTO `websites` (`id`, `name`, `url`, `user_id`) VALUES
(1, 'Tiki', 'tiki.vn', 2),
(2, 'CellphoneS', 'cellphones.com.vn', 2),
(13, 'Tuổi trẻ', 'tuoitre.vn', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account_types`
--
ALTER TABLE `account_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `auto_crawls`
--
ALTER TABLE `auto_crawls`
  ADD PRIMARY KEY (`crawl_config_id`);

--
-- Indexes for table `crawl_action_details`
--
ALTER TABLE `crawl_action_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `crawl_action_types`
--
ALTER TABLE `crawl_action_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `crawl_configs`
--
ALTER TABLE `crawl_configs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `crawl_data_types`
--
ALTER TABLE `crawl_data_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `crawl_details`
--
ALTER TABLE `crawl_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `crawl_result_types`
--
ALTER TABLE `crawl_result_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `crawl_types`
--
ALTER TABLE `crawl_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `http_methods`
--
ALTER TABLE `http_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item_details`
--
ALTER TABLE `item_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item_types`
--
ALTER TABLE `item_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `package_users`
--
ALTER TABLE `package_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `renewal_packages`
--
ALTER TABLE `renewal_packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `setting`
--
ALTER TABLE `setting`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_types`
--
ALTER TABLE `user_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `websites`
--
ALTER TABLE `websites`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account_types`
--
ALTER TABLE `account_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `crawl_action_details`
--
ALTER TABLE `crawl_action_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `crawl_action_types`
--
ALTER TABLE `crawl_action_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `crawl_configs`
--
ALTER TABLE `crawl_configs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `crawl_data_types`
--
ALTER TABLE `crawl_data_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `crawl_details`
--
ALTER TABLE `crawl_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `crawl_result_types`
--
ALTER TABLE `crawl_result_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `crawl_types`
--
ALTER TABLE `crawl_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `http_methods`
--
ALTER TABLE `http_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `item_details`
--
ALTER TABLE `item_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `item_types`
--
ALTER TABLE `item_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `package_users`
--
ALTER TABLE `package_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `renewal_packages`
--
ALTER TABLE `renewal_packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `setting`
--
ALTER TABLE `setting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_types`
--
ALTER TABLE `user_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `websites`
--
ALTER TABLE `websites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
