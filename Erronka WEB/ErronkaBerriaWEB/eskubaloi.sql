-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-04-2026 a las 09:13:13
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `eskubaloi`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `ActualizarClasificacion` (IN `temporada_in` VARCHAR(10))   BEGIN
    -- Lógica para la temporada 24-25
    IF `temporada_in` = '24-25' THEN
        DELETE FROM `sailkapena_24_25`;
        INSERT INTO `sailkapena_24_25` (taldea, JP, IrP, BerP, GaP, AG, KG, puntuak)
        SELECT 
            taldea,
            COUNT(*) as JP,
            SUM(CASE WHEN resultado = 'GANADO' THEN 1 ELSE 0 END) as IrP,
            SUM(CASE WHEN resultado = 'EMPATE' THEN 1 ELSE 0 END) as BerP,
            SUM(CASE WHEN resultado = 'PERDIDO' THEN 1 ELSE 0 END) as GaP,
            SUM(goles_favor) as AG,
            SUM(goles_contra) as KG,
            (SUM(CASE WHEN resultado = 'GANADO' THEN 1 ELSE 0 END) * 2 + 
             SUM(CASE WHEN resultado = 'EMPATE' THEN 1 ELSE 0 END)) as puntuak
        FROM (
            SELECT 
                Talde_lokala as taldea, Golak_lokala as goles_favor, Golak_kanpokoak as goles_contra,
                CASE WHEN Golak_lokala > Golak_kanpokoak THEN 'GANADO' WHEN Golak_lokala = Golak_kanpokoak THEN 'EMPATE' ELSE 'PERDIDO' END as resultado
            FROM partidua 
            WHERE denboraldia = '24-25' AND Golak_lokala IS NOT NULL
            UNION ALL
            SELECT 
                Kampoko_taldea as taldea, Golak_kanpokoak as goles_favor, Golak_lokala as goles_contra,
                CASE WHEN Golak_kanpokoak > Golak_lokala THEN 'GANADO' WHEN Golak_kanpokoak = Golak_lokala THEN 'EMPATE' ELSE 'PERDIDO' END as resultado
            FROM partidua 
            WHERE denboraldia = '24-25' AND Golak_lokala IS NOT NULL
        ) as t
        GROUP BY taldea
        ORDER BY puntuak DESC, (SUM(goles_favor) - SUM(goles_contra)) DESC;
    END IF;

    -- Lógica para la temporada 25-26
    IF `temporada_in` = '25-26' THEN
        DELETE FROM `sailkapena_25_26`;
        INSERT INTO `sailkapena_25_26` (taldea, JP, IrP, BerP, GaP, AG, KG, puntuak)
        SELECT 
            taldea,
            COUNT(*) as JP,
            SUM(CASE WHEN resultado = 'GANADO' THEN 1 ELSE 0 END) as IrP,
            SUM(CASE WHEN resultado = 'EMPATE' THEN 1 ELSE 0 END) as BerP,
            SUM(CASE WHEN resultado = 'PERDIDO' THEN 1 ELSE 0 END) as GaP,
            SUM(goles_favor) as AG,
            SUM(goles_contra) as KG,
            (SUM(CASE WHEN resultado = 'GANADO' THEN 1 ELSE 0 END) * 2 + 
             SUM(CASE WHEN resultado = 'EMPATE' THEN 1 ELSE 0 END)) as puntuak
        FROM (
            SELECT 
                Talde_lokala as taldea, Golak_lokala as goles_favor, Golak_kanpokoak as goles_contra,
                CASE WHEN Golak_lokala > Golak_kanpokoak THEN 'GANADO' WHEN Golak_lokala = Golak_kanpokoak THEN 'EMPATE' ELSE 'PERDIDO' END as resultado
            FROM partidua 
            WHERE denboraldia = '25-26' AND Golak_lokala IS NOT NULL
            UNION ALL
            SELECT 
                Kampoko_taldea as taldea, Golak_kanpokoak as goles_favor, Golak_lokala as goles_contra,
                CASE WHEN Golak_kanpokoak > Golak_lokala THEN 'GANADO' WHEN Golak_kanpokoak = Golak_lokala THEN 'EMPATE' ELSE 'PERDIDO' END as resultado
            FROM partidua 
            WHERE denboraldia = '25-26' AND Golak_lokala IS NOT NULL
        ) as t
        GROUP BY taldea
        ORDER BY puntuak DESC, (SUM(goles_favor) - SUM(goles_contra)) DESC;
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entrenatzailea`
--

CREATE TABLE `entrenatzailea` (
  `NANa` varchar(9) NOT NULL,
  `Izen_abizena` varchar(100) NOT NULL,
  `Titulazioa` varchar(50) DEFAULT NULL,
  `taldea` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `entrenatzailea`
--

INSERT INTO `entrenatzailea` (`NANa`, `Izen_abizena`, `Titulazioa`, `taldea`) VALUES
('70000001A', 'Gorka Etxeberria Lasa', 'Goi-mailako Teknikaria', 'San Adrian'),
('70000002B', 'Mikel Ituarte Mendizabal', 'Estatuko Entrenatzailea', 'Kukullaga'),
('70000003C', 'Amaia Agirreurreta Elorza', 'Lurraldeko Entrenatzailea', 'Irauli Bosteko'),
('70000004D', 'Bittor Arana Goiri', 'Goi-mailako Teknikaria', 'Berango Urduliz'),
('70000005E', 'Iñaki Ugarteburu Artola', 'Estatuko Entrenatzailea', 'Aloña Mendi'),
('70000006F', 'Maite Azkue Olaizola', 'Lurraldeko Entrenatzailea', 'Amezti Zarautz');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `epailea`
--

CREATE TABLE `epailea` (
  `NANa` varchar(9) NOT NULL,
  `Izen_abizena` varchar(100) NOT NULL,
  `Maila` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `epailea`
--

INSERT INTO `epailea` (`NANa`, `Izen_abizena`, `Maila`) VALUES
('80000001A', 'Jon Urkidi Artetxe', 'Nazionala'),
('80000002B', 'Ane Mendizabal Goti', 'Nazionala'),
('80000003C', 'Kepa Arrate Zubia', 'Lurraldekoa'),
('80000004D', 'Maider Elorriaga Laka', 'Lurraldekoa'),
('80000005E', 'Unai Goikoetxea Lasa', 'Lehen mailakoa'),
('80000006F', 'Itziar Agirre Beloki', 'Lehen mailakoa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jokalaria`
--

CREATE TABLE `jokalaria` (
  `NANa` varchar(9) NOT NULL,
  `Izen_abizena` varchar(100) NOT NULL,
  `Dortsala` int(11) DEFAULT NULL,
  `Posizioa` varchar(30) DEFAULT NULL,
  `Jaiotze_data` date DEFAULT NULL,
  `taldea` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `jokalaria`
--

INSERT INTO `jokalaria` (`NANa`, `Izen_abizena`, `Dortsala`, `Posizioa`, `Jaiotze_data`, `taldea`) VALUES
('10000001A', 'Iker Zubizarreta Lasa', 1, 'Atezaina', '2004-05-12', 'San Adrian'),
('10000002B', 'Aimar Etxeberria Agirre', 10, 'Pibotea', '2001-11-20', 'San Adrian'),
('10000003C', 'Hegoi Mendizabal Beloki', 7, 'Ezkerraldeko hegala', '2007-03-15', 'San Adrian'),
('10000004D', 'Jon Ander Garcia', 22, 'Eskuineko laterala', '1998-08-10', 'San Adrian'),
('10000005E', 'Unai Ituarte Otegi', 5, 'Zentrala', '2005-01-25', 'San Adrian'),
('10000006F', 'Beñat Txurruka Arregi', 13, 'Ezkerraldeko laterala', '2002-06-30', 'San Adrian'),
('10000007G', 'Gorka Elorza Mujika', 9, 'Pibotea', '1996-09-05', 'San Adrian'),
('10000008H', 'Oihan Zabaleta Altuna', 12, 'Atezaina', '2008-02-14', 'San Adrian'),
('10000009I', 'Julen Madariaga Iturraspe', 11, 'Eskuineko hegala', '2003-10-01', 'San Adrian'),
('10000010J', 'Eneko Azkue Odriozola', 4, 'Ezkerraldeko hegala', '2000-12-12', 'San Adrian'),
('10000011K', 'Xabier Garmendia Urkiola', 15, 'Eskuineko laterala', '2006-04-22', 'San Adrian'),
('10000012L', 'Adur Goikoetxea Laka', 8, 'Zentrala', '2004-07-18', 'San Adrian'),
('10000013M', 'Luken Basurto Elguezabal', 2, 'Ezkerraldeko laterala', '1999-03-10', 'San Adrian'),
('10000014N', 'Kerman Uriarte Basterretxea', 18, 'Eskuineko hegala', '1995-05-25', 'San Adrian'),
('20000001A', 'Mikel Zabala Larrea', 1, 'Atezaina', '2002-02-10', 'Kukullaga'),
('20000002B', 'Egoitz Murua Alberdi', 10, 'Pibotea', '2005-04-14', 'Kukullaga'),
('20000003C', 'Aitor Gorospe Isasi', 5, 'Zentrala', '2000-08-22', 'Kukullaga'),
('20000004D', 'Arkaitz Bengoetxea', 8, 'Ezkerraldeko laterala', '1994-01-30', 'Kukullaga'),
('20000005E', 'Izan Olabarria Gomez', 13, 'Eskuineko hegala', '2007-11-05', 'Kukullaga'),
('20000006F', 'Eneko Basterra Zuazo', 7, 'Ezkerraldeko hegala', '2003-09-12', 'Kukullaga'),
('20000007G', 'Zunbeltz Idigoras', 3, 'Zentrala', '2006-05-18', 'Kukullaga'),
('20000008H', 'Gaizka Urrutia San Pedro', 16, 'Atezaina', '1998-03-25', 'Kukullaga'),
('20000009I', 'Telmo Aranburu Etxadi', 9, 'Pibotea', '2001-07-07', 'Kukullaga'),
('20000010J', 'Aner Villalabeitia', 11, 'Eskuineko laterala', '2008-10-14', 'Kukullaga'),
('20000011K', 'Iker Salaberria Lertxundi', 2, 'Ezkerraldeko laterala', '2004-12-01', 'Kukullaga'),
('20000012L', 'Galder Ugarte Loiola', 14, 'Eskuineko hegala', '1997-02-28', 'Kukullaga'),
('20000013M', 'Joanes Atxa Mendia', 21, 'Eskuineko laterala', '1999-06-15', 'Kukullaga'),
('20000014N', 'Oier Urreizti Aldalur', 4, 'Ezkerraldeko hegala', '2003-01-20', 'Kukullaga'),
('30000001A', 'Josu Elorza Gabilondo', 1, 'Atezaina', '1999-04-12', 'Irauli Bosteko'),
('30000002B', 'Imanol Mujika Otaegi', 8, 'Zentrala', '2005-02-28', 'Irauli Bosteko'),
('30000003C', 'Markel Olano Gabiria', 10, 'Pibotea', '2002-11-15', 'Irauli Bosteko'),
('30000004D', 'Andoni Larrañaga', 5, 'Ezkerraldeko laterala', '1996-03-20', 'Irauli Bosteko'),
('30000005E', 'Hodei Urretabizkaia', 7, 'Ezkerraldeko hegala', '2004-09-10', 'Irauli Bosteko'),
('30000006F', 'Aiur Egiguren Lasa', 11, 'Eskuineko hegala', '2007-06-25', 'Irauli Bosteko'),
('30000007G', 'Ganix Zulaika Berasategi', 15, 'Eskuineko laterala', '1998-12-05', 'Irauli Bosteko'),
('30000008H', 'Ibai Arrieta Uranga', 13, 'Atezaina', '2001-08-14', 'Irauli Bosteko'),
('30000009I', 'Eñaut Agirrebeitia', 2, 'Zentrala', '2006-10-30', 'Irauli Bosteko'),
('30000010J', 'Mattin Etxadi Izagirre', 9, 'Pibotea', '2003-01-05', 'Irauli Bosteko'),
('30000011K', 'Aritz Bergara Ormazabal', 4, 'Ezkerraldeko hegala', '1999-07-12', 'Irauli Bosteko'),
('30000012L', 'Jokin Aperribay', 22, 'Eskuineko laterala', '1993-11-22', 'Irauli Bosteko'),
('30000013M', 'Enekoitz Azkarate', 12, 'Ezkerraldeko laterala', '2008-05-05', 'Irauli Bosteko'),
('30000014N', 'Ugaitz Telleria Artola', 6, 'Eskuineko hegala', '2004-02-14', 'Irauli Bosteko'),
('40000001A', 'Julen Ormaetxea Bilbao', 1, 'Atezaina', '2005-06-12', 'Berango Urduliz'),
('40000002B', 'Iker Iturraspe Goiria', 10, 'Pibotea', '2002-09-20', 'Berango Urduliz'),
('40000003C', 'Endika Basabe Arana', 5, 'Zentrala', '1997-03-15', 'Berango Urduliz'),
('40000004D', 'Asier Urrutikoetxea', 8, 'Ezkerraldeko laterala', '2003-11-10', 'Berango Urduliz'),
('40000005E', 'Jon Magunagoitia', 13, 'Eskuineko hegala', '2006-01-25', 'Berango Urduliz'),
('40000006F', 'Gotzon Gorrotxategi', 7, 'Ezkerraldeko hegala', '2000-06-30', 'Berango Urduliz'),
('40000007G', 'Ekhi Zabalondo Txertudi', 16, 'Atezaina', '2008-09-05', 'Berango Urduliz'),
('40000008H', 'Peru Agirrezabala', 9, 'Pibotea', '2004-02-14', 'Berango Urduliz'),
('40000009I', 'Kepa Amuriza Zarate', 11, 'Eskuineko laterala', '1996-10-01', 'Berango Urduliz'),
('40000010J', 'Aitor Atutxa Goti', 2, 'Zentrala', '2001-12-12', 'Berango Urduliz'),
('40000011K', 'Lander Barrenetxea', 15, 'Ezkerraldeko laterala', '1998-04-22', 'Berango Urduliz'),
('40000012L', 'Bittor Egurrola', 4, 'Ezkerraldeko hegala', '2005-07-18', 'Berango Urduliz'),
('40000013M', 'Erlantz Gabantxo', 12, 'Eskuineko hegala', '2007-03-10', 'Berango Urduliz'),
('40000014N', 'Jagoba Gurtubay', 18, 'Eskuineko laterala', '1999-05-25', 'Berango Urduliz'),
('50000001A', 'Josian Barrenetxea Uriarte', 1, 'Atezaina', '2000-05-11', 'Aloña Mendi'),
('50000002B', 'Beñat Arrasate Igartua', 10, 'Pibotea', '2003-11-20', 'Aloña Mendi'),
('50000003C', 'Iker Casillas Vazquez', 5, 'Zentrala', '2004-03-15', 'Aloña Mendi'),
('50000004D', 'Andoni Zumalde Guridi', 8, 'Ezkerraldeko laterala', '2006-08-10', 'Aloña Mendi'),
('50000005E', 'Mikel Biain Biain', 13, 'Eskuineko hegala', '1997-01-25', 'Aloña Mendi'),
('50000006F', 'Julen Murguzur', 7, 'Ezkerraldeko hegala', '2007-06-30', 'Aloña Mendi'),
('50000007G', 'Xabier Markuleta', 16, 'Atezaina', '1995-09-05', 'Aloña Mendi'),
('50000008H', 'Aitor Idigoras', 9, 'Pibotea', '2002-02-14', 'Aloña Mendi'),
('50000009I', 'Jon Altuna Ibarluzea', 11, 'Eskuineko laterala', '1999-10-01', 'Aloña Mendi'),
('50000010J', 'Gorka Umerez Arregi', 2, 'Zentrala', '2005-12-12', 'Aloña Mendi'),
('50000011K', 'Eñaut Agirre Guridi', 15, 'Ezkerraldeko laterala', '2001-04-22', 'Aloña Mendi'),
('50000012L', 'Manex Zubia Otaegi', 4, 'Ezkerraldeko hegala', '2004-07-18', 'Aloña Mendi'),
('50000013M', 'Eneko Arriolabengoa', 12, 'Eskuineko hegala', '2008-03-10', 'Aloña Mendi'),
('50000014N', 'Josu Arregi Mendi', 18, 'Eskuineko laterala', '1994-05-25', 'Aloña Mendi'),
('60000001A', 'Xabier Azkue Olaizola', 1, 'Atezaina', '2007-05-12', 'Amezti Zarautz'),
('60000002B', 'Enaut Agirre Eizagirre', 10, 'Pibotea', '2004-11-20', 'Amezti Zarautz'),
('60000003C', 'Oihan Etxabe Ostolaza', 5, 'Zentrala', '2002-03-15', 'Amezti Zarautz'),
('60000004D', 'Markel Berasategi', 8, 'Ezkerraldeko laterala', '2006-08-10', 'Amezti Zarautz'),
('60000005E', 'Hodei Iruretagoiena', 13, 'Eskuineko hegala', '2005-01-25', 'Amezti Zarautz'),
('60000006F', 'Ibai Agirrezabalaga', 7, 'Ezkerraldeko hegala', '1998-06-30', 'Amezti Zarautz'),
('60000007G', 'Aitor Zubia Irigoien', 16, 'Atezaina', '2001-09-05', 'Amezti Zarautz'),
('60000008H', 'Julen Odriozola Arana', 9, 'Pibotea', '2003-02-14', 'Amezti Zarautz'),
('60000009I', 'Luken Illarramendi', 11, 'Eskuineko laterala', '1996-10-01', 'Amezti Zarautz'),
('60000010J', 'Haritz Elustondo', 2, 'Zentrala', '2008-12-12', 'Amezti Zarautz'),
('60000011K', 'Eneko Alkorta Olaiz', 15, 'Ezkerraldeko laterala', '1999-04-22', 'Amezti Zarautz'),
('60000012L', 'Jon Ander Agirre', 4, 'Ezkerraldeko hegala', '2004-07-18', 'Amezti Zarautz'),
('60000013M', 'Ander Esnal Larrañaga', 12, 'Eskuineko hegala', '2000-03-10', 'Amezti Zarautz'),
('60000014N', 'Telmo Basterra Odriozola', 18, 'Eskuineko laterala', '1995-05-25', 'Amezti Zarautz');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidua`
--

CREATE TABLE `partidua` (
  `id_auto` int(11) NOT NULL,
  `kod_partidua` varchar(20) DEFAULT NULL,
  `denboraldia` varchar(10) NOT NULL,
  `Data` date DEFAULT NULL,
  `Ordua` time DEFAULT NULL,
  `Golak_lokala` int(11) DEFAULT 0,
  `Golak_kanpokoak` int(11) DEFAULT 0,
  `Zelaia` varchar(100) DEFAULT NULL,
  `Talde_lokala` varchar(100) DEFAULT NULL,
  `Kampoko_taldea` varchar(100) DEFAULT NULL,
  `epailea1` varchar(100) DEFAULT NULL,
  `epailea2` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `partidua`
--

INSERT INTO `partidua` (`id_auto`, `kod_partidua`, `denboraldia`, `Data`, `Ordua`, `Golak_lokala`, `Golak_kanpokoak`, `Zelaia`, `Talde_lokala`, `Kampoko_taldea`, `epailea1`, `epailea2`) VALUES
(1, 'J 1 - 24-25', '24-25', '2024-10-05', '16:30:00', 28, 24, 'Polideportivo Rekalde', 'San Adrian', 'Amezti Zarautz', 'Jon Urkidi', 'Ane Mendizabal'),
(2, 'J 1 - 24-25', '24-25', '2024-10-05', '18:15:00', 21, 21, 'Polideportivo Municipal Etxebarri', 'Kukullaga', 'Aloña Mendi', 'Kepa Arrate', 'Maider Elorriaga'),
(3, 'J 1 - 24-25', '24-25', '2024-10-05', '20:00:00', 25, 29, 'Colegio Escolapios', 'Escolapios', 'Berango Urduliz', 'Unai Goikoetxea', 'Itziar Agirre'),
(4, 'J 2 - 24-25', '24-25', '2024-10-12', '16:30:00', 31, 27, 'Aritzbatalde Kiroldegia', 'Amezti Zarautz', 'Escolapios', 'Jon Urkidi', 'Ane Mendizabal'),
(5, 'J 2 - 24-25', '24-25', '2024-10-12', '18:15:00', 24, 24, 'Zubikoa Kiroldegia', 'Aloña Mendi', 'San Adrian', 'Kepa Arrate', 'Maider Elorriaga'),
(6, 'J 2 - 24-25', '24-25', '2024-10-12', '20:00:00', 22, 30, 'Polideportivo Berango', 'Berango Urduliz', 'Kukullaga', 'Unai Goikoetxea', 'Itziar Agirre'),
(7, 'J 3 - 24-25', '24-25', '2024-10-19', '16:30:00', 29, 26, 'Polideportivo Rekalde', 'San Adrian', 'Berango Urduliz', 'Jon Urkidi', 'Ane Mendizabal'),
(8, 'J 3 - 24-25', '24-25', '2024-10-19', '18:15:00', 23, 31, 'Polideportivo Municipal Etxebarri', 'Kukullaga', 'Amezti Zarautz', 'Kepa Arrate', 'Maider Elorriaga'),
(9, 'J 3 - 24-25', '24-25', '2024-10-19', '20:00:00', 20, 22, 'Colegio Escolapios', 'Escolapios', 'Aloña Mendi', 'Unai Goikoetxea', 'Itziar Agirre'),
(10, 'J 4 - 24-25', '24-25', '2024-10-26', '16:30:00', 27, 27, 'Aritzbatalde Kiroldegia', 'Amezti Zarautz', 'Aloña Mendi', 'Jon Urkidi', 'Ane Mendizabal'),
(11, 'J 4 - 24-25', '24-25', '2024-10-26', '18:15:00', 28, 25, 'Polideportivo Berango', 'Berango Urduliz', 'San Adrian', 'Kepa Arrate', 'Maider Elorriaga'),
(12, 'J 4 - 24-25', '24-25', '2024-10-26', '20:00:00', 21, 23, 'Colegio Escolapios', 'Escolapios', 'Kukullaga', 'Unai Goikoetxea', 'Itziar Agirre'),
(13, 'J 5 - 24-25', '24-25', '2024-11-02', '16:30:00', 24, 26, 'Zubikoa Kiroldegia', 'Aloña Mendi', 'San Adrian', 'Jon Urkidi', 'Ane Mendizabal'),
(14, 'J 5 - 24-25', '24-25', '2024-11-02', '18:15:00', 19, 30, 'Colegio Escolapios', 'Escolapios', 'Amezti Zarautz', 'Kepa Arrate', 'Maider Elorriaga'),
(15, 'J 5 - 24-25', '24-25', '2024-11-02', '20:00:00', 32, 28, 'Polideportivo Berango', 'Berango Urduliz', 'Kukullaga', 'Unai Goikoetxea', 'Itziar Agirre'),
(16, 'J 6 - 24-25', '24-25', '2024-11-09', '16:30:00', 25, 25, 'Aritzbatalde Kiroldegia', 'Amezti Zarautz', 'San Adrian', 'Jon Urkidi', 'Ane Mendizabal'),
(17, 'J 6 - 24-25', '24-25', '2024-11-09', '18:15:00', 28, 22, 'Zubikoa Kiroldegia', 'Aloña Mendi', 'Kukullaga', 'Kepa Arrate', 'Maider Elorriaga'),
(18, 'J 6 - 24-25', '24-25', '2024-11-09', '20:00:00', 31, 26, 'Polideportivo Berango', 'Berango Urduliz', 'Escolapios', 'Unai Goikoetxea', 'Itziar Agirre'),
(19, 'J 7 - 24-25', '24-25', '2024-11-16', '16:30:00', 24, 28, 'Colegio Escolapios', 'Escolapios', 'Amezti Zarautz', 'Jon Urkidi', 'Ane Mendizabal'),
(20, 'J 7 - 24-25', '24-25', '2024-11-16', '18:15:00', 27, 23, 'Polideportivo Rekalde', 'San Adrian', 'Aloña Mendi', 'Kepa Arrate', 'Maider Elorriaga'),
(21, 'J 7 - 24-25', '24-25', '2024-11-16', '20:00:00', 25, 24, 'Polideportivo Municipal Etxebarri', 'Kukullaga', 'Berango Urduliz', 'Unai Goikoetxea', 'Itziar Agirre'),
(22, 'J 8 - 24-25', '24-25', '2024-11-23', '16:30:00', 29, 28, 'Polideportivo Berango', 'Berango Urduliz', 'San Adrian', 'Jon Urkidi', 'Ane Mendizabal'),
(23, 'J 8 - 24-25', '24-25', '2024-11-23', '18:15:00', 30, 26, 'Aritzbatalde Kiroldegia', 'Amezti Zarautz', 'Kukullaga', 'Kepa Arrate', 'Maider Elorriaga'),
(24, 'J 8 - 24-25', '24-25', '2024-11-23', '20:00:00', 26, 25, 'Zubikoa Kiroldegia', 'Aloña Mendi', 'Escolapios', 'Unai Goikoetxea', 'Itziar Agirre'),
(25, 'J 9 - 24-25', '24-25', '2024-11-30', '16:30:00', 22, 24, 'Zubikoa Kiroldegia', 'Aloña Mendi', 'Amezti Zarautz', 'Jon Urkidi', 'Ane Mendizabal'),
(26, 'J 9 - 24-25', '24-25', '2024-11-30', '18:15:00', 27, 27, 'Polideportivo Rekalde', 'San Adrian', 'Berango Urduliz', 'Kepa Arrate', 'Maider Elorriaga'),
(27, 'J 9 - 24-25', '24-25', '2024-11-30', '20:00:00', 31, 24, 'Polideportivo Municipal Etxebarri', 'Kukullaga', 'Escolapios', 'Unai Goikoetxea', 'Itziar Agirre'),
(28, 'J 10 - 24-25', '24-25', '2024-12-07', '16:30:00', 28, 25, 'Polideportivo Berango', 'Berango Urduliz', 'Kukullaga', 'Jon Urkidi', 'Ane Mendizabal'),
(29, 'J 10 - 24-25', '24-25', '2024-12-07', '18:15:00', 23, 22, 'Aritzbatalde Kiroldegia', 'Amezti Zarautz', 'Escolapios', 'Kepa Arrate', 'Maider Elorriaga'),
(30, 'J 10 - 24-25', '24-25', '2024-12-07', '20:00:00', 31, 29, 'Polideportivo Rekalde', 'San Adrian', 'Aloña Mendi', 'Unai Goikoetxea', 'Itziar Agirre'),
(31, 'J 1 - 25-26', '25-26', '2025-10-04', '16:30:00', NULL, NULL, 'Polideportivo Rekalde', 'San Adrian', 'Amezti Zarautz', 'Jon Urkidi', 'Ane Mendizabal'),
(32, 'J 1 - 25-26', '25-26', '2025-10-04', '18:15:00', NULL, NULL, 'Polideportivo Municipal Etxebarri', 'Kukullaga', 'Aloña Mendi', 'Kepa Arrate', 'Maider Elorriaga'),
(33, 'J 1 - 25-26', '25-26', '2025-10-04', '20:00:00', NULL, NULL, 'Polideportivo Benta Berri', 'Irauli Bosteko', 'Berango Urduliz', 'Unai Goikoetxea', 'Itziar Agirre'),
(34, 'J 2 - 25-26', '25-26', '2025-10-11', '16:30:00', NULL, NULL, 'Aritzbatalde Kiroldegia', 'Amezti Zarautz', 'Irauli Bosteko', 'Kepa Arrate', 'Maider Elorriaga'),
(35, 'J 2 - 25-26', '25-26', '2025-10-11', '18:15:00', NULL, NULL, 'Zubikoa Kiroldegia', 'Aloña Mendi', 'San Adrian', 'Unai Goikoetxea', 'Itziar Agirre'),
(36, 'J 2 - 25-26', '25-26', '2025-10-11', '20:00:00', NULL, NULL, 'Polideportivo Berango', 'Berango Urduliz', 'Kukullaga', 'Jon Urkidi', 'Ane Mendizabal'),
(37, 'J 3 - 25-26', '25-26', '2025-10-18', '16:30:00', NULL, NULL, 'Polideportivo Rekalde', 'San Adrian', 'Berango Urduliz', 'Unai Goikoetxea', 'Itziar Agirre'),
(38, 'J 3 - 25-26', '25-26', '2025-10-18', '18:15:00', NULL, NULL, 'Polideportivo Municipal Etxebarri', 'Kukullaga', 'Amezti Zarautz', 'Jon Urkidi', 'Ane Mendizabal'),
(39, 'J 3 - 25-26', '25-26', '2025-10-18', '20:00:00', NULL, NULL, 'Polideportivo Benta Berri', 'Irauli Bosteko', 'Aloña Mendi', 'Kepa Arrate', 'Maider Elorriaga'),
(40, 'J 4 - 25-26', '25-26', '2025-10-25', '16:30:00', NULL, NULL, 'Aritzbatalde Kiroldegia', 'Amezti Zarautz', 'Aloña Mendi', 'Jon Urkidi', 'Ane Mendizabal'),
(41, 'J 4 - 25-26', '25-26', '2025-10-25', '18:15:00', NULL, NULL, 'Polideportivo Berango', 'Berango Urduliz', 'San Adrian', 'Kepa Arrate', 'Maider Elorriaga'),
(42, 'J 4 - 25-26', '25-26', '2025-10-25', '20:00:00', NULL, NULL, 'Polideportivo Benta Berri', 'Irauli Bosteko', 'Kukullaga', 'Unai Goikoetxea', 'Itziar Agirre'),
(43, 'J 5 - 25-26', '25-26', '2025-11-01', '20:00:00', NULL, NULL, 'Zubikoa Kiroldegia', 'Aloña Mendi', 'San Adrian', '', ''),
(44, 'J 5 - 25-26', '25-26', '2025-11-01', NULL, NULL, NULL, 'Polideportivo Benta Berri', 'Irauli Bosteko', 'Amezti Zarautz', '', ''),
(45, 'J 5 - 25-26', '25-26', '2025-11-01', NULL, NULL, NULL, 'Polideportivo Berango', 'Berango Urduliz', 'Kukullaga', '', ''),
(46, 'J 6 - 25-26', '25-26', '2025-11-08', NULL, NULL, NULL, 'Aritzbatalde Kiroldegia', 'Amezti Zarautz', 'San Adrian', '', ''),
(47, 'J 6 - 25-26', '25-26', '2025-11-08', NULL, NULL, NULL, 'Zubikoa Kiroldegia', 'Aloña Mendi', 'Kukullaga', '', ''),
(48, 'J 6 - 25-26', '25-26', '2025-11-08', NULL, NULL, NULL, 'Polideportivo Berango', 'Berango Urduliz', 'Irauli Bosteko', '', ''),
(49, 'J 7 - 25-26', '25-26', '2025-11-15', NULL, NULL, NULL, 'Polideportivo Benta Berri', 'Irauli Bosteko', 'Amezti Zarautz', '', ''),
(50, 'J 7 - 25-26', '25-26', '2025-11-15', NULL, NULL, NULL, 'Polideportivo Rekalde', 'San Adrian', 'Aloña Mendi', '', ''),
(51, 'J 7 - 25-26', '25-26', '2025-11-15', NULL, NULL, NULL, 'Polideportivo Municipal Etxebarri', 'Kukullaga', 'Berango Urduliz', '', ''),
(52, 'J 8 - 25-26', '25-26', '2025-11-22', NULL, NULL, NULL, 'Polideportivo Berango', 'Berango Urduliz', 'San Adrian', '', ''),
(53, 'J 8 - 25-26', '25-26', '2025-11-22', NULL, NULL, NULL, 'Aritzbatalde Kiroldegia', 'Amezti Zarautz', 'Kukullaga', '', ''),
(54, 'J 8 - 25-26', '25-26', '2025-11-22', NULL, NULL, NULL, 'Zubikoa Kiroldegia', 'Aloña Mendi', 'Irauli Bosteko', '', ''),
(55, 'J 9 - 25-26', '25-26', '2025-11-29', NULL, NULL, NULL, 'Zubikoa Kiroldegia', 'Aloña Mendi', 'Amezti Zarautz', '', ''),
(56, 'J 9 - 25-26', '25-26', '2025-11-29', NULL, NULL, NULL, 'Polideportivo Rekalde', 'San Adrian', 'Berango Urduliz', '', ''),
(57, 'J 9 - 25-26', '25-26', '2025-11-29', NULL, NULL, NULL, 'Polideportivo Municipal Etxebarri', 'Kukullaga', 'Irauli Bosteko', '', ''),
(58, 'J 10 - 25-26', '25-26', '2025-12-06', NULL, NULL, NULL, 'Polideportivo Berango', 'Berango Urduliz', 'Kukullaga', '', ''),
(59, 'J 10 - 25-26', '25-26', '2025-12-06', NULL, NULL, NULL, 'Aritzbatalde Kiroldegia', 'Amezti Zarautz', 'Irauli Bosteko', '', ''),
(60, 'J 10 - 25-26', '25-26', '2025-12-06', NULL, NULL, NULL, 'Polideportivo Rekalde', 'San Adrian', 'Aloña Mendi', '', '');

--
-- Disparadores `partidua`
--
DELIMITER $$
CREATE TRIGGER `after_partidua_delete` AFTER DELETE ON `partidua` FOR EACH ROW BEGIN
    CALL ActualizarClasificacion(OLD.denboraldia);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_partidua_insert` AFTER INSERT ON `partidua` FOR EACH ROW BEGIN
    CALL ActualizarClasificacion(NEW.denboraldia);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_partidua_update` AFTER UPDATE ON `partidua` FOR EACH ROW BEGIN
    CALL ActualizarClasificacion(NEW.denboraldia);
    IF NEW.denboraldia <> OLD.denboraldia THEN
        CALL ActualizarClasificacion(OLD.denboraldia);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pertsona`
--

CREATE TABLE `pertsona` (
  `NANa` varchar(9) NOT NULL,
  `Izen_abizena` varchar(100) NOT NULL,
  `Adina` int(11) DEFAULT NULL,
  `Helbidea` varchar(100) DEFAULT NULL,
  `Tlfn` varchar(15) DEFAULT NULL,
  `taldea` varchar(50) DEFAULT NULL,
  `Rola` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `pertsona`
--

INSERT INTO `pertsona` (`NANa`, `Izen_abizena`, `Adina`, `Helbidea`, `Tlfn`, `taldea`, `Rola`) VALUES
('10000001A', 'Iker Zubizarreta Lasa', 22, 'Bilbo', '600000001', 'San Adrian', 'Jokalaria'),
('10000002B', 'Aimar Etxeberria Agirre', 25, 'Bilbo', '600000002', 'San Adrian', 'Jokalaria'),
('10000003C', 'Hegoi Mendizabal Beloki', 19, 'Bilbo', '600000003', 'San Adrian', 'Jokalaria'),
('10000004D', 'Jon Ander Garcia', 28, 'Bilbo', '600000004', 'San Adrian', 'Jokalaria'),
('10000005E', 'Unai Ituarte Otegi', 21, 'Bilbo', '600000005', 'San Adrian', 'Jokalaria'),
('10000006F', 'Beñat Txurruka Arregi', 24, 'Bilbo', '600000006', 'San Adrian', 'Jokalaria'),
('10000007G', 'Gorka Elorza Mujika', 30, 'Bilbo', '600000007', 'San Adrian', 'Jokalaria'),
('10000008H', 'Oihan Zabaleta Altuna', 18, 'Bilbo', '600000008', 'San Adrian', 'Jokalaria'),
('10000009I', 'Julen Madariaga Iturraspe', 23, 'Bilbo', '600000009', 'San Adrian', 'Jokalaria'),
('10000010J', 'Eneko Azkue Odriozola', 26, 'Bilbo', '600000010', 'San Adrian', 'Jokalaria'),
('10000011K', 'Xabier Garmendia Urkiola', 20, 'Bilbo', '600000011', 'San Adrian', 'Jokalaria'),
('10000012L', 'Adur Goikoetxea Laka', 22, 'Bilbo', '600000012', 'San Adrian', 'Jokalaria'),
('10000013M', 'Luken Basurto Elguezabal', 27, 'Bilbo', '600000013', 'San Adrian', 'Jokalaria'),
('10000014N', 'Kerman Uriarte Basterretxea', 31, 'Bilbo', '600000014', 'San Adrian', 'Jokalaria'),
('11560203N', 'AA', NULL, '', '', 'Aloña Mendi', 'Jokalaria'),
('20000001A', 'Mikel Zabala Larrea', 24, 'Etxebarri', '600000015', 'Kukullaga', 'Jokalaria'),
('20000002B', 'Egoitz Murua Alberdi', 21, 'Etxebarri', '600000016', 'Kukullaga', 'Jokalaria'),
('20000003C', 'Aitor Gorospe Isasi', 26, 'Etxebarri', '600000017', 'Kukullaga', 'Jokalaria'),
('20000004D', 'Arkaitz Bengoetxea', 32, 'Etxebarri', '600000018', 'Kukullaga', 'Jokalaria'),
('20000005E', 'Izan Olabarria Gomez', 19, 'Etxebarri', '600000019', 'Kukullaga', 'Jokalaria'),
('20000006F', 'Eneko Basterra Zuazo', 23, 'Etxebarri', '600000020', 'Kukullaga', 'Jokalaria'),
('20000007G', 'Zunbeltz Idigoras', 20, 'Etxebarri', '600000021', 'Kukullaga', 'Jokalaria'),
('20000008H', 'Gaizka Urrutia San Pedro', 28, 'Etxebarri', '600000022', 'Kukullaga', 'Jokalaria'),
('20000009I', 'Telmo Aranburu Etxadi', 25, 'Etxebarri', '600000023', 'Kukullaga', 'Jokalaria'),
('20000010J', 'Aner Villalabeitia', 18, 'Etxebarri', '600000024', 'Kukullaga', 'Jokalaria'),
('20000011K', 'Iker Salaberria Lertxundi', 22, 'Etxebarri', '600000025', 'Kukullaga', 'Jokalaria'),
('20000012L', 'Galder Ugarte Loiola', 29, 'Etxebarri', '600000026', 'Kukullaga', 'Jokalaria'),
('20000013M', 'Joanes Atxa Mendia', 27, 'Etxebarri', '600000027', 'Kukullaga', 'Jokalaria'),
('20000014N', 'Oier Urreizti Aldalur', 23, 'Etxebarri', '600000028', 'Kukullaga', 'Jokalaria'),
('30000001A', 'Josu Elorza Gabilondo', 26, 'Donostia', '600000029', 'Irauli Bosteko', 'Jokalaria'),
('30000002B', 'Imanol Mujika Otaegi', 21, 'Donostia', '600000030', 'Irauli Bosteko', 'Jokalaria'),
('30000003C', 'Markel Olano Gabiria', 24, 'Donostia', '600000031', 'Irauli Bosteko', 'Jokalaria'),
('30000004D', 'Andoni Larrañaga', 30, 'Donostia', '600000032', 'Irauli Bosteko', 'Jokalaria'),
('30000005E', 'Hodei Urretabizkaia', 22, 'Donostia', '600000033', 'Irauli Bosteko', 'Jokalaria'),
('30000006F', 'Aiur Egiguren Lasa', 19, 'Donostia', '600000034', 'Irauli Bosteko', 'Jokalaria'),
('30000007G', 'Ganix Zulaika Berasategi', 28, 'Donostia', '600000035', 'Irauli Bosteko', 'Jokalaria'),
('30000008H', 'Ibai Arrieta Uranga', 25, 'Donostia', '600000036', 'Irauli Bosteko', 'Jokalaria'),
('30000009I', 'Eñaut Agirrebeitia', 20, 'Donostia', '600000037', 'Irauli Bosteko', 'Jokalaria'),
('30000010J', 'Mattin Etxadi Izagirre', 23, 'Donostia', '600000038', 'Irauli Bosteko', 'Jokalaria'),
('30000011K', 'Aritz Bergara Ormazabal', 27, 'Donostia', '600000039', 'Irauli Bosteko', 'Jokalaria'),
('30000012L', 'Jokin Aperribay', 33, 'Donostia', '600000040', 'Irauli Bosteko', 'Jokalaria'),
('30000013M', 'Enekoitz Azkarate', 18, 'Donostia', '600000041', 'Irauli Bosteko', 'Jokalaria'),
('30000014N', 'Ugaitz Telleria Artola', 22, 'Donostia', '600000042', 'Irauli Bosteko', 'Jokalaria'),
('40000001A', 'Julen Ormaetxea Bilbao', 21, 'Berango', '600000043', 'Berango Urduliz', 'Jokalaria'),
('40000002B', 'Iker Iturraspe Goiria', 24, 'Urduliz', '600000044', 'Berango Urduliz', 'Jokalaria'),
('40000003C', 'Endika Basabe Arana', 29, 'Berango', '600000045', 'Berango Urduliz', 'Jokalaria'),
('40000004D', 'Asier Urrutikoetxea', 23, 'Urduliz', '600000046', 'Berango Urduliz', 'Jokalaria'),
('40000005E', 'Jon Magunagoitia', 20, 'Berango', '600000047', 'Berango Urduliz', 'Jokalaria'),
('40000006F', 'Gotzon Gorrotxategi', 26, 'Urduliz', '600000048', 'Berango Urduliz', 'Jokalaria'),
('40000007G', 'Ekhi Zabalondo Txertudi', 18, 'Berango', '600000049', 'Berango Urduliz', 'Jokalaria'),
('40000008H', 'Peru Agirrezabala', 22, 'Urduliz', '600000050', 'Berango Urduliz', 'Jokalaria'),
('40000009I', 'Kepa Amuriza Zarate', 30, 'Berango', '600000051', 'Berango Urduliz', 'Jokalaria'),
('40000010J', 'Aitor Atutxa Goti', 25, 'Urduliz', '600000052', 'Berango Urduliz', 'Jokalaria'),
('40000011K', 'Lander Barrenetxea', 28, 'Berango', '600000053', 'Berango Urduliz', 'Jokalaria'),
('40000012L', 'Bittor Egurrola', 21, 'Urduliz', '600000054', 'Berango Urduliz', 'Jokalaria'),
('40000013M', 'Erlantz Gabantxo', 19, 'Berango', '600000055', 'Berango Urduliz', 'Jokalaria'),
('40000014N', 'Jagoba Gurtubay', 27, 'Urduliz', '600000056', 'Berango Urduliz', 'Jokalaria'),
('50000001A', 'Josian Barrenetxea Uriarte', 26, 'Oñati', '600000057', 'Aloña Mendi', 'Jokalaria'),
('50000002B', 'Beñat Arrasate Igartua', 23, 'Oñati', '600000058', 'Aloña Mendi', 'Jokalaria'),
('50000003C', 'Iker Casillas Vazquez', 22, 'Oñati', '600000059', 'Aloña Mendi', 'Jokalaria'),
('50000004D', 'Andoni Zumalde Guridi', 20, 'Oñati', '600000060', 'Aloña Mendi', 'Jokalaria'),
('50000005E', 'Mikel Biain Biain', 29, 'Oñati', '600000061', 'Aloña Mendi', 'Jokalaria'),
('50000006F', 'Julen Murguzur', 19, 'Oñati', '600000062', 'Aloña Mendi', 'Jokalaria'),
('50000007G', 'Xabier Markuleta', 31, 'Oñati', '600000063', 'Aloña Mendi', 'Jokalaria'),
('50000008H', 'Aitor Idigoras', 24, 'Oñati', '600000064', 'Aloña Mendi', 'Jokalaria'),
('50000009I', 'Jon Altuna Ibarluzea', 27, 'Oñati', '600000065', 'Aloña Mendi', 'Jokalaria'),
('50000010J', 'Gorka Umerez Arregi', 21, 'Oñati', '600000066', 'Aloña Mendi', 'Jokalaria'),
('50000011K', 'Eñaut Agirre Guridi', 25, 'Oñati', '600000067', 'Aloña Mendi', 'Jokalaria'),
('50000012L', 'Manex Zubia Otaegi', 22, 'Oñati', '600000068', 'Aloña Mendi', 'Jokalaria'),
('50000013M', 'Eneko Arriolabengoa', 18, 'Oñati', '600000069', 'Aloña Mendi', 'Jokalaria'),
('50000014N', 'Josu Arregi Mendi', 32, 'Oñati', '600000070', 'Aloña Mendi', 'Jokalaria'),
('60000001A', 'Xabier Azkue Olaizola', 19, 'Zarautz', '600000071', 'Amezti Zarautz', 'Jokalaria'),
('60000002B', 'Enaut Agirre Eizagirre', 22, 'Zarautz', '600000072', 'Amezti Zarautz', 'Jokalaria'),
('60000003C', 'Oihan Etxabe Ostolaza', 24, 'Zarautz', '600000073', 'Amezti Zarautz', 'Jokalaria'),
('60000004D', 'Markel Berasategi', 20, 'Zarautz', '600000074', 'Amezti Zarautz', 'Jokalaria'),
('60000005E', 'Hodei Iruretagoiena', 21, 'Zarautz', '600000075', 'Amezti Zarautz', 'Jokalaria'),
('60000006F', 'Ibai Agirrezabalaga', 28, 'Zarautz', '600000076', 'Amezti Zarautz', 'Jokalaria'),
('60000007G', 'Aitor Zubia Irigoien', 25, 'Zarautz', '600000077', 'Amezti Zarautz', 'Jokalaria'),
('60000008H', 'Julen Odriozola Arana', 23, 'Zarautz', '600000078', 'Amezti Zarautz', 'Jokalaria'),
('60000009I', 'Luken Illarramendi', 30, 'Zarautz', '600000079', 'Amezti Zarautz', 'Jokalaria'),
('60000010J', 'Haritz Elustondo', 18, 'Zarautz', '600000080', 'Amezti Zarautz', 'Jokalaria'),
('60000011K', 'Eneko Alkorta Olaiz', 27, 'Zarautz', '600000081', 'Amezti Zarautz', 'Jokalaria'),
('60000012L', 'Jon Ander Agirre', 22, 'Zarautz', '600000082', 'Amezti Zarautz', 'Jokalaria'),
('60000013M', 'Ander Esnal Larrañaga', 26, 'Zarautz', '600000083', 'Amezti Zarautz', 'Jokalaria'),
('60000014N', 'Telmo Basterra Odriozola', 31, 'Zarautz', '600000084', 'Amezti Zarautz', 'Jokalaria'),
('60718444P', 'AA', NULL, '', '', 'Kukullaga', 'Jokalaria'),
('70000001A', 'Gorka Etxeberria Lasa', 45, 'Bilbo', '611000111', 'San Adrian', 'Entrenatzailea'),
('70000002B', 'Mikel Ituarte Mendizabal', 38, 'Etxebarri', '611000222', 'Kukullaga', 'Entrenatzailea'),
('70000003C', 'Amaia Agirreurreta Elorza', 40, 'Donostia', '611000333', 'Irauli Bosteko', 'Entrenatzailea'),
('70000004D', 'Bittor Arana Goiri', 52, 'Berango', '611000444', 'Berango Urduliz', 'Entrenatzailea'),
('70000005E', 'Iñaki Ugarteburu Artola', 41, 'Oñati', '611000555', 'Aloña Mendi', 'Entrenatzailea'),
('70000006F', 'Maite Azkue Olaizola', 36, 'Zarautz', '611000666', 'Amezti Zarautz', 'Entrenatzailea'),
('80000001A', 'Jon Urkidi Artetxe', 35, 'Bilbo', '622000111', '', 'Epailea'),
('80000002B', 'Ane Mendizabal Goti', 29, 'Gasteiz', '622000222', '', 'Epailea'),
('80000003C', 'Kepa Arrate Zubia', 42, 'Donostia', '622000333', '', 'Epailea'),
('80000004D', 'Maider Elorriaga Laka', 31, 'Eibar', '622000444', '', 'Epailea'),
('80000005E', 'Unai Goikoetxea Lasa', 38, 'Zarautz', '622000555', '', 'Epailea'),
('80000006F', 'Itziar Agirre Beloki', 27, 'Irun', '622000666', '', 'Epailea'),
('85262598B', 'AA', NULL, '', '', 'Aloña Mendi', 'Jokalaria');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sailkapena_24_25`
--

CREATE TABLE `sailkapena_24_25` (
  `taldea` varchar(100) NOT NULL,
  `JP` int(11) DEFAULT 0,
  `IrP` int(11) DEFAULT 0,
  `BerP` int(11) DEFAULT 0,
  `GaP` int(11) DEFAULT 0,
  `AG` int(11) DEFAULT 0,
  `KG` int(11) DEFAULT 0,
  `puntuak` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `sailkapena_24_25`
--

INSERT INTO `sailkapena_24_25` (`taldea`, `JP`, `IrP`, `BerP`, `GaP`, `AG`, `KG`, `puntuak`) VALUES
('Aloña Mendi', 10, 3, 3, 4, 246, 247, 9),
('Amezti Zarautz', 10, 7, 2, 1, 273, 243, 16),
('Berango Urduliz', 10, 6, 1, 3, 276, 268, 13),
('Irauli Bosteko', 10, 0, 0, 10, 233, 274, 0),
('Kukullaga', 10, 4, 1, 5, 254, 261, 9),
('San Adrian', 10, 5, 3, 2, 270, 259, 13);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sailkapena_25_26`
--

CREATE TABLE `sailkapena_25_26` (
  `taldea` varchar(100) NOT NULL,
  `JP` int(11) DEFAULT 0,
  `IrP` int(11) DEFAULT 0,
  `BerP` int(11) DEFAULT 0,
  `GaP` int(11) DEFAULT 0,
  `AG` int(11) DEFAULT 0,
  `KG` int(11) DEFAULT 0,
  `puntuak` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sailkapena_2025_2026`
--

CREATE TABLE `sailkapena_2025_2026` (
  `team` varchar(128) NOT NULL,
  `PJ` int(11) DEFAULT NULL,
  `G` int(11) DEFAULT NULL,
  `E` int(11) DEFAULT NULL,
  `P` int(11) DEFAULT NULL,
  `GF` int(11) DEFAULT NULL,
  `GA` int(11) DEFAULT NULL,
  `GD` int(11) DEFAULT NULL,
  `PTS` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sailkapena_2025_2026`
--

INSERT INTO `sailkapena_2025_2026` (`team`, `PJ`, `G`, `E`, `P`, `GF`, `GA`, `GD`, `PTS`) VALUES
('Aloña Mendi', 0, 0, 0, 0, 0, 0, 0, 0),
('Amezti Zarautz', 0, 0, 0, 0, 0, 0, 0, 0),
('Berango Urduliz', 0, 0, 0, 0, 0, 0, 0, 0),
('Irauli Bosteko', 0, 0, 0, 0, 0, 0, 0, 0),
('Kukullaga', 0, 0, 0, 0, 0, 0, 0, 0),
('San Adrian', 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `season_states`
--

CREATE TABLE `season_states` (
  `season` varchar(128) NOT NULL,
  `started` tinyint(1) DEFAULT NULL,
  `finalized` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `season_states`
--

INSERT INTO `season_states` (`season`, `started`, `finalized`) VALUES
('24-25', 1, 1),
('25-26', 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `taldea`
--

CREATE TABLE `taldea` (
  `kod_taldea` varchar(10) NOT NULL,
  `Izena` varchar(50) NOT NULL,
  `Ekipamendua` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `taldea`
--

INSERT INTO `taldea` (`kod_taldea`, `Izena`, `Ekipamendua`) VALUES
('ALO', 'Aloña Mendi', ' Gorria eta Txuria'),
('AMZ', 'Amezti Zarautz', ' Berdea eta Beltza'),
('BER', 'Berango Urduliz', ' Urdina eta Beltza'),
('IRB', 'Irauli Bosteko', ' Txuria eta Urdina'),
('KUK', 'Kukullaga', ' Laranjada eta Urdina'),
('SAD', 'San Adrian', 'Horia eta Beltza');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `zelaia`
--

CREATE TABLE `zelaia` (
  `kod_zelaia` varchar(10) NOT NULL,
  `Izena` varchar(100) NOT NULL,
  `Helbidea` varchar(150) DEFAULT NULL,
  `Taldea` varchar(50) DEFAULT NULL,
  `kod_taldea` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `zelaia`
--

INSERT INTO `zelaia` (`kod_zelaia`, `Izena`, `Helbidea`, `Taldea`, `kod_taldea`) VALUES
('P-ALO', 'Zubikoa Kiroldegia', 'San Lorentzo, Oñati', 'Aloña Mendi', 'ALO'),
('P-AMZ', 'Aritzbatalde Kiroldegia', 'Araba Kalea, Zarautz', 'Amezti Zarautz', 'AMZ'),
('P-BER', 'Berangoko kiroldegia', 'Sabino Arana kalea, Berango', 'Berango Urduliz', 'BER'),
('P-IRB', 'Benta Berri kiroldegia', 'Resurreccion Maria Azkue, Donostia', 'Irauli Bosteko', 'IRB'),
('P-KUK', 'Etxebarriko udal kiroldegia', 'Andra Mari kalea, Etxebarri', 'Kukullaga', 'KUK'),
('P-SAD', 'Rekaldeko kiroldegia', 'Errekalde Plaza, Bilbo', 'San Adrian', 'SAD');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `entrenatzailea`
--
ALTER TABLE `entrenatzailea`
  ADD PRIMARY KEY (`NANa`);

--
-- Indices de la tabla `epailea`
--
ALTER TABLE `epailea`
  ADD PRIMARY KEY (`NANa`);

--
-- Indices de la tabla `jokalaria`
--
ALTER TABLE `jokalaria`
  ADD PRIMARY KEY (`NANa`);

--
-- Indices de la tabla `partidua`
--
ALTER TABLE `partidua`
  ADD PRIMARY KEY (`id_auto`);

--
-- Indices de la tabla `pertsona`
--
ALTER TABLE `pertsona`
  ADD PRIMARY KEY (`NANa`);

--
-- Indices de la tabla `sailkapena_24_25`
--
ALTER TABLE `sailkapena_24_25`
  ADD PRIMARY KEY (`taldea`);

--
-- Indices de la tabla `sailkapena_25_26`
--
ALTER TABLE `sailkapena_25_26`
  ADD PRIMARY KEY (`taldea`);

--
-- Indices de la tabla `sailkapena_2025_2026`
--
ALTER TABLE `sailkapena_2025_2026`
  ADD PRIMARY KEY (`team`);

--
-- Indices de la tabla `season_states`
--
ALTER TABLE `season_states`
  ADD PRIMARY KEY (`season`);

--
-- Indices de la tabla `taldea`
--
ALTER TABLE `taldea`
  ADD PRIMARY KEY (`kod_taldea`);

--
-- Indices de la tabla `zelaia`
--
ALTER TABLE `zelaia`
  ADD PRIMARY KEY (`kod_zelaia`),
  ADD KEY `fk_zelaia_taldea` (`kod_taldea`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `partidua`
--
ALTER TABLE `partidua`
  MODIFY `id_auto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `entrenatzailea`
--
ALTER TABLE `entrenatzailea`
  ADD CONSTRAINT `fk_entrenatzailea_pertsona` FOREIGN KEY (`NANa`) REFERENCES `pertsona` (`NANa`) ON DELETE CASCADE;

--
-- Filtros para la tabla `epailea`
--
ALTER TABLE `epailea`
  ADD CONSTRAINT `fk_epailea_pertsona` FOREIGN KEY (`NANa`) REFERENCES `pertsona` (`NANa`) ON DELETE CASCADE;

--
-- Filtros para la tabla `jokalaria`
--
ALTER TABLE `jokalaria`
  ADD CONSTRAINT `fk_jokalaria_pertsona` FOREIGN KEY (`NANa`) REFERENCES `pertsona` (`NANa`) ON DELETE CASCADE;

--
-- Filtros para la tabla `zelaia`
--
ALTER TABLE `zelaia`
  ADD CONSTRAINT `fk_zelaia_taldea` FOREIGN KEY (`kod_taldea`) REFERENCES `taldea` (`kod_taldea`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
