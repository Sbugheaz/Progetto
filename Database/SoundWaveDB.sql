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
(12, 'ginosauro', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'gino.divita@yahoo.it', 'Girolamo', 'Di Vita', 'M', '1996-07-08', 1),
(13, 'simocammy', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'simona.cammarata@community.unipa.it', 'Simona', 'Cammarata', 'F', '1994-10-19', 1),
(14, 'pietroGreen', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'pietro.caldarera96@gmail.com', 'Pietro', 'Caldarera', 'M', '1992-12-08', 1),
(15, 'Aria94', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'arianna96@gmail.com', 'Arianna', 'Vasca', 'F', '1998-03-11', 1),
(16, 'alfamotor', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'vincenzo.tivolo@yahoo.it', 'Vincenzo', 'Tivolo', 'M', '1994-07-08', 1),
(17, 'elGraffo95', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'vincenzo.graffato@community.unipa.it', 'Vincenzo', 'Graffato', 'M', '1995-01-28', 1),
(18, 'bobBiondo', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'roberto.biondo@community.unipa.it', 'Roberto', 'Biondo', 'M', '1990-06-05', 1),
(19, 'lucas12', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'lucas96@gmail.com', 'Luca', 'Sortino', 'M', '1993-08-14', 1),
(20, 'mariConc', 'El+B8Pc6t+YkFd1aEBANnaI2mn5ZnYw4hH6Kv7EVBrg=', 'mary.moscarelli@gmail.com', 'Maria Concetta', 'M0scraelli', 'F', '2005-07-05', 1),
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
  `Url_cover` VARCHAR(150) NOT NULL DEFAULT '/images/cover/default-brano.png',
  `Url_brano` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`IDBrano`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Riempimento della tabella 'Brano'
-- -----------------------------------------------------
INSERT INTO Brano
VALUES 
(1, '90min', 'Salmo', 'Pop', '2018-11-09', 222, 'images/cover/playlist-cover.jpg', 'musica/0/90MIN.mp3'),
(2, 'Stai zitto', 'Salmo ft. Fabri Fibra', 'Pop', '2018-11-09', 202, 'images/cover/playlist-cover.jpg', 'musica/0/STAI_ZITTO.mp3'),
(3, 'Ricchi e morti', 'Salmo', 'Pop', '2018-11-09', 138, 'images/cover/playlist-cover.jpg', 'musica/0/RICCHI_E_MORTI.mp3'),
(4, 'Dispovery Channel', 'Salmo ft. Nitro', 'Pop', '2018-11-09', 204, 'images/cover/playlist-cover.jpg', 'musica/0/DISPOVERY_CHANNEL.mp3'),
(5, 'Cabriolet', 'Salmo ft. Sfera Ebbasta', 'Pop', '2018-11-09', 185, 'images/cover/playlist-cover.jpg', 'musica/0/CABRIOLET.mp3'),
(6, 'Ho paura di uscire', 'Salmo', 'Pop', '2018-11-09', 197, 'images/cover/playlist-cover.jpg', 'musica/0/HO_PAURA_DI_USCIRE.mp3'),
(7, 'Sparare alla luna', 'Salmo ft. Coez', 'Pop', '2018-11-09', 211, 'images/cover/playlist-cover.jpg', 'musica/0/SPARARE_ALLA_LUNA.mp3'),
(8, 'PxM', 'Salmo', 'Pop', '2018-11-09', 184, 'images/cover/playlist-cover.jpg', 'musica/0/PXM.mp3'),
(9, 'Il cielo nella stanza', 'Salmo ft. Nstasia', 'Pop', '2018-11-09', 186, 'images/cover/playlist-cover.jpg', 'musica/0/IL CIELO NELLA STANZA.mp3'),
(10, 'Tiè', 'Salmo', 'Pop', '2018-11-09', 91, 'images/cover/playlist-cover.jpg', 'musica/0/TIE.mp3'),
(11, 'Ora che fai?', 'Salmo', 'Pop', '2018-11-09', 130, 'images/cover/playlist-cover.jpg', 'musica/0/ORA_CHE_FAI.mp3'),
(12, 'Perdonami', 'Salmo', 'Pop', '2018-11-09', 135, 'images/cover/playlist-cover.jpg', 'musica/0/Perdonami.mp3'),
(13, 'Lunedì', 'Salmo', 'Pop', '2018-11-09', 205, 'images/cover/playlist-cover.jpg', 'musica/0/LUNEDI.mp3');


-- -----------------------------------------------------
-- Table `SoundWaveDB`.`Playlist`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoundWaveDB`.`Playlist` ;

CREATE TABLE IF NOT EXISTS `SoundWaveDB`.`Playlist` (
  `IDPlaylist` INT NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(45) NOT NULL,
  `NumeroBrani` INT NOT NULL,
  PRIMARY KEY (`IDPlaylist`),
  UNIQUE INDEX `Nome_UNIQUE` (`Nome` ASC))
ENGINE = InnoDB;


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
-- Table `SoundWaveDB`.`Album`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoundWaveDB`.`Album` ;

CREATE TABLE IF NOT EXISTS `SoundWaveDB`.`Album` (
  `IDAlbum` INT NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(45) NOT NULL,
  `Artista` VARCHAR(45) NOT NULL,
  `NumeroBrani` INT NOT NULL,
  `Url_cover` VARCHAR(150) NOT NULL DEFAULT '/images/cover/default-album.png',
  PRIMARY KEY (`IDAlbum`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Riempimento della tabella 'Album'
-- -----------------------------------------------------
INSERT INTO Album
VALUES 
(1, 'Playlist', 'Salmo', 13, 'images/cover/playlist-cover.jpg');


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
(13, 1, 13);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
