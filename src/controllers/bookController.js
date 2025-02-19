const db = require('../config/firebase');

class BookController {
    static async createBook(req, res) {
        try {
            const { title, author, isbn, price, quantity } = req.body;
            const book = {
                title,
                author,
                isbn,
                price,
                quantity,
                createdAt: new Date()
            };

            const docRef = await db.collection('books').add(book);
            res.status(201).json({ id: docRef.id, ...book });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllBooks(req, res) {
        try {
            const booksSnapshot = await db.collection('books').get();
            const books = [];
            booksSnapshot.forEach(doc => {
                books.push({ id: doc.id, ...doc.data() });
            });
            res.json(books);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getBookById(req, res) {
        try {
            const doc = await db.collection('books').doc(req.params.id).get();
            if (!doc.exists) {
                return res.status(404).json({ error: 'Book not found' });
            }
            res.json({ id: doc.id, ...doc.data() });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateBook(req, res) {
        try {
            const { title, author, isbn, price, quantity } = req.body;
            await db.collection('books').doc(req.params.id).update({
                title,
                author,
                isbn,
                price,
                quantity,
                updatedAt: new Date()
            });
            res.json({ message: 'Book updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteBook(req, res) {
        try {
            await db.collection('books').doc(req.params.id).delete();
            res.json({ message: 'Book deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = BookController;