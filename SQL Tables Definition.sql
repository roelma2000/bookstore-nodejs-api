create database bookstore;
use bookstore;
create table books (
	id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(30) NOT NULL,
    categoryid int,
    description TEXT,
    price DOUBLE DEFAULT 0.0,
    stockQuantity INT DEFAULT 0,
    publisher VARCHAR(255) NOT NULL,
    publishedDate DATE DEFAULT '1900-01-01',
    coverImageUrl VARCHAR(255),
    PRIMARY KEY (id)
);

create table categories (
id INT AUTO_INCREMENT NOT NULL,
categoryname VARCHAR(255) NOT NULL,
PRIMARY KEY (id)
);

ALTER TABLE books
ADD FOREIGN KEY (categoryid) REFERENCES categories(id);

--  you need to create the table that is being referenced by a foreign key before creating the table that contains the foreign key.
CREATE TABLE address (
    id INT AUTO_INCREMENT NOT NULL,
    address1 VARCHAR(255) NOT NULL,
    address2 VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    addressId INT,
    phoneNumber VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (addressId) REFERENCES address(id)
);
-- many-to-many relationship between books and orders
-- This table will hold information about each order:
CREATE TABLE orders (
    id INT AUTO_INCREMENT NOT NULL,
    userid INT NOT NULL,
    totalPrice DOUBLE NOT NULL,
    orderDate DATE NOT NULL,
    shippingAddress VARCHAR(255) NOT NULL,
    orderStatus VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (userid) REFERENCES users(id)
);

-- This table links orders to the books that are part of each order:
CREATE TABLE orderedbooks (
    orderid INT NOT NULL,
    bookid INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (orderid, bookid),
    FOREIGN KEY (orderid) REFERENCES orders(id),
    FOREIGN KEY (bookid) REFERENCES books(id)
);

-- insert categories
INSERT INTO categories (categoryname) VALUES 
('Fiction'),
('Non-Fiction'),
('Science Fiction'),
('Biography'),
('Mystery'),
('Fantasy');

SELECT * FROM categories WHERE categoryname = 'Fiction';

INSERT INTO books 
(title, author, isbn, categoryid, description, price, stockQuantity, publisher, publishedDate, coverImageUrl) 
VALUES 
('The Kite Runner', 'Khaled Hosseini', '9780385699426', 1, 'A powerful story of friendship, it is also about the power of reading, the price of 
betrayal and the possibility of redemption; and an exploration of the influence of fathers over sons—their love, their sacrifices, their lies', 39.99, 6, 
'Berkley', '2021-09-17', '/images/kite-runner.jpg');

SELECT * FROM books;
SELECT * FROM categories;