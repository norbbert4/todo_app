-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 30. 20:08
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
(37, 9, '2025-03-23 16:29:33', '2025-03-23 16:29:50', '2025-03-23 16:29:51', 'fb7c8cc348906111a3dfb8169d2d3da2', 0),
(43, 4, '2025-03-26 19:50:30', '2025-03-26 22:48:10', '2025-03-26 22:48:13', '3611a819518779986f3dca2bacdd05e1', 0),
(44, 4, '2025-03-26 22:48:15', '2025-03-26 23:15:36', '2025-03-26 23:15:40', '9b2ab9e51ea5b2e8b84a42921ba1e01f', 0),
(45, 4, '2025-03-26 23:15:42', '2025-03-26 23:18:03', '2025-03-26 23:18:03', '675e294edd3138088c4c04900df9e85b', 0),
(46, 4, '2025-03-26 23:18:04', '2025-03-26 23:35:20', '2025-03-26 23:35:22', '85ccc36f0cbd36da8e8ede83084107d1', 0),
(47, 4, '2025-03-26 23:35:23', '2025-03-26 23:35:49', '2025-03-30 13:26:21', '65b563274a5b2107fa0c48c9f55b4f88', 0),
(49, 9, '2025-03-30 11:39:08', '2025-03-30 11:39:10', '2025-03-30 12:00:52', 'd435e8762dab7e6b4a0ccceba06d2bd8', 0),
(51, 9, '2025-03-30 11:57:22', '2025-03-30 11:57:24', '2025-03-30 12:00:52', '2d62fb4f9374095e8ffa2b4606cd0bec', 0),
(52, 9, '2025-03-30 12:00:43', '2025-03-30 12:00:51', '2025-03-30 12:00:52', '2472ac545d9c810c2d473ec5b05337b8', 0),
(54, 9, '2025-03-30 12:09:42', '2025-03-30 12:09:47', '2025-03-30 12:09:48', 'df4646c494fdeb7e3ae7be50997b7c7d', 0),
(59, 9, '2025-03-30 12:24:52', '2025-03-30 12:25:00', '2025-03-30 12:25:03', 'b7952d6ffb0c78c8bcacc7ed07e81b45', 0),
(70, 9, '2025-03-30 13:57:33', '2025-03-30 13:57:45', '2025-03-30 13:58:05', '15489e474a05886f0115a45e6fb466f5', 0),
(78, 9, '2025-03-30 17:05:13', '2025-03-30 17:05:20', '2025-03-30 17:05:21', '0c960c3338d8da0ffdc2aa0d39c534d7', 0),
(89, 4, '2025-03-30 17:50:33', '2025-03-30 17:50:39', '2025-03-30 17:50:39', '66b0156a829f3f117a358e7d2147cfcf', 0),
(96, 9, '2025-03-30 17:54:06', '2025-03-30 17:54:08', '2025-03-30 17:54:47', 'de3910d7ad9703c94c9ea5a4444b6a25', 0),
(97, 9, '2025-03-30 17:54:11', '2025-03-30 17:54:19', '2025-03-30 17:54:47', '09bc8c2935409ed585c4cd90b1c12fab', 0),
(98, 9, '2025-03-30 17:55:26', '2025-03-30 17:55:33', '2025-03-30 17:55:33', '9ebe991e008450d24be9e96185c93321', 0),
(99, 34, '2025-03-30 18:05:14', '2025-03-30 18:05:20', '2025-03-30 18:05:21', 'f531a909dc51c20ad46d25bad8abb5b9', 0),
(100, 34, '2025-03-30 18:05:32', '2025-03-30 18:05:34', '2025-03-30 18:05:35', '766f36a06c834f27961e2d9f0aa52cde', 0),
(101, 34, '2025-03-30 18:05:44', '2025-03-30 18:05:48', '2025-03-30 18:05:49', '68ed8272f6bba1bd20716ab91cb3012b', 0),
(102, 34, '2025-03-30 18:05:51', '2025-03-30 18:05:53', '2025-03-30 18:06:16', '399668a683fa6d420cc9e2fc55d71002', 0),
(103, 34, '2025-03-30 18:06:12', '2025-03-30 18:06:15', '2025-03-30 18:06:16', '220467251cea54c549e18ae9dcc52958', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `login_sessions`
--

CREATE TABLE `login_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_id` varchar(32) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NOT NULL DEFAULT (current_timestamp() + interval 5 minute)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `login_sessions`
--

INSERT INTO `login_sessions` (`id`, `user_id`, `session_id`, `created_at`, `expires_at`) VALUES
(1, 15, '56177156f3cfc0920e41fec5745ff01c', '2025-03-30 10:19:58', '2025-03-30 10:24:58'),
(2, 15, '91ccc8662587d4a8d01c951e70549b5a', '2025-03-30 10:20:17', '2025-03-30 10:25:17'),
(3, 15, '2f57c8c3a77e365ad64d6b142835c772', '2025-03-30 10:20:47', '2025-03-30 10:25:47'),
(4, 15, '1d9e2487ba7df16f98ba45a2998de0bb', '2025-03-30 10:23:56', '2025-03-30 10:28:56'),
(5, 15, '4631a286e33470a9a8e978bace751949', '2025-03-30 10:24:23', '2025-03-30 10:29:23'),
(6, 17, '6b3173f76c9c04b72ff7cc0ded9438b1', '2025-03-30 10:28:08', '2025-03-30 10:33:08'),
(9, 18, 'a3ffd3ceb0bceb2d38c0bb0ef5350857', '2025-03-30 11:41:55', '2025-03-30 11:46:55'),
(10, 18, 'eb68786a4db6516f118dcff17d54ee49', '2025-03-30 11:42:06', '2025-03-30 11:47:06'),
(17, 21, 'b5759b494219a3badf89fed1f7ea81e3', '2025-03-30 12:54:23', '2025-03-30 12:59:23'),
(18, 21, '5af8b6d6a3eed6c71bbe8f2a9ff8be2d', '2025-03-30 12:54:35', '2025-03-30 12:59:35'),
(19, 21, '6feb3e963b7345704ac2dc3a345b6dcc', '2025-03-30 12:59:56', '2025-03-30 13:04:56'),
(24, 23, '439eb442f5e2e79026185b27ecbbcdd9', '2025-03-30 13:34:57', '2025-03-30 13:39:57'),
(26, 24, 'f5e03685bf1968eae0cc998b9177d1fb', '2025-03-30 13:47:18', '2025-03-30 13:52:18'),
(29, 25, '40698484cfc75359fdb22f66d7de3e83', '2025-03-30 13:58:08', '2025-03-30 14:03:08'),
(30, 26, '5402e29c5426a71ef8d1259de7f8824a', '2025-03-30 16:43:04', '2025-03-30 16:48:04'),
(43, 32, '1ffdca862f7e34cad463b8139d2ef23f', '2025-03-30 17:43:11', '2025-03-30 17:53:11');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `selected_skins`
--

CREATE TABLE `selected_skins` (
  `id` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `skinID` int(11) NOT NULL,
  `select_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `selected_skins`
--

INSERT INTO `selected_skins` (`id`, `userID`, `skinID`, `select_date`) VALUES
(63, 4, 0, '2025-03-30 19:50:39');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `skins`
--

CREATE TABLE `skins` (
  `id` int(11) NOT NULL,
  `skin_name` varchar(255) NOT NULL,
  `css_file` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `listable` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `skins`
--

INSERT INTO `skins` (`id`, `skin_name`, `css_file`, `price`, `listable`) VALUES
(0, 'Default', 'default', 10, 0),
(1, 'Dark', 'dark', 5, 1),
(2, 'Arc Dark', 'arcdark', 10, 1);

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
(59, 2, 'dsadsa', '2025-03-21', '21:30:00', 0, 0),
(593, 9, 'Ballagás', '2025-04-30', '10:00:00', 0, 0),
(605, 4, 'Ez egy teendő', '2025-03-26', '03:25:00', 1, 1),
(607, 4, 'asdasd', '2025-03-26', NULL, 1, 1),
(608, 4, 'asdasdasd', '2025-03-26', NULL, 1, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `trusted_devices`
--

CREATE TABLE `trusted_devices` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `device_token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NOT NULL DEFAULT (current_timestamp() + interval 30 day)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `trusted_devices`
--

INSERT INTO `trusted_devices` (`id`, `user_id`, `device_token`, `created_at`, `expires_at`) VALUES
(9, 34, '01dbe1d034b169a92fb739ddd5c0cd0973dd45ac0b0e1abb669fc7ab633794fd', '2025-03-30 18:05:44', '2025-04-29 18:05:44');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `two_factor_codes`
--

CREATE TABLE `two_factor_codes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `temp_code` varchar(6) NOT NULL,
  `persistent_code` varchar(6) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL,
  `persistent_expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `two_factor_codes`
--

INSERT INTO `two_factor_codes` (`id`, `user_id`, `temp_code`, `persistent_code`, `created_at`, `expires_at`, `persistent_expires_at`) VALUES
(45, 34, '311879', '493181', '2025-03-30 18:06:04', '2025-03-30 18:06:12', '2025-04-29 18:06:04');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `unlocked_skins`
--

CREATE TABLE `unlocked_skins` (
  `id` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `skinID` int(11) NOT NULL,
  `unlock_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `unlocked_skins`
--

INSERT INTO `unlocked_skins` (`id`, `userID`, `skinID`, `unlock_date`) VALUES
(1, 4, 1, '2025-03-26 19:18:46'),
(2, 4, 2, '2025-03-26 19:18:46');

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
  `two_factor_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `coins` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`user_ID`, `user_email`, `user_name`, `user_pw`, `user_state`, `two_factor_enabled`, `coins`) VALUES
(1, 'user@domain.hu', 'user', '$2y$10$2w.S4PT/s0WPmTPvHSf9SuPO6cfVh5qJ8Z7Zz2QPsv4k5HjriGE2W', 1, 0, 0),
(2, 'admin@domain.hu', 'admin', '$2y$10$kjrUKUPP/nbYWkSB7oJ27O6Y9cEaAPuDQ9h9R1ydULVFBFLWL6mWu', 1, 0, 0),
(3, 'teszt@valami.hu', 'teszt', '$2y$10$IVVW6XOjmq.1HS5lBbq3h.W0Cn8bqWAQuXsrRYuX3WnmGQvF0PaB6', 1, 0, 0),
(4, 'valami@valami.hu', 'bobby1', '$2y$10$eFW/lUJvvl8iAwjAyZnpgOgmI9NimXhNzkuQZFkmP0iUfr.w44Vce', 1, 0, 3),
(9, 'pucheleandras@gmail.com', 'Andris', '$2y$10$abqYCLxHSdVRG7NpjZn8RuH0pnVTKF1qaB0rUkEluIbCzsZxUL2.C', 1, 0, 0),
(34, 'pistahogyvan2@gmail.com', 'aa', '$2y$10$McF3f/bQCITufTPOGKnbJesTE7Nt97z16MYym9j.5pHsXNFypGEPW', 1, 1, 0);

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
-- A tábla indexei `login_sessions`
--
ALTER TABLE `login_sessions`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`token`);

--
-- A tábla indexei `selected_skins`
--
ALTER TABLE `selected_skins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sskinID` (`skinID`),
  ADD KEY `suserID` (`userID`);

--
-- A tábla indexei `skins`
--
ALTER TABLE `skins`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `todos`
--
ALTER TABLE `todos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tuser_id` (`user_id`);

--
-- A tábla indexei `trusted_devices`
--
ALTER TABLE `trusted_devices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `two_factor_codes`
--
ALTER TABLE `two_factor_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `unlocked_skins`
--
ALTER TABLE `unlocked_skins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uskinID` (`skinID`),
  ADD KEY `uuserID` (`userID`);

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
  MODIFY `login_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT a táblához `login_sessions`
--
ALTER TABLE `login_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT a táblához `selected_skins`
--
ALTER TABLE `selected_skins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT a táblához `skins`
--
ALTER TABLE `skins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `todos`
--
ALTER TABLE `todos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=613;

--
-- AUTO_INCREMENT a táblához `trusted_devices`
--
ALTER TABLE `trusted_devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT a táblához `two_factor_codes`
--
ALTER TABLE `two_factor_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT a táblához `unlocked_skins`
--
ALTER TABLE `unlocked_skins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `user_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `logins`
--
ALTER TABLE `logins`
  ADD CONSTRAINT `fk_logins_users` FOREIGN KEY (`login_user_id`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `selected_skins`
--
ALTER TABLE `selected_skins`
  ADD CONSTRAINT `fk_selectedskins_skins` FOREIGN KEY (`skinID`) REFERENCES `skins` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_selectedskins_users` FOREIGN KEY (`userID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `todos`
--
ALTER TABLE `todos`
  ADD CONSTRAINT `fk_todos_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `trusted_devices`
--
ALTER TABLE `trusted_devices`
  ADD CONSTRAINT `trusted_devices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `two_factor_codes`
--
ALTER TABLE `two_factor_codes`
  ADD CONSTRAINT `two_factor_codes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `unlocked_skins`
--
ALTER TABLE `unlocked_skins`
  ADD CONSTRAINT `fk_unlockedskins_skins` FOREIGN KEY (`skinID`) REFERENCES `skins` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_unlockedskins_users` FOREIGN KEY (`userID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
