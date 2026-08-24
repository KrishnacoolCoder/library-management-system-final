"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../config/database");
class UserRepository {
    async findByEmail(email) {
        const [rows] = await database_1.Database.getPool().query("SELECT * FROM users WHERE email=? LIMIT 1", [email]);
        return rows[0] || null;
    }
    async findById(id) {
        const [rows] = await database_1.Database.getPool().query("SELECT * FROM users WHERE id=? LIMIT 1", [id]);
        return rows[0] || null;
    }
    async create(name, email, passwordHash) {
        const [result] = await database_1.Database.getPool().execute("INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,'STUDENT')", [name, email, passwordHash]);
        return result.insertId;
    }
    async markVerified(email) {
        await database_1.Database.getPool().execute("UPDATE users SET is_verified=TRUE WHERE email=?", [email]);
    }
    async list() {
        const [rows] = await database_1.Database.getPool().query("SELECT id,name,email,role,is_verified,is_active,created_at FROM users ORDER BY created_at DESC");
        return rows;
    }
    async setActive(id, active) {
        await database_1.Database.getPool().execute("UPDATE users SET is_active=? WHERE id=?", [active, id]);
    }
}
exports.UserRepository = UserRepository;
