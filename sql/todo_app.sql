-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 05. 18:23
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
(1, 'Notebook', 'Notebook', 50, 1),
(2, 'Hive', 'Hive', 100, 1);

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
  MODIFY `login_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT a táblához `login_sessions`
--
ALTER TABLE `login_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT a táblához `selected_skins`
--
ALTER TABLE `selected_skins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=550;

--
-- AUTO_INCREMENT a táblához `skins`
--
ALTER TABLE `skins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `todos`
--
ALTER TABLE `todos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=642;

--
-- AUTO_INCREMENT a táblához `trusted_devices`
--
ALTER TABLE `trusted_devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `two_factor_codes`
--
ALTER TABLE `two_factor_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT a táblához `unlocked_skins`
--
ALTER TABLE `unlocked_skins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `user_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

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


CREATE TABLE delete_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    delete_token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_ID)
);