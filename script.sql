CREATE DATABASE IF NOT EXISTS visitcards;
USE visitcards;
DROP TABLE IF EXISTS `cartes_visite`;
CREATE TABLE `cartes_visite` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255),
    entreprise VARCHAR(255),
    profession VARCHAR(255),
    email VARCHAR(255),
    telephone VARCHAR(20)
);