-- MySQL Script generated by MySQL Workbench
-- lun 10 dic 2018 16:58:44 CET
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
  `IDUtente` INT NOT NULL,
  `NomeUtente` VARCHAR(45) NOT NULL,
  `Password` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `Nome` VARCHAR(45) NOT NULL,
  `Cognome` VARCHAR(45) NOT NULL,
  `Sesso` CHAR(1) NOT NULL,
  `DataDiNascita` DATE NOT NULL,
  `StatoOnline` BIT(1) NOT NULL DEFAULT b'0',
  `Attivazione` BIT(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`IDUtente`),
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC),
  UNIQUE INDEX `NumeroDiTelefono_UNIQUE` (`Cognome` ASC),
  UNIQUE INDEX `NomeUtente_UNIQUE` (`NomeUtente` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Populating table `mydb`.`Account`
-- -----------------------------------------------------
INSERT INTO Account
VALUES 
(1, 'Sbugheaz', 'Giacop96', 'gianmarco.coppola@community.unipa.it', 'Gianmarco', 'Coppola', 'M', '1996-10-19', 0, 1),
(2, 'ElMosca96', 'Giumos96', 'giuseppe.moscarelli96@gmail.com', 'Giuseppe', 'Moscarelli', 'M', '1996-06-05', 0, 1),
(3, 'Aries96', 'Andvar96', 'andryplus96@gmail.com', 'Andrea', 'Vara', 'M', '1996-06-10', 0, 0);


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
-- Table `SoundWaveDB`.`Brano`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoundWaveDB`.`Brano` ;

CREATE TABLE IF NOT EXISTS `SoundWaveDB`.`Brano` (
  `IDBrano` INT NOT NULL AUTO_INCREMENT,
  `Titolo` VARCHAR(45) NOT NULL,
  `Artista` VARCHAR(45) NOT NULL,
  `Genere` VARCHAR(45) NOT NULL,
  `Anno` DATE NOT NULL,
  `Durata` INT UNSIGNED NOT NULL,
  `Url_cover` VARCHAR(150) NOT NULL DEFAULT '/media/cover/default-brano.png',
  `Url_brano` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`IDBrano`))
ENGINE = InnoDB;


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


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;