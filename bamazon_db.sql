USE bamazon_db;

CREATE TABLE Products(
 ItemID INTEGER AUTO_INCREMENT PRIMARY KEY,
 ProductName VARCHAR(100),
 DepartmentName VARCHAR(100),
 Price DOUBLE(10,2),
 StockQuantity INTEGER);

SELECT * FROM bamazonproducts.csv;