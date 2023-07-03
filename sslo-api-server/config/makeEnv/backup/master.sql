-- MySQL dump 10.13  Distrib 8.0.31, for Linux (x86_64)
--
-- Host: 0.0.0.0    Database: sslo_db
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `annotation`
--

DROP TABLE IF EXISTS `annotation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `annotation` (
  `annotation_id` int NOT NULL,
  `project_id` int NOT NULL,
  `task_id` int NOT NULL,
  `annotation_type_id` int NOT NULL,
  `annotation_category_id` int NOT NULL,
  `annotation_category_attr_id` int DEFAULT NULL,
  `annotation_category_attr_val_select` text COLLATE utf8mb4_unicode_ci,
  `annotation_category_attr_val_input` int DEFAULT NULL,
  `annotation_data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`annotation_id`,`project_id`),
  KEY `annotation_project_id_FK` (`project_id`),
  KEY `annotation_task_id_FK` (`task_id`),
  KEY `annotation_annotation_category_id_FK` (`annotation_category_id`),
  KEY `annotation_annotation_category_attr_id_FK` (`annotation_category_attr_id`),
  KEY `annotation_annotation_type_id_FK` (`annotation_type_id`),
  CONSTRAINT `annotation_annotation_category_attr_id_FK` FOREIGN KEY (`annotation_category_attr_id`) REFERENCES `annotation_category_attribute` (`annotation_category_attr_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `annotation_annotation_category_id_FK` FOREIGN KEY (`annotation_category_id`) REFERENCES `annotation_category` (`annotation_category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `annotation_annotation_type_id_FK` FOREIGN KEY (`annotation_type_id`) REFERENCES `annotation_type` (`annotation_type_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `annotation_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `annotation_task_id_FK` FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `annotation`
--

LOCK TABLES `annotation` WRITE;
/*!40000 ALTER TABLE `annotation` DISABLE KEYS */;
/*!40000 ALTER TABLE `annotation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `annotation_category`
--

DROP TABLE IF EXISTS `annotation_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `annotation_category` (
  `annotation_category_id` int NOT NULL,
  `project_id` int NOT NULL,
  `annotation_category_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `annotation_category_parent_id` int DEFAULT NULL,
  `annotation_category_color` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`annotation_category_id`,`project_id`),
  KEY `annotation_category_project_id_FK` (`project_id`),
  CONSTRAINT `annotation_category_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `annotation_category`
--

LOCK TABLES `annotation_category` WRITE;
/*!40000 ALTER TABLE `annotation_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `annotation_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `annotation_category_attribute`
--

DROP TABLE IF EXISTS `annotation_category_attribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `annotation_category_attribute` (
  `annotation_category_attr_id` int NOT NULL,
  `annotation_category_id` int NOT NULL,
  `project_id` int NOT NULL,
  `annotation_category_attr_name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `annotation_category_attr_desc` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `annotation_category_attr_type` int NOT NULL,
  `annotation_category_attr_val` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `annotation_category_attr_limit_min` int DEFAULT NULL,
  `annotation_category_attr_limit_max` int DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`annotation_category_attr_id`,`annotation_category_id`,`project_id`),
  KEY `annotation_category_attribute_annotation_category_id_FK` (`annotation_category_id`),
  KEY `annotation_category_attribute_project_id_FK` (`project_id`),
  CONSTRAINT `annotation_category_attribute_annotation_category_id_FK` FOREIGN KEY (`annotation_category_id`) REFERENCES `annotation_category` (`annotation_category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `annotation_category_attribute_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `annotation_category_attribute`
--

LOCK TABLES `annotation_category_attribute` WRITE;
/*!40000 ALTER TABLE `annotation_category_attribute` DISABLE KEYS */;
/*!40000 ALTER TABLE `annotation_category_attribute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `annotation_category_coco`
--

DROP TABLE IF EXISTS `annotation_category_coco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `annotation_category_coco` (
  `annotation_category_id` int NOT NULL,
  `annotation_category_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `annotation_category_parent_id` int DEFAULT NULL,
  `annotation_category_color` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#4C6793',
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`annotation_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `annotation_category_coco`
--

LOCK TABLES `annotation_category_coco` WRITE;
/*!40000 ALTER TABLE `annotation_category_coco` DISABLE KEYS */;
INSERT INTO `annotation_category_coco` VALUES (0,'person',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(1,'bicycle',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(2,'car',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(3,'motorbike',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(4,'aeroplane',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(5,'bus',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(6,'train',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(7,'truck',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(8,'boat',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(9,'traffic light',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(10,'fire hydrant',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(11,'stop sign',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(12,'parking meter',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(13,'bench',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(14,'bird',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(15,'cat',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(16,'dog',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(17,'horse',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(18,'sheep',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(19,'cow',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(20,'elephant',NULL,'#4C6793','2022-10-27 00:57:32',NULL),(21,'bear',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(22,'zebra',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(23,'giraffe',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(24,'backpack',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(25,'umbrella',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(26,'handbag',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(27,'tie',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(28,'suitcase',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(29,'frisbee',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(30,'skis',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(31,'snowboard',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(32,'sports ball',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(33,'kite',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(34,'baseball bat',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(35,'baseball glove',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(36,'skateboard',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(37,'surfboard',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(38,'tennis racket',NULL,'#4C6793','2022-10-27 00:57:33',NULL),(39,'bottle',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(40,'wine glass',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(41,'cup',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(42,'fork',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(43,'knife',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(44,'spoon',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(45,'bowl',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(46,'banana',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(47,'apple',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(48,'sandwich',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(49,'orange',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(50,'broccoli',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(51,'carrot',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(52,'hot dog',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(53,'pizza',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(54,'donut',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(55,'cake',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(56,'chair',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(57,'sofa',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(58,'pottedplant',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(59,'bed',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(60,'diningtable',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(61,'toilet',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(62,'tvmonitor',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(63,'laptop',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(64,'mouse',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(65,'remote',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(66,'keyboard',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(67,'cell phone',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(68,'microwave',NULL,'#4C6793','2022-10-27 00:57:34',NULL),(69,'oven',NULL,'#4C6793','2022-10-27 00:57:35',NULL),(70,'toaster',NULL,'#4C6793','2022-10-27 00:57:35',NULL),(71,'sink',NULL,'#4C6793','2022-10-27 00:57:35',NULL),(72,'refrigerator',NULL,'#4C6793','2022-10-27 00:57:35',NULL),(73,'book',NULL,'#4C6793','2022-10-27 00:57:35',NULL),(74,'clock',NULL,'#4C6793','2022-10-27 00:57:35',NULL),(75,'vase',NULL,'#4C6793','2022-10-27 00:57:35',NULL),(76,'scissors',NULL,'#4C6793','2022-10-27 00:57:35',NULL),(77,'teddy bear',NULL,'#4C6793','2022-10-27 00:57:35',NULL),(78,'hair drier',NULL,'#4C6793','2022-10-27 00:57:35',NULL),(79,'toothbrush',NULL,'#4C6793','2022-10-27 00:57:35',NULL);
/*!40000 ALTER TABLE `annotation_category_coco` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `annotation_type`
--

DROP TABLE IF EXISTS `annotation_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `annotation_type` (
  `annotation_type_id` int NOT NULL,
  `annotation_type_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `annotation_type_desc` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`annotation_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `annotation_type`
--

LOCK TABLES `annotation_type` WRITE;
/*!40000 ALTER TABLE `annotation_type` DISABLE KEYS */;
INSERT INTO `annotation_type` VALUES (1,'bbox','box annotation','2022-10-27 00:57:31',NULL),(2,'polygon','polygon annotation','2022-10-27 00:57:31',NULL),(3,'segment','segment annotation','2022-10-27 00:57:31',NULL);
/*!40000 ALTER TABLE `annotation_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `comment_body` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment_creator_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `comment_updater_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `comment_comment_creator_id_FK` (`comment_creator_id`),
  KEY `comment_comment_updater_id_FK` (`comment_updater_id`),
  CONSTRAINT `comment_comment_creator_id_FK` FOREIGN KEY (`comment_creator_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `comment_comment_updater_id_FK` FOREIGN KEY (`comment_updater_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dataset`
--

DROP TABLE IF EXISTS `dataset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dataset` (
  `dataset_id` int NOT NULL AUTO_INCREMENT,
  `dataset_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dataset_desc` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataset_items_count` int NOT NULL DEFAULT '0',
  `dataset_items_size` bigint NOT NULL DEFAULT '0',
  `dataset_category` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataset_sub_category` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`dataset_id`),
  UNIQUE KEY `dataset_name_UK` (`dataset_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dataset`
--

LOCK TABLES `dataset` WRITE;
/*!40000 ALTER TABLE `dataset` DISABLE KEYS */;
/*!40000 ALTER TABLE `dataset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `license`
--

DROP TABLE IF EXISTS `license`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `license` (
  `license_id` int NOT NULL,
  `license_name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `license_url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `license_desc` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`license_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `license`
--

LOCK TABLES `license` WRITE;
/*!40000 ALTER TABLE `license` DISABLE KEYS */;
INSERT INTO `license` VALUES (1,'no license','http://','','2022-10-27 00:57:35',NULL),(2,'sslo license','http://sslo.ai','tbell.co','2022-10-27 00:57:35',NULL);
/*!40000 ALTER TABLE `license` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `project_id` int NOT NULL AUTO_INCREMENT,
  `project_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_desc` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_status` int NOT NULL DEFAULT '1',
  `project_type_id` int NOT NULL,
  `project_manager_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`project_id`),
  KEY `project_project_type_id_FK` (`project_type_id`),
  KEY `project_project_manager_id_FK` (`project_manager_id`),
  CONSTRAINT `project_project_manager_id_FK` FOREIGN KEY (`project_manager_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_project_type_id_FK` FOREIGN KEY (`project_type_id`) REFERENCES `project_type` (`project_type_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_detail`
--

DROP TABLE IF EXISTS `project_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_detail` (
  `project_id` int NOT NULL,
  `project_type_id` int NOT NULL,
  `item_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_val` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_val_int` int DEFAULT NULL,
  `item_val_datetime` datetime DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`project_id`,`project_type_id`,`item_name`),
  KEY `project_detail_project_type_id_FK` (`project_type_id`),
  CONSTRAINT `project_detail_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_detail_project_type_id_FK` FOREIGN KEY (`project_type_id`) REFERENCES `project_type` (`project_type_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_detail`
--

LOCK TABLES `project_detail` WRITE;
/*!40000 ALTER TABLE `project_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_type`
--

DROP TABLE IF EXISTS `project_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_type` (
  `project_type_id` int NOT NULL,
  `project_type_name` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`project_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_type`
--

LOCK TABLES `project_type` WRITE;
/*!40000 ALTER TABLE `project_type` DISABLE KEYS */;
INSERT INTO `project_type` VALUES (1,'수집','2022-10-27 00:57:30',NULL),(2,'정제/전처리','2022-10-27 00:57:30',NULL),(3,'가공','2022-10-27 00:57:30',NULL);
/*!40000 ALTER TABLE `project_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rawdata`
--

DROP TABLE IF EXISTS `rawdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rawdata` (
  `rawdata_id` bigint NOT NULL,
  `dataset_id` int NOT NULL,
  `rawdata_name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rawdata_fortmat` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PNG',
  `rawdata_filename` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rawdata_size` int DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`rawdata_id`,`dataset_id`),
  KEY `rawdata_dataset_id_FK` (`dataset_id`),
  CONSTRAINT `rawdata_dataset_id_FK` FOREIGN KEY (`dataset_id`) REFERENCES `dataset` (`dataset_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rawdata`
--

LOCK TABLES `rawdata` WRITE;
/*!40000 ALTER TABLE `rawdata` DISABLE KEYS */;
/*!40000 ALTER TABLE `rawdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ref_task_comment`
--

DROP TABLE IF EXISTS `ref_task_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ref_task_comment` (
  `project_id` int NOT NULL,
  `task_id` int NOT NULL,
  `task_status_step` int NOT NULL,
  `task_status_progress` int NOT NULL,
  `comment_id` int NOT NULL,
  PRIMARY KEY (`project_id`,`task_id`,`task_status_step`,`task_status_progress`),
  KEY `ref_task_comment_task_id_FK` (`task_id`),
  KEY `ref_task_comment_comment_id_FK` (`comment_id`),
  CONSTRAINT `ref_task_comment_comment_id_FK` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`comment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ref_task_comment_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ref_task_comment_task_id_FK` FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_task_comment`
--

LOCK TABLES `ref_task_comment` WRITE;
/*!40000 ALTER TABLE `ref_task_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `ref_task_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL,
  `role_name` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role_desc` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrator',NULL,'2022-10-27 00:57:31',NULL),(3,'Member',NULL,'2022-10-27 00:57:31',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_globals`
--

DROP TABLE IF EXISTS `roles_globals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles_globals` (
  `user_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `roles_globals_user_id_FK` (`user_id`),
  KEY `roles_globals_role_id_FK` (`role_id`),
  KEY `role_id_idx` (`role_id`),
  CONSTRAINT `roles_globals_role_id_FK` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `roles_globals_user_id_FK` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_globals`
--

LOCK TABLES `roles_globals` WRITE;
/*!40000 ALTER TABLE `roles_globals` DISABLE KEYS */;
INSERT INTO `roles_globals` VALUES ('admin01',1),('admin03',1);
/*!40000 ALTER TABLE `roles_globals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_projects`
--

DROP TABLE IF EXISTS `roles_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles_projects` (
  `user_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`project_id`,`user_id`,`role_id`),
  KEY `roles_projects_user_id_FK` (`user_id`),
  KEY `role_id_idx` (`role_id`),
  CONSTRAINT `roles_projects _role_id_FK` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `roles_projects_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `roles_projects_user_id_FK` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_projects`
--

LOCK TABLES `roles_projects` WRITE;
/*!40000 ALTER TABLE `roles_projects` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles_projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
  `task_id` int NOT NULL,
  `project_id` int NOT NULL,
  `task_type_id` int NOT NULL,
  `task_name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `task_category` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_sub_category` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `license_id` int DEFAULT NULL,
  `task_worker_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_validator_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_status_step` int NOT NULL DEFAULT '1',
  `task_status_progress` int NOT NULL DEFAULT '1',
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`task_id`,`project_id`),
  KEY `task_project_id_FK` (`project_id`),
  KEY `task_license_id_FK` (`license_id`),
  KEY `task_task_worker_id_FK` (`task_worker_id`),
  KEY `task_task_validator_id_FK` (`task_validator_id`),
  KEY `task_task_type_id_FK` (`task_type_id`),
  CONSTRAINT `task_license_id_FK` FOREIGN KEY (`license_id`) REFERENCES `license` (`license_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `task_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `task_task_type_id_FK` FOREIGN KEY (`task_type_id`) REFERENCES `task_type` (`task_type_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `task_task_validator_id_FK` FOREIGN KEY (`task_validator_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `task_task_worker_id_FK` FOREIGN KEY (`task_worker_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_detail`
--

DROP TABLE IF EXISTS `task_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_detail` (
  `project_id` int NOT NULL,
  `task_id` int NOT NULL,
  `item_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_val` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_val_int` int DEFAULT NULL,
  `item_val_datetime` datetime DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`project_id`,`task_id`,`item_name`),
  KEY `task_detail_task_id_FK` (`task_id`),
  CONSTRAINT `task_detail_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `task_detail_task_id_FK` FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_detail`
--

LOCK TABLES `task_detail` WRITE;
/*!40000 ALTER TABLE `task_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_type`
--

DROP TABLE IF EXISTS `task_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_type` (
  `task_type_id` int NOT NULL,
  `task_type_name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`task_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_type`
--

LOCK TABLES `task_type` WRITE;
/*!40000 ALTER TABLE `task_type` DISABLE KEYS */;
INSERT INTO `task_type` VALUES (1,'image','2022-10-27 00:57:36',NULL);
/*!40000 ALTER TABLE `task_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_password` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_display_name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_email` varchar(321) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('admin01','$2b$12$u.NZUKRcBbACEhbPkybyX.Hv5dI4Nvkx6scfjSnKgzDNQoPCpO11G','admin01 user','admin@tbell.co.kr','2022-10-27 00:57:43',NULL),('admin02','$2b$12$p2EUxFKN6XLmnEtBVAmg2uPUkJF5KetYwWBlMZ99q4sa5YqJICPfm','admin02 user','admin02@tbell.co.kr','2022-10-27 00:57:43',NULL),('admin03','$2b$12$8qwSnes5Pdikj9FHT1qu1OVoBtk9z.rbZ1K4HeaKQyqFCiFjQHXai','admin03 user','admin03@tbell.co.kr','2022-10-27 00:57:43',NULL),('pm01','$2b$12$u.NZUKRcBbACEhbPkybyX.Hv5dI4Nvkx6scfjSnKgzDNQoPCpO11G','01 pm','pm.01@tbell.co.kr','2022-10-27 00:57:43',NULL),('pm02','$2b$12$p2EUxFKN6XLmnEtBVAmg2uPUkJF5KetYwWBlMZ99q4sa5YqJICPfm','02 pm','pm.02@tbell.co.kr','2022-10-27 00:57:43',NULL),('pm03','$2b$12$8qwSnes5Pdikj9FHT1qu1OVoBtk9z.rbZ1K4HeaKQyqFCiFjQHXai','03 pm','pm.03@tbell.co.kr','2022-10-27 00:57:43',NULL),('user01','$2b$12$u.NZUKRcBbACEhbPkybyX.Hv5dI4Nvkx6scfjSnKgzDNQoPCpO11G','02 user','user.01@tbell.co.kr','2022-10-27 00:57:43',NULL),('user02','$2b$12$p2EUxFKN6XLmnEtBVAmg2uPUkJF5KetYwWBlMZ99q4sa5YqJICPfm','02 user','user.02@tbell.co.kr','2022-10-27 00:57:43',NULL),('user03','$2b$12$8qwSnes5Pdikj9FHT1qu1OVoBtk9z.rbZ1K4HeaKQyqFCiFjQHXai','03 user','user.03@tbell.co.kr','2022-10-27 00:57:43',NULL),('user04','$2b$12$k9PeYQEeV8GWRy4w1NNKT.SeoAT1JIM8TQUEk.rZn.xFQ6bVJQCEa','04 user','user.04@tbell.co.kr','2022-10-27 00:57:43',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-27  0:59:00
