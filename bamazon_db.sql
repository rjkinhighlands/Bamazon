CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE Products(
 ItemID INTEGER AUTO_INCREMENT PRIMARY KEY,
 ProductName VARCHAR(100) NOT NULL,
 DepartmentName VARCHAR(100) NOT NULL,
 Price DECIMAL(10,2) NOT NULL,
 StockQuantity INTEGER(10) NOT NULL,
 primary key(ItemID)
 );

SELECT * FROM bamazonproducts.csv;