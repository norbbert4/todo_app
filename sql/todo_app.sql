-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 23. 17:30
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
(36, 9, '2025-03-23 15:50:25', '2025-03-23 16:28:48', '2025-03-23 16:28:50', 'c8cbf6071ee1e91169027e9d248ab4e8', 0),
(37, 9, '2025-03-23 16:29:33', '2025-03-23 16:29:50', '2025-03-23 16:29:51', 'fb7c8cc348906111a3dfb8169d2d3da2', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `todos`
--

CREATE TABLE `todos` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(40) NOT NULL,
  `date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `rewarded` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `todos`
--

INSERT INTO `todos` (`id`, `user_id`, `title`, `date`, `start_time`, `completed`, `rewarded`) VALUES
(1, 2, 'dsad', '2025-03-20', '03:10:00', 1, 1),
(2, 2, 'dsad', '2025-03-20', NULL, 0, 0),
(22, 5, 'dsada', '2025-03-20', NULL, 1, 1),
(41, 7, 'ds', '2025-03-20', NULL, 0, 1),
(55, 8, 'dsad', '2025-03-20', NULL, 1, 1),
(56, 8, 'sda', '2025-03-20', NULL, 0, 0),
(59, 2, 'dsadsa', '2025-03-21', '21:30:00', 0, 0),
(72, 10, 'fsdfafs', '2025-03-21', NULL, 1, 1),
(73, 10, 'dsdsdss', '2025-03-21', '22:30:00', 0, 0),
(75, 10, 'dsadsds', '2025-03-22', NULL, 0, 0),
(350, 11, 'dsad', '2025-03-22', NULL, 0, 1),
(351, 11, 'dsad', '2025-03-22', NULL, 0, 1),
(352, 11, 'dsad', '2025-03-28', NULL, 0, 0),
(353, 11, 'dsad', '2025-03-22', NULL, 0, 0),
(354, 11, 'dsad', '2025-03-22', '10:35:00', 0, 0),
(355, 11, 'dsad', '2025-03-22', '12:50:00', 0, 0),
(356, 11, 'dsa', '2025-03-22', '12:40:00', 0, 0),
(357, 11, 'dsad', '2025-03-22', '13:30:00', 0, 0),
(507, 13, 'dsad', '2025-03-22', NULL, 0, 0),
(527, 14, 'dsads', '2025-03-22', NULL, 0, 1),
(529, 14, 'cdsadassdsad', '2025-03-22', '22:30:00', 0, 0),
(593, 9, 'Ballagás', '2025-04-30', '10:00:00', 0, 0);

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
(1, 'user@domain.hu', 'user', '$2y$10$2w.S4PT/s0WPmTPvHSf9SuPO6cfVh5qJ8Z7Zz2QPsv4k5HjriGE2W', 1, 0),
(2, 'admin@domain.hu', 'admin', '$2y$10$kjrUKUPP/nbYWkSB7oJ27O6Y9cEaAPuDQ9h9R1ydULVFBFLWL6mWu', 1, 0),
(3, 'teszt@valami.hu', 'teszt', '$2y$10$IVVW6XOjmq.1HS5lBbq3h.W0Cn8bqWAQuXsrRYuX3WnmGQvF0PaB6', 1, 0),
(4, 'valami@valami.hu', 'bobby1', '$2y$10$eFW/lUJvvl8iAwjAyZnpgOgmI9NimXhNzkuQZFkmP0iUfr.w44Vce', 1, 0),
(9, 'pucheleandras@gmail.com', 'Andris', '$2y$10$abqYCLxHSdVRG7NpjZn8RuH0pnVTKF1qaB0rUkEluIbCzsZxUL2.C', 1, 0);

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
  MODIFY `login_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT a táblához `todos`
--
ALTER TABLE `todos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=605;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `user_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
