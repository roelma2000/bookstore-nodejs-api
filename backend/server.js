import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();
import books from "./data/books.js";

const app = express();

// Add this line to parse JSON request bodies
app.use(express.json());

const port = process.env.PORT || 8082;

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
});

//if  there is a auth problem, check the .env file or run the following command in mysql
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'

app.get('/', (req, res) => {
    res.send('Api is running...');
    });

app.get('/api/books', (req, res) => {
    const sql = 'SELECT * FROM books';
    db.query(sql, (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json(data);
    });   
});

app.post('/api/books', (req, res) => {
    const { title, author, isbn, categoryid, description, price, stockQuantity, publisher, publishedDate, coverImageUrl } = req.body;
    const sql = `INSERT INTO books (title, author, isbn, categoryid, description, price, stockQuantity, publisher, 
                 publishedDate, coverImageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [title, author, isbn, categoryid, description, price, stockQuantity, publisher, publishedDate, coverImageUrl], (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json("New book added successfully");
    });   
});

app.get('/api/books/:id', (req, res) => {
    const bookId = req.params.id;
    const sql = "SELECT * FROM books WHERE id = ?";

    db.query(sql, [bookId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.json(data[0]);
    });
});
    

app.put('/api/books', (req, res) => {
    const { id, title, author, isbn, categoryid, description, price, stockQuantity, publisher, publishedDate, coverImageUrl } = req.body;
    if (!id){
        return res.json({ error: "id is required" });
    } 
    const sqlId = "SELECT * FROM books WHERE id = ?";
    db.query(sqlId, [id], (err, data) => {
        if (err) return res.json({ error: err.message });
        if (data.length === 0) {
            return res.json({ error: `Book ${id} not found` });
        }
    });
    const sql = `UPDATE books SET title = ?, author = ?, isbn = ?, categoryid = ?, description = ?, price = ?, 
                                  stockQuantity = ?, publisher = ?, publishedDate = ?, coverImageUrl = ? WHERE id = ?`;
    
    db.query(sql, [title, author, isbn, categoryid, description, price, stockQuantity, publisher, publishedDate, coverImageUrl, id], (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json(`Book ${id} updated successfully`);
    });   
});

app.patch('/api/books', (req, res) => {
    const { id, title, author, isbn, categoryid, description, price, stockQuantity, publisher, publishedDate, coverImageUrl } = req.body;
    if (!id){
        return res.json({ error: "id is required" });
    } 
    const sqlId = "SELECT * FROM books WHERE id = ?";
    db.query(sqlId, [id], (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result.length === 0) {
            return res.json({ error: `Book ${id} not found` });
        }

        const bookdata = result[0];
        const title = req.body.title || bookdata.title;
        const author = req.body.author || bookdata.author;
        const isbn = req.body.isbn || bookdata.isbn;
        const categoryid = req.body.categoryid || bookdata.categoryid;
        const description = req.body.description || bookdata.description;
        const price = req.body.price || bookdata.price;
        const stockQuantity = req.body.stockQuantity || bookdata.stockQuantity;
        const publisher = req.body.publisher || bookdata.publisher;
        const publishedDate = req.body.publishedDate || bookdata.publishedDate;
        const coverImageUrl = req.body.coverImageUrl || bookdata.coverImageUrl;

        const sql = `UPDATE books SET title = ?, author = ?, isbn = ?, categoryid = ?, description = ?, price = ?, 
                                  stockQuantity = ?, publisher = ?, publishedDate = ?, coverImageUrl = ? WHERE id = ?`;
  
    db.query(sql, [title, author, isbn, categoryid, description, price, stockQuantity, publisher, publishedDate, coverImageUrl, id], (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json(`Book ${id} updated successfully`);
        });
        

    });

});

app.delete('/api/books/:id', (req, res) => {
    const bookId = req.params.id;
    const sql = "SELECT * FROM books WHERE id = ?";

    db.query(sql, [bookId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        const sqlDel = "DELETE FROM books WHERE id = ?";
        db.query(sqlDel, [bookId], (deleteErr) => {
            if (deleteErr) {
                return res.status(500).json({ error: deleteErr.message });
            }
            return res.json({ message: `Book ${bookId} deleted successfully` });
        });
    });
});

app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });