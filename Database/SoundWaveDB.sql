-- MySQL Script generated by MySQL Workbench
-- ven 15 feb 2019 22:36:31 CET
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema SoundWaveDB
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `SoundWaveDB` ;

-- -----------------------------------------------------
-- Schema SoundWaveDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `SoundWaveDB` DEFAULT CHARACTER SET utf8 ;
USE `SoundWaveDB` ;

-- -----------------------------------------------------
-- Table `SoundWaveDB`.`Account`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoundWaveDB`.`Account` ;

CREATE TABLE IF NOT EXISTS `SoundWaveDB`.`Account` (
  `IDUtente` INT NOT NULL AUTO_INCREMENT,
  `NomeUtente` VARCHAR(45) NOT NULL,
  `Password` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `Nome` VARCHAR(45) NOT NULL,
  `Cognome` VARCHAR(45) NOT NULL,
  `Sesso` CHAR(1) NOT NULL,
  `DataDiNascita` DATE NOT NULL,
  `StatoOnline` BIT(1) NOT NULL DEFAULT b'0',
  `Attivazione` BIT(1) NOT NULL DEFAULT b'0',
  `Ascolta` VARCHAR(45) NOT NULL DEFAULT '-',
  PRIMARY KEY (`IDUtente`),
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC),
  UNIQUE INDEX `NomeUtente_UNIQUE` (`NomeUtente` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Riempimento della tabella 'Account'
-- -----------------------------------------------------
INSERT INTO Account (IDUtente, NomeUtente, Password, Email, Nome, Cognome, Sesso, DataDiNascita, Attivazione)
VALUES
(1, 'Sbugheaz', 'iWc3Clf6b8vkUCqzWKfayMnWnzQ0xLc7DbYPfJtwz8g=', 'gianmarco.coppola@community.unipa.it', 'Gianmarco', 'Coppola', 'M', '1996-10-19', 1),
(2, 'ElMosca96', 'iVeoZsFoJ88L/OMZebfOgcEVT+K+t0zmwnmfUSAyoCU=', 'peppe.moscarelli96@gmail.com', 'Giuseppe', 'Moscarelli', 'M', '1996-06-05', 1),
(3, 'Aries96', 'VWk9KW7p+DVrYsL/OFwbfP4d/efX7mPUh5ri4K0lZNo=', 'andryplus96@gmail.com', 'Andrea', 'Vara', 'M', '1996-06-10', 1),
(4, 'vorfreude', 'VWk9KW7p+DVrYsL/OFwbfP4d/efX7mPUh5ri4K0lZNo=', 'c.civilleri@yahoo.it', 'Chiara', 'Civilleri', 'F', '1996-07-08', 1),
(5, 'AlfaMoon', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'garibaldina95@gmail.com', 'Maria Grazia', 'Pizzo', 'F', '1995-05-16', 1),
(6, 'Narduccio', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'leonardo.digiovanna96@gmail.com', 'Leonardo', 'Di Giovanna', 'M', '1996-09-26', 1),
(7, 'pappagaloBelo', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'valerio.puleo@community.unipa.it', 'Valerio', 'Puleo', 'M', '1996-10-10', 1),
(8, 'energizer', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'gaetano.riccardo.ricotta@community.unipa.it', 'Gaetano Riccardo', 'Ricotta', 'M', '1996-04-08', 1),
(9, 'vinz96', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'vincenzo.viviani@community.unipa.it', 'Vincenzo', 'Viviani', 'M', '1996-02-19', 1),
(10, 'ElMosca01', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'davide.moscarelli@gmail.com', 'Davide', 'Moscarelli', 'M', '2001-07-19', 1),
(11, 'Susina92', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'asusanna.panna96@gmail.com', 'Susanna', 'Panna', 'F', '1987-06-10', 1),
(12, 'ilginosauro', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'gino.divita@yahoo.it', 'Girolamo', 'Di Vita', 'M', '1996-07-08', 1),
(13, 'simocammy', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'simona.cammarata@community.unipa.it', 'Simona', 'Cammarata', 'F', '1994-10-19', 1),
(14, 'pietroGreen', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'pietro.caldarera96@gmail.com', 'Pietro', 'Caldarera', 'M', '1992-12-08', 1),
(15, 'Aria94', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'arianna96@gmail.com', 'Arianna', 'Vasca', 'F', '1998-03-11', 1),
(16, 'alfamotor', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'vincenzo.tivolo@yahoo.it', 'Vincenzo', 'Tivolo', 'M', '1994-07-08', 1),
(17, 'elGraffo95', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'vincenzo.graffato@community.unipa.it', 'Vincenzo', 'Graffato', 'M', '1995-01-28', 1),
(18, 'bobBiondo', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'roberto.biondo@community.unipa.it', 'Roberto', 'Biondo', 'M', '1990-06-05', 1),
(19, 'lucas12', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'lucas96@gmail.com', 'Luca', 'Sortino', 'M', '1993-08-14', 1),
(20, 'mariConc', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'mary.moscarelli@gmail.com', 'Maria Concetta', 'Moscarelli', 'F', '2005-07-05', 1),
(21, 'angeloMosca', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'angelomoscarelli66@gmail.com', 'Angelo', 'Moscarelli', 'M', '1966-03-04', 1),
(22, 'stellaAlba', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'alba.stella96@gmail.com', 'Alba', 'Petralia', 'F', '1995-06-05', 1),
(23, 'edogallo', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'edoardo.gallo@commynity.unipa.it', 'Edoardo', 'Gallo', 'M', '1996-10-07', 0),
(24, 'stallaZ', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'vittoria.stalla@yahoo.it', 'Vittoria', 'Stalla', 'F', '1996-07-08', 1);


-- -----------------------------------------------------
-- Table `SoundWaveDB`.`Amicizia`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoundWaveDB`.`Amicizia` ;

CREATE TABLE IF NOT EXISTS `SoundWaveDB`.`Amicizia` (
  `Ref1_IDUtente` INT NOT NULL,
  `Ref2_IDUtente` INT NOT NULL,
  PRIMARY KEY (`Ref1_IDUtente`, `Ref2_IDUtente`),
  INDEX `fk_Amicizia_Account2_idx` (`Ref2_IDUtente` ASC),
  CONSTRAINT `fk_Amicizia_Account1`
    FOREIGN KEY (`Ref1_IDUtente`)
    REFERENCES `SoundWaveDB`.`Account` (`IDUtente`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Amicizia_Account2`
    FOREIGN KEY (`Ref2_IDUtente`)
    REFERENCES `SoundWaveDB`.`Account` (`IDUtente`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Riempimento della tabella 'Amicizia'
-- -----------------------------------------------------
INSERT INTO Amicizia
VALUES 
(1, 2),
(1, 3),
(2, 4),
(1, 5),
(1, 7),
(1, 23),
(1, 12),
(1, 25),
(1, 14),
(1, 22),
(1, 17),
(2, 5),
(2, 10),
(2, 22),
(2, 12),
(2, 11),
(2, 15),
(2, 3),
(2, 18),
(2, 23),
(2, 13),
(3, 4),
(3, 7),
(3, 12),
(3, 11),
(3, 15),
(3, 20),
(3, 18),
(3, 23),
(3, 13),
(3, 10),
(5, 4),
(5, 7),
(5, 12),
(4, 11),
(4, 15),
(4, 3),
(4, 18),
(4, 23),
(6, 13),
(6, 10),
(6, 4),
(6, 7),
(7, 12),
(7, 11),
(7, 15),
(7, 3),
(7, 18),
(7, 23),
(8, 13),
(8, 10),
(9, 4),
(9, 7),
(9, 12),
(10, 11),
(10, 14),
(10, 3),
(10, 18),
(11, 23),
(12, 14),
(12, 10),
(13, 4),
(13, 7),
(14, 12),
(14, 16),
(14, 15),
(15, 3),
(15, 18),
(15, 24),
(15, 13),
(16, 19),
(17, 4),
(17, 7),
(18, 12),
(18, 21),
(19, 15),
(19, 3),
(20, 28),
(20, 23),
(20, 13),
(21, 20),
(21, 4),
(22, 7),
(22, 12),
(23, 11),
(22, 15),
(24, 3),
(24, 18),
(24, 23),
(21, 13),
(22, 10);


-- -----------------------------------------------------
-- Table `SoundWaveDB`.`Brano`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoundWaveDB`.`Brano` ;

CREATE TABLE IF NOT EXISTS `SoundWaveDB`.`Brano` (
  `IDBrano` INT NOT NULL AUTO_INCREMENT,
  `Titolo` VARCHAR(45) NOT NULL,
  `Artista` VARCHAR(45) NOT NULL,
  `Genere` VARCHAR(45) NOT NULL,
  `DataUscita` DATE NOT NULL,
  `Durata` INT UNSIGNED NOT NULL,
  `Url_cover` VARCHAR(150) NOT NULL DEFAULT 'images/cover/default-brano.png',
  `Url_brano` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`IDBrano`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Riempimento della tabella 'Brano'
-- -----------------------------------------------------
INSERT INTO Brano
VALUES 
(1, '90min', 'Salmo', 'Pop', '2018-11-09', 232, 'images/cover/playlist-cover.jpg', 'musica/0/90min.mp3'),
(2, 'Stai zitto', 'Salmo ft. Fabri Fibra', 'Pop', '2018-11-09', 202, 'images/cover/playlist-cover.jpg', 'musica/0/Stai_zitto.mp3'),
(3, 'Ricchi e morti', 'Salmo', 'Pop', '2018-11-09', 138, 'images/cover/playlist-cover.jpg', 'musica/0/Ricchi_e_morti.mp3'),
(4, 'Dispovery Channel', 'Salmo ft. Nitro', 'Pop', '2018-11-09', 204, 'images/cover/playlist-cover.jpg', 'musica/0/Dispovery_channel.mp3'),
(5, 'Cabriolet', 'Salmo ft. Sfera Ebbasta', 'Pop', '2018-11-09', 185, 'images/cover/playlist-cover.jpg', 'musica/0/Cabriolet.mp3'),
(6, 'Ho paura di uscire', 'Salmo', 'Pop', '2018-11-09', 197, 'images/cover/playlist-cover.jpg', 'musica/0/Ho_paura_di_uscire.mp3'),
(7, 'Sparare alla luna', 'Salmo ft. Coez', 'Pop', '2018-11-09', 211, 'images/cover/playlist-cover.jpg', 'musica/0/Sparare_alla_luna.mp3'),
(8, 'PxM', 'Salmo', 'Pop', '2018-11-09', 184, 'images/cover/playlist-cover.jpg', 'musica/0/PXM.mp3'),
(9, 'Il cielo nella stanza', 'Salmo ft. Nstasia', 'Pop', '2018-11-09', 186, 'images/cover/playlist-cover.jpg', 'musica/0/Il_cielo_nella_stanza.mp3'),
(10, 'Tiè!', 'Salmo', 'Pop', '2018-11-09', 91, 'images/cover/playlist-cover.jpg', 'musica/0/Tie.mp3'),
(11, 'Ora che fai?', 'Salmo', 'Pop', '2018-11-09', 130, 'images/cover/playlist-cover.jpg', 'musica/0/Ora_che_fai.mp3'),
(12, 'Perdonami', 'Salmo', 'Pop', '2018-11-09', 135, 'images/cover/playlist-cover.jpg', 'musica/0/Perdonami.mp3'),
(13, 'Lunedì', 'Salmo', 'Pop', '2018-11-09', 205, 'images/cover/playlist-cover.jpg', 'musica/0/Lunedi.mp3'),

(14, 'Any Colour You Like', 'Pink Floyd', 'Rock', '1973-03-01', 205, 'images/cover/dark_side_of_the_moon-cover.png', 'musica/1/Any_colour_you_like.mp3'),
(15, 'Brain Damage', 'Pink Floyd', 'Rock', '1973-03-01', 230, 'images/cover/dark_side_of_the_moon-cover.png', 'musica/1/Brain_damage.mp3'),
(16, 'Eclipse', 'Pink Floyd', 'Rock', '1973-03-01', 124, 'images/cover/dark_side_of_the_moon-cover.png', 'musica/1/Eclipse.mp3'),
(17, 'Money', 'Pink Floyd', 'Rock', '1973-03-01', 392, 'images/cover/dark_side_of_the_moon-cover.png', 'musica/1/Money.mp3'),
(18, 'On the Run', 'Pink Floyd', 'Rock', '1973-03-01', 213, 'images/cover/dark_side_of_the_moon-cover.png', 'musica/1/On_the_run.mp3'),
(19, 'Speak to Me Breathe', 'Pink Floyd', 'Rock', '1973-03-01', 240, 'images/cover/dark_side_of_the_moon-cover.png', 'musica/1/Speak_to_me_breathe.mp3'),
(20, 'The great Gig in the Sky', 'Pink Floyd', 'Rock', '1973-03-01', 284, 'images/cover/dark_side_of_the_moon-cover.png', 'musica/1/The_great_gig_in_the_sky.mp3'),
(21, 'Time', 'Pink Floyd', 'Rock', '1973-03-01', 426, 'images/cover/dark_side_of_the_moon-cover.png', 'musica/1/Time.mp3'),
(22, 'Us and Them', 'Pink Floyd', 'Rock', '1973-03-01', 460, 'images/cover/dark_side_of_the_moon-cover.png', 'musica/1/Us_and_them.mp3'),

(23, 'So What', 'Miles Davis', 'Jazz', '1959-08-17', 564 ,'images/cover/kind_of_blue-cover.jpg', 'musica/2/So_What.mp3'),
(24, 'Freddie Freeloader', 'Miles Davis', 'Jazz', '1959-08-17', 588 ,'images/cover/kind_of_blue-cover.jpg', 'musica/2/Freddie_Freeloader.mp3'),
(25, 'Blue in Green', 'Miles Davis', 'Jazz', '1959-08-17', 337 ,'images/cover/kind_of_blue-cover.jpg', 'musica/2/Blue_in_Green.mp3'),
(26, 'All Blues', 'Miles Davis', 'Jazz', '1959-08-17', 695 ,'images/cover/kind_of_blue-cover.jpg', 'musica/2/All_Blues.mp3'),
(27, 'Flamenco Sketches', 'Miles Davis', 'Jazz', '1959-08-17', 565 ,'images/cover/kind_of_blue-cover.jpg', 'musica/2/Flamenco_Sketches.mp3'),

(28, 'Out There', 'Luke Combs', 'Country', '2017-06-02', 202, 'images/cover/this_ones_for_you-cover.jpg', 'musica/3/Out_There.mp3'),
(29, 'Memories Are Made Of', 'Luke Combs', 'Country', '2017-06-02', 216, 'images/cover/this_ones_for_you-cover.jpg', 'musica/3/Memories_Are_Made_Of.mp3'),
(30, 'Lonely One', 'Luke Combs', 'Country', '2017-06-02', 206, 'images/cover/this_ones_for_you-cover.jpg', 'musica/3/Lonely_One.mp3'),
(31, 'Beer Can', 'Luke Combs', 'Country', '2017-06-02', 210, 'images/cover/this_ones_for_you-cover.jpg', 'musica/3/Beer_Can.mp3'),
(32, 'Hurricane', 'Luke Combs', 'Country', '2017-06-02', 223, 'images/cover/this_ones_for_you-cover.jpg', 'musica/3/Hurricane.mp3'),
(33, 'One Number Away', 'Luke Combs', 'Country', '2017-06-02', 222, 'images/cover/this_ones_for_you-cover.jpg', 'musica/3/One_Number_Away.mp3'),
(34, 'Don\'t Tempt Me', 'Luke Combs', 'Country', '2017-06-02', 211, 'images/cover/this_ones_for_you-cover.jpg', 'musica/3/Dont_Tempt_Me.mp3'),
(35, 'When It Rains It Pours', 'Luke Combs', 'Country', '2017-06-02', 242, 'images/cover/this_ones_for_you-cover.jpg', 'musica/3/When_It_Rains_It_Pours.mp3'),
(36, 'This One\'s for You', 'Luke Combs', 'Country', '2017-06-02', 231, 'images/cover/this_ones_for_you-cover.jpg', 'musica/3/This_Ones_For_You.mp3'),
(37, 'Be Careful What You Wish For', 'Luke Combs', 'Country', '2017-06-02', 175, 'images/cover/this_ones_for_you-cover.jpg', 'musica/3/Be_Careful_What_You_Wish_For.mp3'),
(38, 'I Got Away with You', 'Luke Combs', 'Country', '2017-06-02', 230, 'images/cover/this_ones_for_you-cover.jpg', 'musica/3/I_Got_Away_With_You.mp3'),
(39, 'Honky Tonk Highway', 'Luke Combs', 'Country', '2017-06-02', 210, 'images/cover/this_ones_for_you-cover.jpg', 'musica/3/Honky_Tonk_Highway.mp3'),

(40, 'P.Funk (Wants to Get Funked Up)', 'Parliament', 'Funky', '1975-12-15', 460, 'images/cover/mothership_connection-cover.jpg', 'musica/4/P_Funk.mp3'),
(41, 'Mothership Connection (Star Child)', 'Parliament', 'Funky', '1975-12-15', 373, 'images/cover/mothership_connection-cover.jpg', 'musica/4/Mothership_Connection.mp3'),
(42, 'Unfunky UFO', 'Parliament', 'Funky', '1975-12-15', 263, 'images/cover/mothership_connection-cover.jpg', 'musica/4/Unfunky_UFO.mp3'),
(43, 'Supergroovalisticprosifunkstication', 'Parliament', 'Funky', '1975-12-15', 304, 'images/cover/mothership_connection-cover.jpg', 'musica/4/Supergrooval.mp3'),
(44, 'Handcuffs', 'Parliament', 'Funky', '1975-12-15', 243, 'images/cover/mothership_connection-cover.jpg', 'musica/4/Handcuffs.mp3'),
(45, 'Give Up the Funk', 'Parliament', 'Funky', '1975-12-15', 347, 'images/cover/mothership_connection-cover.jpg', 'musica/4/Give_Up_the_Funk.mp3'),
(46, 'Night of the Thumpasorus Peoples', 'Parliament', 'Funky', '1975-12-15', 310, 'images/cover/mothership_connection-cover.jpg', 'musica/4/Night_of_the_Thumpasorus_Peoples.mp3'),

(47, 'The Ringer', 'Eminem', 'Rap', '2018-08-31', 337, 'images/cover/kamikaze-cover.jpg', 'musica/5/The_Ringer.mp3'),
(48, 'Greatest', 'Eminem', 'Rap', '2018-08-31', 226, 'images/cover/kamikaze-cover.jpg', 'musica/5/Greatest.mp3'),
(49, 'Lucky You', 'Eminem feat. Joyner Lucas', 'Rap', '2018-08-31', 244, 'images/cover/kamikaze-cover.jpg', 'musica/5/Lucky_You.mp3'),
(50, 'Normal', 'Eminem', 'Rap', '2018-08-31', 222, 'images/cover/kamikaze-cover.jpg', 'musica/5/Normal.mp3'),
(51, 'Stepping Stone', 'Eminem', 'Rap', '2018-08-31', 309, 'images/cover/kamikaze-cover.jpg', 'musica/5/Stepping_Stone.mp3'),
(52, 'Not Alike', 'Eminem feat. Royce da 5\'9', 'Rap', '2018-08-31', 288, 'images/cover/kamikaze-cover.jpg', 'musica/5/Not_Alike.mp3'),
(53, 'Fall', 'Eminem', 'Rap', '2018-08-31', 216, 'images/cover/kamikaze-cover.jpg', 'musica/5/Fall.mp3'),
(54, 'Kamikaze', 'Eminem', 'Rap', '2018-08-31', 262, 'images/cover/kamikaze-cover.jpg', 'musica/5/Kamikaze.mp3'),
(55, 'Nice Guy', 'Eminem feat. Jessie Reyez', 'Rap', '2018-08-31', 150, 'images/cover/kamikaze-cover.jpg', 'musica/5/Nice_Guy.mp3'),
(56, 'Good Guy', 'Eminem feat. Jessie Reyez', 'Rap', '2018-08-31', 142, 'images/cover/kamikaze-cover.jpg', 'musica/5/Good_Guy.mp3'),
(57, 'Venom', 'Eminem', 'Rap', '2018-08-31', 269, 'images/cover/kamikaze-cover.jpg', 'musica/5/Venom.mp3'),

(58, 'Walk On Water', 'Eminem feat. Beyoncé', 'Rap', '2017-12-15', 303, 'images/cover/revival-cover.png', 'musica/6/Walk_On_Water.mp3'),
(59, 'Believe', 'Eminem', 'Rap', '2017-12-15', 315, 'images/cover/revival-cover.png', 'musica/6/Believe.mp3'),
(60, 'Chloraseptic', 'Eminem feat. PHRESHER', 'Rap', '2017-12-15', 301, 'images/cover/revival-cover.png', 'musica/6/Chloraseptic.mp3'),
(61, 'Untouchable', 'Eminem', 'Rap', '2017-12-15', 370, 'images/cover/revival-cover.png', 'musica/6/Untouchable.mp3'),
(62, 'River', 'Eminem feat. Ed Sheeran', 'Rap', '2017-12-15', 221, 'images/cover/revival-cover.png', 'musica/6/River.mp3'),
(63, 'Remind Me', 'Eminem', 'Rap', '2017-12-15', 225, 'images/cover/revival-cover.png', 'musica/6/Remind_Me.mp3'),
(64, 'Like Home', 'Eminem feat. Alicia Keys', 'Rap', '2017-12-15', 245, 'images/cover/revival-cover.png', 'musica/6/Like_Home.mp3'),
(65, 'Bad Husband', 'Eminem feat. X Ambassadors', 'Rap', '2017-12-15', 288, 'images/cover/revival-cover.png', 'musica/6/Bad_Husband.mp3'),
(66, 'Tragic Endings', 'Eminem feat. Skylar Grey', 'Rap', '2017-12-15', 252, 'images/cover/revival-cover.png', 'musica/6/Tragic_Endings.mp3'),
(67, 'Framed', 'Eminem', 'Rap', '2017-12-15', 253, 'images/cover/revival-cover.png', 'musica/6/Framed.mp3'),
(68, 'Nowhere Fast', 'Eminem feat. Kehlani', 'Rap', '2017-12-15', 264, 'images/cover/revival-cover.png', 'musica/6/Nowhere_Fast.mp3'),
(69, 'Heat', 'Eminem', 'Rap', '2017-12-15', 250, 'images/cover/revival-cover.png', 'musica/6/Heat.mp3'),
(70, 'Offended', 'Eminem', 'Rap', '2017-12-15', 321, 'images/cover/revival-cover.png', 'musica/6/Offended.mp3'),
(71, 'Need Me', 'Eminem feat. P!nk', 'Rap', '2017-12-15', 265, 'images/cover/revival-cover.png', 'musica/6/Need_Me.mp3'),
(72, 'In Your Head', 'Eminem', 'Rap', '2017-12-15', 182, 'images/cover/revival-cover.png', 'musica/6/In_Your_Head.mp3'),
(73, 'Castle', 'Eminem', 'Rap', '2017-12-15', 254, 'images/cover/revival-cover.png', 'musica/6/Castle.mp3'),
(74, 'Arose', 'Eminem', 'Rap', '2017-12-15', 274, 'images/cover/revival-cover.png', 'musica/6/Arose.mp3');


-- -----------------------------------------------------
-- Table `SoundWaveDB`.`Playlist`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoundWaveDB`.`Playlist` ;

CREATE TABLE IF NOT EXISTS `SoundWaveDB`.`Playlist` (
  `IDPlaylist` INT NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`IDPlaylist`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Riempimento della tabella 'Playlist'
-- -----------------------------------------------------
INSERT INTO Playlist
VALUES 
(1, 'LaMiaPlaylist'),
(2, 'Preferite'),
(3, 'PiuFamose');


-- -----------------------------------------------------
-- Table `SoundWaveDB`.`Composizione`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoundWaveDB`.`Composizione` ;

CREATE TABLE IF NOT EXISTS `SoundWaveDB`.`Composizione` (
  `OrdineBrano` INT NOT NULL,
  `Ref_IDPlaylist` INT NOT NULL,
  `Ref_IDBrano` INT NOT NULL,
  PRIMARY KEY (`OrdineBrano`, `Ref_IDPlaylist`),
  INDEX `fk_Composizione_Playlist1_idx` (`Ref_IDPlaylist` ASC),
  INDEX `fk_Composizione_Brano1_idx` (`Ref_IDBrano` ASC),
  CONSTRAINT `fk_Composizione_Playlist1`
    FOREIGN KEY (`Ref_IDPlaylist`)
    REFERENCES `SoundWaveDB`.`Playlist` (`IDPlaylist`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Composizione_Brano1`
    FOREIGN KEY (`Ref_IDBrano`)
    REFERENCES `SoundWaveDB`.`Brano` (`IDBrano`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Riempimento della tabella 'Composizione'
-- -----------------------------------------------------
INSERT INTO Composizione
VALUES 
(1, 1, 13),
(2, 1, 12),
(3, 1, 22),
(4, 1, 21),
(5, 1, 1),
(6, 1, 5),
(7, 1, 15),
(8, 1, 18),
(9, 1, 20),
(10, 1, 14),

(1, 2, 70),
(2, 2, 28),
(3, 2, 45),
(4, 2, 64),
(5, 2, 10),
(6, 2, 34),
(7, 2, 53),
(8, 2, 50),
(9, 2, 42),
(10, 2, 20),
(11, 2, 29),
(12, 2, 35),
(13, 2, 74),
(14, 2, 57),
(15, 2, 66),

(1, 3, 57),
(2, 3, 62),
(3, 3, 7),
(4, 3, 12),
(5, 3, 62),
(6, 3, 58),
(7, 3, 9);


-- -----------------------------------------------------
-- Table `SoundWaveDB`.`Possiede`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoundWaveDB`.`Possiede` ;

CREATE TABLE IF NOT EXISTS `SoundWaveDB`.`Possiede` (
  `Ref_IDUtente` INT NOT NULL,
  `Ref_IDPlaylist` INT NOT NULL,
  PRIMARY KEY (`Ref_IDPlaylist`, `Ref_IDUtente`),
  INDEX `fk_Possiede_Playlist1_idx` (`Ref_IDPlaylist` ASC),
  INDEX `fk_Possiede_Account1_idx` (`Ref_IDUtente` ASC),
  CONSTRAINT `fk_Possiede_Playlist1`
    FOREIGN KEY (`Ref_IDPlaylist`)
    REFERENCES `SoundWaveDB`.`Playlist` (`IDPlaylist`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Possiede_Account1`
    FOREIGN KEY (`Ref_IDUtente`)
    REFERENCES `SoundWaveDB`.`Account` (`IDUtente`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Riempimento della tabella 'Possiede'
-- -----------------------------------------------------
INSERT INTO Possiede
VALUES 
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(2, 3),
(3, 1),
(3, 2),
(3, 3);


-- -----------------------------------------------------
-- Table `SoundWaveDB`.`Album`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoundWaveDB`.`Album` ;

CREATE TABLE IF NOT EXISTS `SoundWaveDB`.`Album` (
  `IDAlbum` INT NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(45) NOT NULL,
  `Artista` VARCHAR(45) NOT NULL,
  `NumeroBrani` INT NOT NULL,
  `Url_cover` VARCHAR(150) NOT NULL DEFAULT 'images/cover/default-album.png',
  PRIMARY KEY (`IDAlbum`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Riempimento della tabella 'Album'
-- -----------------------------------------------------
INSERT INTO Album
VALUES 
(1, 'Playlist', 'Salmo', 13, 'images/cover/playlist-cover.jpg'),
(2, 'The Dark Side of The Moon', 'Pink Floyd', 9, 'images/cover/dark_side_of_the_moon-cover.png'),
(3, 'Kind of Blue', 'Miles Davis', 5, 'images/cover/kind_of_blue-cover.jpg'),
(4, 'This One\'s for You', 'Luke Combs', 12, 'images/cover/this_ones_for_you-cover.jpg'),
(5, 'Mothership Connection', 'Parliament', 7, 'images/cover/mothership_connection-cover.jpg'),
(6, 'Kamikaze', 'Eminem', 11, 'images/cover/kamikaze-cover.jpg'),
(7, 'Revival', 'Eminem', 17, 'images/cover/revival-cover.png');


-- -----------------------------------------------------
-- Table `SoundWaveDB`.`Appartenenza`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoundWaveDB`.`Appartenenza` ;

CREATE TABLE IF NOT EXISTS `SoundWaveDB`.`Appartenenza` (
  `OrdineBrano` INT NOT NULL,
  `Ref_IDAlbum` INT NOT NULL,
  `Ref_IDBrano` INT NOT NULL,
  PRIMARY KEY (`OrdineBrano`, `Ref_IDAlbum`),
  INDEX `fk_Appartenenza_Album1_idx` (`Ref_IDAlbum` ASC),
  INDEX `fk_Appartenenza_Brano1_idx` (`Ref_IDBrano` ASC),
  CONSTRAINT `fk_Appartenenza_Album1`
    FOREIGN KEY (`Ref_IDAlbum`)
    REFERENCES `SoundWaveDB`.`Album` (`IDAlbum`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Appartenenza_Brano1`
    FOREIGN KEY (`Ref_IDBrano`)
    REFERENCES `SoundWaveDB`.`Brano` (`IDBrano`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Riempimento della tabella 'Appartenenza'
-- -----------------------------------------------------
INSERT INTO Appartenenza
VALUES 
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5),
(6, 1, 6),
(7, 1, 7),
(8, 1, 8),
(9, 1, 9),
(10, 1, 10),
(11, 1, 11),
(12, 1, 12),
(13, 1, 13),

(1, 2, 19),
(2, 2, 18),
(3, 2, 21),
(4, 2, 20),
(5, 2, 17),
(6, 2, 22),
(7, 2, 14),
(8, 2, 15),
(9, 2, 16),

(1, 3, 23),
(2, 3, 24),
(3, 3, 25),
(4, 3, 26),
(5, 3, 27),

(1, 4, 28),
(2, 4, 29),
(3, 4, 30),
(4, 4, 31),
(5, 4, 32),
(6, 4, 33),
(7, 4, 34),
(8, 4, 35),
(9, 4, 36),
(10, 4, 37),
(11, 4, 38),
(12, 4, 39),

(1, 5, 40),
(2, 5, 41),
(3, 5, 42),
(4, 5, 43),
(5, 5, 44),
(6, 5, 45),
(7, 5, 46),

(1, 6, 47),
(2, 6, 48),
(3, 6, 49),
(4, 6, 50),
(5, 6, 51),
(6, 6, 52),
(7, 6, 53),
(8, 6, 54),
(9, 6, 55),
(10, 6, 56),
(11, 6, 57),

(1, 7, 58),
(2, 7, 59),
(3, 7, 60),
(4, 7, 61),
(5, 7, 62),
(6, 7, 63),
(7, 7, 64),
(8, 7, 65),
(9, 7, 66),
(10, 7, 67),
(11, 7, 68),
(12, 7, 69),
(13, 7, 70),
(14, 7, 71),
(15, 7, 72),
(16, 7, 73),
(17, 7, 74);


-- ---------------------------------------------------------------------------
-- Creazione della vista `Brani_Playlist` che contiene i dati dell'utente, 
-- della playlist e dei brani associati a quella playlist.
-- ---------------------------------------------------------------------------
CREATE VIEW Brani_Playlist AS
SELECT Pl.IDPlaylist, A.IDUtente, B.IDBrano, B.Titolo, B.Artista, B.Durata, B.Url_cover, B.Url_brano
FROM Account A, Possiede Po, Playlist Pl, Composizione C, Brano B
WHERE A.IDUtente = Po.Ref_IDUtente AND Pl.IDPlaylist = Po.Ref_IDPlaylist AND
	  Pl.IDPlaylist = C.Ref_IDPlaylist AND B.IDBrano = C.Ref_IDBrano
ORDER BY OrdineBrano;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
