
CREATE DATABASE IF NOT EXISTS demo;


\c demo;

CREATE TABLE IF NOT EXISTS`Products` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  `slogan` VARCHAR(1000) NOT NULL,
  `description` VARCHAR(300) NOT NULL,
  `default_price` INTEGER NOT NULL,
  `category` VARCHAR(80) NOT NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS`Product Features` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `product id(foreign key)` INTEGER NOT NULL,
  `feature` VARCHAR(60) NOT NULL,
  `value` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS`Product Styles` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `product id(foreign key)` INTEGER NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `original price` INTEGER  DEFAULT NULL,
  `sale price` INTEGER  DEFAULT NULL,
  `default?` int DEFAULT 0,
  PRIMARY KEY (`id`)
);



CREATE TABLE IF NOT EXISTS`Product Style SKU-Size` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `style id` INTEGER NOT NULL,
  `quantity` INTEGER NOT NULL,
  `size` VARCHAR(8) NOT NULL,
  PRIMARY KEY (`id`)
);



CREATE TABLE IF NOT EXISTS`related` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `current_product` INTEGER NOT NULL,
  `compared_product` INTEGER NOT NULL,
  `productID` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `photos` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `styleID` INTEGER NOT NULL,
  `thumbnail` VARCHAR(10000) NOT NULL,
  `url` VARCHAR(10000) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS`cart` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `user_session` INTEGER NOT NULL,
  `product_id` INTEGER NOT NULL,
  `active` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
);


ALTER TABLE `Product Features` ADD FOREIGN KEY (product id(foreign key)) REFERENCES `Products` (`id`);
ALTER TABLE `Product Styles` ADD FOREIGN KEY (product id(foreign key)) REFERENCES `Products` (`id`);
ALTER TABLE `Product Style SKU-Size` ADD FOREIGN KEY (style id) REFERENCES `Product Styles` (`id`);
ALTER TABLE `related` ADD FOREIGN KEY (current_product) REFERENCES `Products` (`id`);
ALTER TABLE `photos` ADD FOREIGN KEY (styleID) REFERENCES `Product Styles` (`id`);
ALTER TABLE `cart` ADD FOREIGN KEY (product_id) REFERENCES `Products` (`id`);

COPY features FROM '/Users/air/Desktop/data/features.csv' DELIMITER ',' CSV HEADER;
COPY styles FROM '/Users/air/Desktop/data/styles.csv' DELIMITER ',' CSV HEADER;
COPY cart FROM '/Users/air/Desktop/data/cart.csv' DELIMITER ',' CSV HEADER;
COPY product FROM '/Users/air/Desktop/data/product.csv' DELIMITER ',' CSV HEADER;
COPY related FROM '/Users/air/Desktop/data/related.csv' DELIMITER ',' CSV HEADER;
COPY photos FROM '/Users/air/Desktop/data/photos.csv' DELIMITER ',' CSV HEADER;