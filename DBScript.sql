-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: eretail
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `image_product`
--

LOCK TABLES `image_product` WRITE;
/*!40000 ALTER TABLE `image_product` DISABLE KEYS */;
INSERT INTO `image_product` VALUES (1,1,'https://example.com/images/product1_img1.jpg'),(2,1,'https://example.com/images/product1_img2.jpg'),(3,2,'https://example.com/images/product2_img1.jpg'),(4,2,'https://example.com/images/product2_img2.jpg'),(5,3,'https://example.com/images/product3_img1.jpg'),(6,3,'https://example.com/images/product3_img2.jpg'),(7,3,'https://example.com/images/product3_img3.jpg'),(8,4,'https://example.com/images/product4_img1.jpg'),(9,4,'https://example.com/images/product4_img2.jpg'),(10,5,'https://example.com/images/product5_img1.jpg'),(11,5,'https://example.com/images/product5_img2.jpg'),(12,6,'https://example.com/images/product6_img1.jpg'),(13,6,'https://example.com/images/product6_img2.jpg'),(14,6,'https://example.com/images/product6_img3.jpg'),(15,7,'https://example.com/images/product7_img1.jpg'),(16,7,'https://example.com/images/product7_img2.jpg'),(17,8,'https://example.com/images/product8_img1.jpg'),(18,8,'https://example.com/images/product8_img2.jpg'),(19,9,'https://example.com/images/product9_img1.jpg'),(20,9,'https://example.com/images/product9_img2.jpg'),(21,9,'https://example.com/images/product9_img3.jpg'),(22,10,'https://example.com/images/product10_img1.jpg'),(23,10,'https://example.com/images/product10_img2.jpg'),(24,11,'https://example.com/images/product11_img1.jpg'),(25,11,'https://example.com/images/product11_img2.jpg'),(26,12,'https://example.com/images/product12_img1.jpg'),(27,12,'https://example.com/images/product12_img2.jpg'),(28,12,'https://example.com/images/product12_img3.jpg'),(29,13,'https://example.com/images/product13_img1.jpg'),(30,13,'https://example.com/images/product13_img2.jpg'),(31,14,'https://example.com/images/product14_img1.jpg'),(32,14,'https://example.com/images/product14_img2.jpg'),(33,15,'https://example.com/images/product15_img1.jpg'),(34,15,'https://example.com/images/product15_img2.jpg'),(35,15,'https://example.com/images/product15_img3.jpg'),(36,16,'https://example.com/images/product16_img1.jpg'),(37,16,'https://example.com/images/product16_img2.jpg'),(38,17,'https://example.com/images/product17_img1.jpg'),(39,17,'https://example.com/images/product17_img2.jpg'),(40,18,'https://example.com/images/product18_img1.jpg'),(41,18,'https://example.com/images/product18_img2.jpg'),(42,18,'https://example.com/images/product18_img3.jpg'),(43,19,'https://example.com/images/product19_img1.jpg'),(44,19,'https://example.com/images/product19_img2.jpg'),(45,20,'https://example.com/images/product20_img1.jpg'),(46,20,'https://example.com/images/product20_img2.jpg'),(47,21,'https://example.com/images/product21_img1.jpg'),(48,21,'https://example.com/images/product21_img2.jpg'),(49,21,'https://example.com/images/product21_img3.jpg'),(50,22,'https://example.com/images/product22_img1.jpg'),(51,22,'https://example.com/images/product22_img2.jpg'),(52,23,'https://example.com/images/product23_img1.jpg'),(53,23,'https://example.com/images/product23_img2.jpg'),(54,24,'https://example.com/images/product24_img1.jpg'),(55,24,'https://example.com/images/product24_img2.jpg'),(56,24,'https://example.com/images/product24_img3.jpg'),(57,25,'https://example.com/images/product25_img1.jpg'),(58,25,'https://example.com/images/product25_img2.jpg'),(59,26,'https://example.com/images/product26_img1.jpg'),(60,26,'https://example.com/images/product26_img2.jpg'),(61,27,'https://example.com/images/product27_img1.jpg'),(62,27,'https://example.com/images/product27_img2.jpg'),(63,27,'https://example.com/images/product27_img3.jpg'),(64,28,'https://example.com/images/product28_img1.jpg'),(65,28,'https://example.com/images/product28_img2.jpg'),(66,29,'https://example.com/images/product29_img1.jpg'),(67,29,'https://example.com/images/product29_img2.jpg'),(68,30,'https://example.com/images/product30_img1.jpg'),(69,30,'https://example.com/images/product30_img2.jpg'),(70,30,'https://example.com/images/product30_img3.jpg'),(71,31,'https://example.com/images/product31_img1.jpg'),(72,31,'https://example.com/images/product31_img2.jpg'),(73,32,'https://example.com/images/product32_img1.jpg'),(74,32,'https://example.com/images/product32_img2.jpg'),(75,33,'https://example.com/images/product33_img1.jpg'),(76,33,'https://example.com/images/product33_img2.jpg'),(77,33,'https://example.com/images/product33_img3.jpg'),(78,34,'https://example.com/images/product34_img1.jpg'),(79,34,'https://example.com/images/product34_img2.jpg'),(80,35,'https://example.com/images/product35_img1.jpg'),(81,35,'https://example.com/images/product35_img2.jpg'),(82,36,'https://example.com/images/product36_img1.jpg'),(83,36,'https://example.com/images/product36_img2.jpg'),(84,36,'https://example.com/images/product36_img3.jpg'),(85,37,'https://example.com/images/product37_img1.jpg'),(86,37,'https://example.com/images/product37_img2.jpg'),(87,38,'https://example.com/images/product38_img1.jpg'),(88,38,'https://example.com/images/product38_img2.jpg'),(89,39,'https://example.com/images/product39_img1.jpg'),(90,39,'https://example.com/images/product39_img2.jpg'),(91,39,'https://example.com/images/product39_img3.jpg'),(92,40,'https://example.com/images/product40_img1.jpg'),(93,40,'https://example.com/images/product40_img2.jpg');
/*!40000 ALTER TABLE `image_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES ('2024-09-01',100.5,10,1,1,1,'PAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-02',200.75,20,2,1,2,'UNPAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-03',150,15,3,2,3,'PAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-04',250.2,12,4,3,4,'UNPAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-05',300.1,18,5,4,5,'PAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-06',180,14,6,5,6,'UNPAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-07',220.75,22,7,6,7,'PAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-08',170.45,16,8,7,8,'PAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-09',260.9,20,9,8,9,'UNPAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-10',320.65,25,10,9,10,'CANCELED','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-11',190.3,12,11,1,11,'PAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-12',275.4,21,12,2,12,'UNPAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-13',130.55,10,13,3,13,'PAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-14',240.75,15,14,4,14,'CANCELED','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-15',310,24,15,5,15,'PAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-16',175.25,18,16,6,16,'UNPAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-17',230.6,20,17,7,17,'PAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-18',165.8,12,18,8,18,'UNPAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-19',285.9,22,19,9,19,'CANCELED','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-09-20',350,26,20,10,20,'PAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội'),('2024-10-28',261.72,NULL,21,1,1,'UNPAID','Vân Lũng, An Khánh, Hoài Đức, Hà Nội');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `order_detail`
--

LOCK TABLES `order_detail` WRITE;
/*!40000 ALTER TABLE `order_detail` DISABLE KEYS */;
INSERT INTO `order_detail` VALUES (2,1,1,1),(1,2,1,4),(3,3,1,8),(4,4,2,4),(2,5,2,19),(1,6,2,6),(5,7,3,15),(3,8,3,20),(2,9,3,9),(4,10,4,10),(1,11,4,22),(3,12,4,2),(2,13,5,3),(6,14,5,4),(4,15,5,31),(2,16,6,6),(1,17,6,36),(3,18,6,32),(5,19,7,9),(4,20,7,10),(2,21,8,1),(1,22,8,18),(3,23,9,39),(2,24,9,4),(6,25,10,5),(4,26,10,20),(3,27,11,30),(5,28,12,8),(2,29,13,9),(1,30,14,10),(3,31,15,1),(2,32,16,2),(1,33,17,3),(4,34,18,4),(5,35,19,5),(2,36,20,6);
/*!40000 ALTER TABLE `order_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `order_settings`
--

LOCK TABLES `order_settings` WRITE;
/*!40000 ALTER TABLE `order_settings` DISABLE KEYS */;
INSERT INTO `order_settings` VALUES (16,1,'2024-01-02 12:00:00.000000'),(16,2,'2024-01-03 13:00:00.000000'),(16,3,'2024-01-04 14:00:00.000000'),(16,4,'2024-01-05 15:00:00.000000'),(16,5,'2024-01-06 16:00:00.000000'),(16,6,'2024-01-07 17:00:00.000000'),(16,7,'2024-01-08 18:00:00.000000'),(16,8,'2024-01-09 19:00:00.000000'),(16,9,'2024-01-10 20:00:00.000000'),(16,10,'2024-01-11 21:00:00.000000'),(16,11,'2024-01-12 12:00:00.000000'),(16,12,'2024-01-13 13:00:00.000000'),(16,13,'2024-01-14 14:00:00.000000'),(16,14,'2024-01-15 15:00:00.000000'),(16,15,'2024-01-16 16:00:00.000000'),(16,16,'2024-01-17 17:00:00.000000'),(16,17,'2024-01-18 18:00:00.000000'),(16,18,'2024-01-19 19:00:00.000000'),(16,19,'2024-01-20 20:00:00.000000'),(16,20,'2024-01-21 21:00:00.000000'),(20,21,'2024-10-28 10:49:15.305653');
/*!40000 ALTER TABLE `order_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (10000,3,6,_binary '',2,1,1,'Xgear Product 1','Electronics item'),(11000,4,6,_binary '',3,2,1,'Xgear Product 2','Electronics item'),(12000,5,7,_binary '',4,3,2,'Tech World Product 1','Fashion item'),(13000,2,7,_binary '',2,4,2,'Tech World Product 2','Fashion item'),(14000,3,8,_binary '',5,5,3,'Fashion Hub Product 1','Groceries item'),(15000,4,8,_binary '',3,6,3,'Fashion Hub Product 2','Groceries item'),(16000,5,9,_binary '',6,7,4,'Style Avenue Product 1','Home & Kitchen item'),(17000,2,9,_binary '',2,8,4,'Style Avenue Product 2','Home & Kitchen item'),(18000,3,10,_binary '',7,9,5,'Fresh Market Product 1','Health & Beauty item'),(19000,4,10,_binary '',3,10,5,'Fresh Market Product 2','Health & Beauty item'),(20000,5,11,_binary '',4,11,6,'Green Grocers Product 1','Books & Stationery item'),(21000,2,11,_binary '',5,12,6,'Green Grocers Product 2','Books & Stationery item'),(22000,3,12,_binary '',6,13,7,'Home Essentials Product 1','Toys & Baby item'),(23000,4,12,_binary '',2,14,7,'Home Essentials Product 2','Toys & Baby item'),(24000,5,13,_binary '',7,15,8,'Kitchen World Product 1','Sports & Outdoors item'),(25000,2,13,_binary '',3,16,8,'Kitchen World Product 2','Sports & Outdoors item'),(26000,3,14,_binary '',8,17,9,'Beauty Bliss Product 1','Automotive item'),(27000,4,14,_binary '',2,18,9,'Beauty Bliss Product 2','Automotive item'),(28000,5,15,_binary '',9,19,10,'Health First Product 1','Pet Supplies item'),(29000,2,15,_binary '',3,20,10,'Health First Product 2','Pet Supplies item'),(30000,3,6,_binary '',4,21,11,'Book Haven Product 1','Electronics item'),(31000,4,6,_binary '',5,22,11,'Book Haven Product 2','Electronics item'),(32000,5,7,_binary '',2,23,12,'Stationery Stop Product 1','Fashion item'),(33000,2,7,_binary '',6,24,12,'Stationery Stop Product 2','Fashion item'),(34000,3,8,_binary '',3,25,13,'Toy Kingdom Product 1','Groceries item'),(35000,4,8,_binary '',7,26,13,'Toy Kingdom Product 2','Groceries item'),(36000,5,9,_binary '',2,27,14,'Baby World Product 1','Home & Kitchen item'),(37000,2,9,_binary '',8,28,14,'Baby World Product 2','Home & Kitchen item'),(38000,3,10,_binary '',4,29,15,'Sports Mania Product 1','Health & Beauty item'),(39000,4,10,_binary '',5,30,15,'Sports Mania Product 2','Health & Beauty item'),(40000,5,11,_binary '',2,31,16,'Outdoor Adventure Product 1','Books & Stationery item'),(41000,2,11,_binary '',3,32,16,'Outdoor Adventure Product 2','Books & Stationery item'),(42000,3,12,_binary '',7,33,17,'Auto Parts Co. Product 1','Toys & Baby item'),(43000,4,12,_binary '',2,34,17,'Auto Parts Co. Product 2','Toys & Baby item'),(44000,5,13,_binary '',8,35,18,'Car Zone Product 1','Sports & Outdoors item'),(45000,2,13,_binary '',3,36,18,'Car Zone Product 2','Sports & Outdoors item'),(46000,3,14,_binary '',5,37,19,'Pet Palace Product 1','Automotive item'),(47000,4,14,_binary '',2,38,19,'Pet Palace Product 2','Automotive item'),(48000,5,15,_binary '',6,39,20,'Furry Friends Product 1','Pet Supplies item'),(49000,2,15,_binary '',2,40,20,'Furry Friends Product 2','Pet Supplies item');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `setting`
--

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES (1,NULL,1,NULL,'ADMIN',NULL),(2,NULL,1,NULL,'STAFF',NULL),(3,NULL,1,NULL,'SELLER',NULL),(4,NULL,1,NULL,'SHOPSTAFF',NULL),(5,NULL,1,NULL,'USER',NULL),(6,NULL,2,NULL,'Electronics','10'),(7,NULL,2,NULL,'Fashion','10'),(8,NULL,2,NULL,'Groceries','5'),(9,NULL,2,NULL,'Home & Kitchen','10'),(10,NULL,2,NULL,'Health & Beauty','10'),(11,NULL,2,NULL,'Books & Stationery','5'),(12,NULL,2,NULL,'Toys & Baby Products','10'),(13,NULL,2,NULL,'Sports & Outdoors','10'),(14,NULL,2,NULL,'Automotive','15'),(15,NULL,2,NULL,'Pet Supplies','5'),(16,NULL,4,NULL,'Processed',NULL),(17,NULL,4,NULL,'Shipped',NULL),(18,NULL,4,NULL,'Out For Delivery',NULL),(19,NULL,4,NULL,'Delivered',NULL),(20,NULL,7,NULL,'Bills',NULL);
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `shop`
--

LOCK TABLES `shop` WRITE;
/*!40000 ALTER TABLE `shop` DISABLE KEYS */;
INSERT INTO `shop` VALUES (3,6,_binary '',NULL,1,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Xgear'),(5,6,_binary '',NULL,2,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Tech World'),(5,7,_binary '',NULL,3,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Fashion Hub'),(4,7,_binary '',NULL,4,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Style Avenue'),(5,8,_binary '',NULL,5,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Fresh Market'),(5,8,_binary '',NULL,6,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Green Grocers'),(3,9,_binary '',NULL,7,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Home Essentials'),(3,9,_binary '',NULL,8,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Kitchen World'),(3,10,_binary '',NULL,9,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Beauty Bliss'),(5,10,_binary '',NULL,10,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Health First'),(5,11,_binary '',NULL,11,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Book Haven'),(3,11,_binary '',NULL,12,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Stationery Stop'),(3,12,_binary '',NULL,13,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Toy Kingdom'),(4,12,_binary '',NULL,14,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Baby World'),(5,13,_binary '',NULL,15,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Sports Mania'),(4,13,_binary '',NULL,16,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Outdoor Adventures'),(5,14,_binary '',NULL,17,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Auto Parts Co.'),(3,14,_binary '',NULL,18,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Car Zone'),(4,15,_binary '',NULL,19,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Pet Palace'),(5,15,_binary '',NULL,20,NULL,'Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, Thạch Hòa, Thạch Thất, Hà Nội','2003888886868','970422','Furry Friends');
/*!40000 ALTER TABLE `shop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `types`
--

LOCK TABLES `types` WRITE;
/*!40000 ALTER TABLE `types` DISABLE KEYS */;
INSERT INTO `types` VALUES (1,'role'),(2,'category_shop'),(4,'shipping_status'),(6,'category_product'),(7,'order_type');
/*!40000 ALTER TABLE `types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (NULL,NULL,_binary '',1,NULL,1,NULL,NULL,NULL,'nguyenonghai2@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','hai123',NULL),(NULL,NULL,_binary '',3,NULL,2,NULL,NULL,NULL,'user1@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_1',NULL),(NULL,NULL,_binary '',3,NULL,3,NULL,NULL,NULL,'user2@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_2',NULL),(NULL,NULL,_binary '',3,NULL,4,NULL,NULL,NULL,'user3@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_3',NULL),(NULL,NULL,_binary '',3,NULL,5,NULL,NULL,NULL,'user4@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_4',NULL),(NULL,NULL,_binary '',3,NULL,6,NULL,NULL,NULL,'user5@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_5',NULL),(NULL,NULL,_binary '',3,NULL,7,NULL,NULL,NULL,'user6@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_6',NULL),(NULL,NULL,_binary '',3,NULL,8,NULL,NULL,NULL,'user7@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_7',NULL),(NULL,NULL,_binary '',3,NULL,9,NULL,NULL,NULL,'user8@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_8',NULL),(NULL,NULL,_binary '',3,NULL,10,NULL,NULL,NULL,'user9@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_9',NULL),(NULL,NULL,_binary '',3,NULL,11,NULL,NULL,NULL,'user10@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_10',NULL),(NULL,NULL,_binary '',3,NULL,12,NULL,NULL,NULL,'user50@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_50',NULL),(NULL,NULL,_binary '',3,NULL,13,NULL,NULL,NULL,'user51@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_51',NULL),(NULL,NULL,_binary '\0',5,NULL,14,NULL,NULL,NULL,'user52@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_52',NULL),(NULL,NULL,_binary '',1,NULL,15,NULL,NULL,NULL,'user53@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_53',NULL),(NULL,NULL,_binary '\0',4,NULL,16,NULL,NULL,NULL,'user54@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_54',NULL),(NULL,NULL,_binary '',2,NULL,17,NULL,NULL,NULL,'user55@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_55',NULL),(NULL,NULL,_binary '\0',1,NULL,18,NULL,NULL,NULL,'user56@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_56',NULL),(NULL,NULL,_binary '',5,NULL,19,NULL,NULL,NULL,'user57@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_57',NULL),(NULL,NULL,_binary '\0',3,NULL,20,NULL,NULL,NULL,'user58@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_58',NULL),(NULL,NULL,_binary '',2,NULL,21,NULL,NULL,NULL,'user59@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_59',NULL),(NULL,NULL,_binary '\0',4,NULL,22,NULL,NULL,NULL,'user60@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_60',NULL),(NULL,NULL,_binary '',5,NULL,23,NULL,NULL,NULL,'user61@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_61',NULL),(NULL,NULL,_binary '\0',3,NULL,24,NULL,NULL,NULL,'user62@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_62',NULL),(NULL,NULL,_binary '',1,NULL,25,NULL,NULL,NULL,'user63@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_63',NULL),(NULL,NULL,_binary '\0',4,NULL,26,NULL,NULL,NULL,'user64@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_64',NULL),(NULL,NULL,_binary '',2,NULL,27,NULL,NULL,NULL,'user65@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_65',NULL),(NULL,NULL,_binary '\0',1,NULL,28,NULL,NULL,NULL,'user66@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_66',NULL),(NULL,NULL,_binary '',5,NULL,29,NULL,NULL,NULL,'user67@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_67',NULL),(NULL,NULL,_binary '\0',2,NULL,30,NULL,NULL,NULL,'user68@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_68',NULL),(NULL,NULL,_binary '',4,NULL,31,NULL,NULL,NULL,'user69@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_69',NULL),(NULL,NULL,_binary '\0',3,NULL,32,NULL,NULL,NULL,'user70@gmail.com',NULL,NULL,'$2a$12$j7ZtMudToVPEycqrOMf.Z.KG.H.uj.KfcHs6zFbZcBcIbt/QrZrBy','0973307761','user_70',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_shop`
--

LOCK TABLES `user_shop` WRITE;
/*!40000 ALTER TABLE `user_shop` DISABLE KEYS */;
INSERT INTO `user_shop` VALUES (1,1),(3,3),(4,4),(5,5),(6,6),(7,7),(8,8),(9,9),(10,10),(11,11),(12,12),(13,1),(14,2),(15,3),(16,4),(17,5),(18,6),(19,7),(20,8);
/*!40000 ALTER TABLE `user_shop` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-28 11:33:24
