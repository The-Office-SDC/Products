
CREATE DATABASE IF NOT EXISTS demo;


\c demo;

CREATE TABLE product(
  id serial PRIMARY KEY not null,
  name varchar(50) not null,
  slogan varchar(200) not null,
  description varchar(500) not null,
  category varchar(20) not null,
  default_price int not null
);


CREATE TABLE IF NOT EXISTS`Product Features` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `product id(foreign key)` INTEGER NOT NULL,
  `feature` VARCHAR(60) NOT NULL,
  `value` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS styles(
  id serial PRIMARY KEY not null,
  productId int not null,
  name varchar(50) not null,
  sale_price varchar(10) not null,
  original_price int not null,
  default_style int not null
);


CREATE TABLE IF NOT EXISTS`Product Style SKU-Size` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `style id` INTEGER NOT NULL,
  `quantity` INTEGER NOT NULL,
  `size` VARCHAR(8) NOT NULL,
  PRIMARY KEY (`id`)
);



CREATE TABLE related(
  id varchar(10),
  current_product_id varchar(10),
  related_product_id varchar(10)
);


CREATE TABLE photos(
  id serial PRIMARY KEY not null,
  styleid int not null,
  thumbnail_url varchar(100000) not null,
  url varchar(100000) not null
);

CREATE TABLE IF NOT EXISTS cart(
  id serial PRIMARY KEY not null,
  user_session int not null,
  product_id int not null,
  active int not null
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