-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 20. 17:35
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
(4, 2, '2025-03-20 16:31:45', '2025-03-20 16:34:52', '0000-00-00 00:00:00', '43b251e7b5f3bf9cde53f26ff9db754d', 1);

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
  `completed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `todos`
--

INSERT INTO `todos` (`id`, `user_id`, `title`, `date`, `start_time`, `completed`) VALUES
(1, 2, 'dsad', '2025-03-20', '03:10:00', 0),
(2, 2, 'dsad', '2025-03-20', NULL, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `user_ID` int(11) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_pw` varchar(255) NOT NULL,
  `user_state` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`user_ID`, `user_email`, `user_name`, `user_pw`, `user_state`) VALUES
(1, 'user@domain.hu', 'user', '$2y$10$2w.S4PT/s0WPmTPvHSf9SuPO6cfVh5qJ8Z7Zz2QPsv4k5HjriGE2W', 1),
(2, 'admin@domain.hu', 'admin', '$2y$10$kjrUKUPP/nbYWkSB7oJ27O6Y9cEaAPuDQ9h9R1ydULVFBFLWL6mWu', 1),
(3, 'teszt@valami.hu', 'teszt', '$2y$10$IVVW6XOjmq.1HS5lBbq3h.W0Cn8bqWAQuXsrRYuX3WnmGQvF0PaB6', 1),
(4, 'valami@valami.hu', 'bobby1', '$2y$10$eFW/lUJvvl8iAwjAyZnpgOgmI9NimXhNzkuQZFkmP0iUfr.w44Vce', 1);

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
  MODIFY `login_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `todos`
--
ALTER TABLE `todos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `user_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
