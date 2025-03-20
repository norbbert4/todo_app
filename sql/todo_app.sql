-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 20. 20:08
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `todo_app`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `logins`
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
-- A tábla adatainak kiíratása `logins`
--

INSERT INTO `logins` (`login_id`, `login_user_id`, `login_date`, `action_date`, `logout_date`, `login_token`, `login_state`) VALUES
(1, 2, '2025-03-19 19:11:27', '2025-03-19 19:11:29', '2025-03-19 19:11:40', 'd7ad99239aaa625bc280e7b315dca315', 0),
(2, 4, '2025-03-19 19:12:06', '2025-03-19 20:31:51', '2025-03-19 20:31:53', '5c2f564d3c100b30787119d26e111761', 0),
(3, 4, '2025-03-19 20:32:02', '2025-03-19 20:48:33', '0000-00-00 00:00:00', 'fe0bf4abbf2dc4a14592c9e238f6632e', 1),
(4, 2, '2025-03-20 16:31:45', '2025-03-20 16:34:52', '0000-00-00 00:00:00', '43b251e7b5f3bf9cde53f26ff9db754d', 1),
(5, 1, '2025-03-20 16:38:23', '2025-03-20 16:40:15', '2025-03-20 16:40:55', '96ab8329cafbb9f75f3c698e34b8e3a3', 0),
(6, 1, '2025-03-20 16:53:45', '2025-03-20 17:14:20', '0000-00-00 00:00:00', '7a7dec2dcb1dffd6f1400f3fb925a03d', 1),
(7, 5, '2025-03-20 17:15:17', '2025-03-20 17:15:25', '2025-03-20 17:16:51', '392987c41d77f2200212f400c2d38873', 0),
(8, 5, '2025-03-20 17:16:54', '2025-03-20 17:16:56', '0000-00-00 00:00:00', 'af6eadb1880186159bfba0da194efe1e', 1),
(9, 6, '2025-03-20 17:31:36', '2025-03-20 17:32:51', '2025-03-20 17:32:53', '606ebffc89cc0e5ae11ae8bbf3a03372', 0),
(10, 6, '2025-03-20 17:32:57', '2025-03-20 17:33:10', '2025-03-20 17:33:14', '93ed8d3309ba615667ef9b1b4b17e6e9', 0),
(11, 6, '2025-03-20 17:38:26', '2025-03-20 17:40:33', '2025-03-20 17:40:34', '7dbee209f10ca9c6eb24b9abf162dff3', 0),
(12, 6, '2025-03-20 17:46:22', '2025-03-20 18:10:29', '0000-00-00 00:00:00', 'facf412155021645352f59dd63b99b59', 1),
(13, 7, '2025-03-20 18:11:02', '2025-03-20 18:27:07', '2025-03-20 18:27:16', '61c487307acfdec8f6f40c765e5d5a2d', 0),
(14, 8, '2025-03-20 18:27:37', '2025-03-20 19:03:57', '2025-03-20 19:04:01', '0d25406bb74a4a6938013f00fad3fb19', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `todos`
--

CREATE TABLE `todos` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `rewarded` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `todos`
--

INSERT INTO `todos` (`id`, `user_id`, `title`, `date`, `start_time`, `completed`, `rewarded`) VALUES
(1, 2, 'dsad', '2025-03-20', '03:10:00', 0, 0),
(2, 2, 'dsad', '2025-03-20', NULL, 0, 0),
(22, 5, 'dsada', '2025-03-20', NULL, 1, 1),
(41, 7, 'ds', '2025-03-20', NULL, 0, 1),
(55, 8, 'dsad', '2025-03-20', NULL, 1, 1),
(56, 8, 'sda', '2025-03-20', NULL, 0, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `user_ID` int(11) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_pw` varchar(255) NOT NULL,
  `user_state` int(11) NOT NULL,
  `coins` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`user_ID`, `user_email`, `user_name`, `user_pw`, `user_state`, `coins`) VALUES
(1, 'user@domain.hu', 'user', '$2y$10$2w.S4PT/s0WPmTPvHSf9SuPO6cfVh5qJ8Z7Zz2QPsv4k5HjriGE2W', 1, 4),
(2, 'admin@domain.hu', 'admin', '$2y$10$kjrUKUPP/nbYWkSB7oJ27O6Y9cEaAPuDQ9h9R1ydULVFBFLWL6mWu', 1, 0),
(3, 'teszt@valami.hu', 'teszt', '$2y$10$IVVW6XOjmq.1HS5lBbq3h.W0Cn8bqWAQuXsrRYuX3WnmGQvF0PaB6', 1, 0),
(4, 'valami@valami.hu', 'bobby1', '$2y$10$eFW/lUJvvl8iAwjAyZnpgOgmI9NimXhNzkuQZFkmP0iUfr.w44Vce', 1, 0),
(5, 'example@gmail.com', 'a', '$2y$10$3IekJzDAkasofGevIi/AIeCsBL7c5JUBZOUuFYFnHvQb6UDe7u6oe', 1, 1),
(6, 'dsdas@gmail.com', '3', '$2y$10$XUVLV7eHZCA4ORXvEFUOU.mL5rGwe655qjwXfHSO/SUY1ZE8kBeYG', 1, 0),
(7, 'dsd@gmail.com', '4', '$2y$10$H6zopf0fPntRyFpyWn6ezegSsGFFyrd9DPMc6AUBdVjjegQwd6isW', 1, 2),
(8, 'dsadsa@gmail.com', 'Sándor', '$2y$10$yCfqsLIGOmC8dj1ykmNlVOWUGF0tPHXDGcb8haXNMqr69bArwfUAa', 1, 12);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `logins`
--
ALTER TABLE `logins`
  ADD PRIMARY KEY (`login_id`),
  ADD KEY `login_user_id` (`login_user_id`);

--
-- A tábla indexei `todos`
--
ALTER TABLE `todos`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_ID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `logins`
--
ALTER TABLE `logins`
  MODIFY `login_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT a táblához `todos`
--
ALTER TABLE `todos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `user_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `logins`
--
ALTER TABLE `logins`
  ADD CONSTRAINT `logins_ibfk_1` FOREIGN KEY (`login_user_id`) REFERENCES `users` (`user_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
