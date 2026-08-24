"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRepository = void 0;
const database_1 = require("../config/database");
class BookRepository {
    async search(query = "", page = 1, limit = 20, sort = "title") {
        const allowedSorts = {
            title: "title", author: "author", category: "category", newest: "created_at"
        };
        const sortColumn = allowedSorts[sort] || "title";
        const offset = (page - 1) * limit;
        const q = `%${query}%`;
        const [rows] = await database_1.Database.getPool().query(`SELECT * FROM books
       WHERE title LIKE ? OR author LIKE ? OR category LIKE ? OR isbn LIKE ?
       ORDER BY ${sortColumn} LIMIT ? OFFSET ?`, [q, q, q, q, limit, offset]);
        const [countRows] = await database_1.Database.getPool().query(`SELECT COUNT(*) AS total FROM books
       WHERE title LIKE ? OR author LIKE ? OR category LIKE ? OR isbn LIKE ?`, [q, q, q, q]);
        return { data: rows, page, limit, total: Number(countRows[0].total) };
    }
    async findById(id, connection, lock = false) {
        const executor = connection || database_1.Database.getPool();
        const [rows] = await executor.query(`SELECT * FROM books WHERE id=? LIMIT 1${lock ? " FOR UPDATE" : ""}`, [id]);
        return rows[0] || null;
    }
    async create(data) {
        const [result] = await database_1.Database.getPool().execute(`INSERT INTO books (isbn,title,author,category,total_copies,available_copies,published_year)
       VALUES (?,?,?,?,?,?,?)`, [data.isbn, data.title, data.author, data.category, data.totalCopies, data.totalCopies, data.publishedYear || null]);
        return result.insertId;
    }
    async update(id, data) {
        await database_1.Database.getPool().execute(`UPDATE books
       SET isbn=?,title=?,author=?,category=?,
           total_copies=?,available_copies=available_copies + (? - ?),published_year=?
       WHERE id=?`, [data.isbn, data.title, data.author, data.category,
            data.totalCopies, data.totalCopies, data.previousTotalCopies, data.publishedYear || null, id]);
    }
    async delete(id) {
        await database_1.Database.getPool().execute("DELETE FROM books WHERE id=?", [id]);
    }
}
exports.BookRepository = BookRepository;
