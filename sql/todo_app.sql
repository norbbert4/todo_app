-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 19. 22:33
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
(1, 1, '2025-02-19 21:15:38', '2025-02-19 21:16:08', '2025-02-19 21:16:10', '3f77ebe04ced9da128e4d2567858a414', 0),
(2, 2, '2025-02-19 21:16:31', '2025-02-19 21:16:54', '2025-02-19 21:16:57', '90089b2116e784467a95cb2199f0601c', 0),
(3, 2, '2025-03-19 19:18:23', '2025-03-19 20:53:46', '2025-03-19 20:53:47', '79e397266cdb5a2b0a56389a39b88dfb', 0),
(4, 2, '2025-03-19 21:08:13', '2025-03-19 21:08:23', '2025-03-19 21:08:26', '6841c39eb884d9debf8448e174278493', 0),
(5, 3, '2025-03-19 21:17:22', '2025-03-19 21:29:20', '2025-03-19 21:29:22', 'daabf67dc061f4274e31af57b4bfb8aa', 0),
(6, 3, '2025-03-19 21:32:51', '2025-03-19 21:32:57', '2025-03-19 21:32:59', '5d95bdfe04629ffc3e21e70e28892675', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `todos`
--

CREATE TABLE `todos` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(40) NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `date` date NOT NULL DEFAULT '2025-03-15',
  `start_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `todos`
--

INSERT INTO `todos` (`id`, `user_id`, `title`, `completed`, `date`, `start_time`) VALUES
(1, 1, 'Ez egy feladat user számára', 0, '2025-03-15', NULL),
(2, 1, 'Ez egy másik feladat user számára', 0, '2025-03-15', NULL),
(3, 2, 'Ez egy feladat admin számára', 0, '2025-03-15', NULL),
(4, 2, 'Ez egy másik feladat admin számára', 0, '2025-03-15', NULL),
(5, 2, 'sdadas', 0, '2025-03-20', '17:50:00'),
(55, 3, 'dsada', 0, '2025-03-19', '02:15:00');

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
(1, 'user@domain.hu', 'user', '$2y$10$rx6C1ib2CDx/SqnpZW9BQ.kTPzOFM.l97nDUh1y8V7lQtu.a1cRuK', 1),
(2, 'admin@domain.hu', 'admin', '$2y$10$kjrUKUPP/nbYWkSB7oJ27O6Y9cEaAPuDQ9h9R1ydULVFBFLWL6mWu', 1),
(3, 'ads@gmail.com', 'a', '$2y$10$zrqNhP6vUVeDNTowFYZh1e/iZQiy1KZU2hIzMMjB12pFAGFflzXFu', 1);

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
  MODIFY `login_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `todos`
--
ALTER TABLE `todos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `user_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
