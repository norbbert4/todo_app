-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 09, 2025 at 01:32 PM
-- Server version: 10.11.10-MariaDB
-- PHP Version: 8.2.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `todo_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `logins`
--

CREATE TABLE `logins` (
  `login_id` int(11) NOT NULL,
  `login_user_id` int(11) DEFAULT NULL,
  `login_date` timestamp NULL DEFAULT NULL,
  `action_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `logout_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `login_token` varchar(32) DEFAULT NULL,
  `login_state` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logins`
--

INSERT INTO `logins` (`login_id`, `login_user_id`, `login_date`, `action_date`, `logout_date`, `login_token`, `login_state`) VALUES
(1, 1, '2024-05-17 18:33:35', '2024-05-17 18:33:49', '2024-08-23 18:18:38', 'f07a583854f3fd7b2014ee341e32950f', 0),
(2, 1, '2024-08-23 18:15:38', '2024-08-23 18:15:49', '2024-08-23 18:18:38', 'bc5ed0961963aa2d81e136c5b1776d41', 0),
(3, 1, '2024-08-23 18:20:41', '2024-08-23 18:25:25', '2025-02-05 19:59:03', '633b5e984a17a50195ed45d9c4ef23e0', 0),
(4, 1, '2025-02-05 19:32:38', '2025-02-05 19:47:42', '2025-02-05 19:59:03', '3c6317045e46daba16bdcf7f1041cd82', 0),
(5, 2, '2025-02-05 19:47:19', '2025-02-05 19:47:32', '0000-00-00 00:00:00', 'ea95dbccef5d3f0d460b9981db70433e', 1),
(6, 1, '2025-02-05 20:01:26', '2025-02-05 20:16:16', '2025-02-09 11:58:44', '238751ea5e9660c7911eab2d90909fdc', 0),
(7, 1, '2025-02-09 11:41:04', '2025-02-09 11:58:26', '2025-02-09 11:58:44', '4ef5b20e49a2df38adf8bf20c65512bf', 0),
(8, 1, '2025-02-09 11:58:51', '2025-02-09 13:11:23', '2025-02-09 13:13:01', '0c6606a6256e9939583f7cb9d8021044', 0),
(9, 1, '2025-02-09 13:16:40', '2025-02-09 13:18:22', '2025-02-09 13:23:11', '4a3e3596ae2046493d01bfced8e7861c', 0),
(10, 1, '2025-02-09 13:23:20', '2025-02-09 13:31:28', '2025-02-09 13:31:47', '8bc2b220c78f06d8ba0a6973cf5c96f0', 0);

-- --------------------------------------------------------

--
-- Table structure for table `todos`
--

CREATE TABLE `todos` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `todos`
--

INSERT INTO `todos` (`id`, `title`, `completed`) VALUES
(19, 'Tejet vegyél!!!', 0),
(20, 'Kell 1 TV újság', 1),
(25, 'Fizesd be a számlákat!', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_ID` int(11) NOT NULL,
  `user_fullname` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_pw` varchar(255) NOT NULL,
  `user_state` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_ID`, `user_fullname`, `user_name`, `user_pw`, `user_state`) VALUES
(1, 'Administrator', 'admin', '$2y$10$Fz2hM3bSQH2zZWfwdylH3.wlPnpc/.JV342pR0rrxk/qLmXLsMx26', 1),
(2, 'Felhasználó', 'user', '$2y$10$Fz2hM3bSQH2zZWfwdylH3.wlPnpc/.JV342pR0rrxk/qLmXLsMx26', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `logins`
--
ALTER TABLE `logins`
  ADD PRIMARY KEY (`login_id`),
  ADD KEY `login_user_id` (`login_user_id`);

--
-- Indexes for table `todos`
--
ALTER TABLE `todos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `logins`
--
ALTER TABLE `logins`
  MODIFY `login_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `todos`
--
ALTER TABLE `todos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `logins`
--
ALTER TABLE `logins`
  ADD CONSTRAINT `logins_ibfk_1` FOREIGN KEY (`login_user_id`) REFERENCES `users` (`user_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
