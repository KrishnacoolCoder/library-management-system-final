"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanRepository = void 0;
const database_1 = require("../config/database");
class LoanRepository {
    async countActiveByUser(userId, connection) {
        const [rows] = await connection.query("SELECT COUNT(*) AS count FROM loans WHERE user_id=? AND status='BORROWED'", [userId]);
        return Number(rows[0].count);
    }
    async findActive(userId, bookId, connection) {
        const [rows] = await connection.query("SELECT * FROM loans WHERE user_id=? AND book_id=? AND status='BORROWED' LIMIT 1", [userId, bookId]);
        return rows[0] || null;
    }
    async create(userId, bookId, dueAt, connection) {
        const [result] = await connection.execute("INSERT INTO loans (user_id,book_id,due_at) VALUES (?,?,?)", [userId, bookId, dueAt]);
        return result.insertId;
    }
    async findById(id) {
        const [rows] = await database_1.Database.getPool().query(`SELECT l.*,u.name AS user_name,u.email,b.title,b.isbn
       FROM loans l JOIN users u ON u.id=l.user_id JOIN books b ON b.id=l.book_id
       WHERE l.id=? LIMIT 1`, [id]);
        return rows[0] || null;
    }
    async returnLoan(id, fine, connection) {
        await connection.execute("UPDATE loans SET returned_at=NOW(),fine=?,status='RETURNED' WHERE id=? AND status='BORROWED'", [fine, id]);
    }
    async listByUser(userId) {
        const [rows] = await database_1.Database.getPool().query(`SELECT l.*,b.title,b.isbn FROM loans l JOIN books b ON b.id=l.book_id
       WHERE l.user_id=? ORDER BY l.borrowed_at DESC`, [userId]);
        return rows;
    }
    async listAll() {
        const [rows] = await database_1.Database.getPool().query(`SELECT l.*,u.name AS user_name,u.email,b.title,b.isbn
       FROM loans l JOIN users u ON u.id=l.user_id JOIN books b ON b.id=l.book_id
       ORDER BY l.borrowed_at DESC`);
        return rows;
    }
}
exports.LoanRepository = LoanRepository;
