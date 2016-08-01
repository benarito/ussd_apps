-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 01, 2016 at 09:33 AM
-- Server version: 5.5.50-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `busara`
--

-- --------------------------------------------------------

--
-- Table structure for table `input_stats`
--

CREATE TABLE IF NOT EXISTS `input_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_statistic_id` int(11) NOT NULL,
  `backspaceCount` int(11) NOT NULL,
  `totalKeyPressCount` int(11) NOT NULL,
  `timeStartTyping` varchar(64) NOT NULL,
  `timeStopTyping` varchar(64) NOT NULL,
  `timeSpentInField` int(11) NOT NULL,
  `finalInputValue` varchar(128) NOT NULL,
  `finalInputLength` int(11) NOT NULL,
  `intelliWordChanges` varchar(256) NOT NULL,
  `intelliWordIndex` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=36 ;

-- --------------------------------------------------------

--
-- Table structure for table `page_statistics`
--

CREATE TABLE IF NOT EXISTS `page_statistics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `respondent_id` int(11) NOT NULL,
  `timestamp` varchar(64) NOT NULL,
  `timespent` int(11) NOT NULL,
  `previousPage` varchar(20) NOT NULL,
  `pageName` varchar(20) NOT NULL,
  `pageOrder` int(11) NOT NULL,
  `isInputPresent` varchar(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=134 ;

-- --------------------------------------------------------

--
-- Table structure for table `respondents`
--

CREATE TABLE IF NOT EXISTS `respondents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `survey_id` varchar(12) NOT NULL,
  `application` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
