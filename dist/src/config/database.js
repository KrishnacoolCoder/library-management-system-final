"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Database {
    static pool;
    static getPool() {
        if (!Database.pool) {
            Database.pool = promise_1.default.createPool({
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT || 3306),
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME || "library_manager",
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
        }
        return Database.pool;
    }
    static async transaction(work) {
        const connection = await Database.getPool().getConnection();
        try {
            await connection.beginTransaction();
            const result = await work(connection);
            await connection.commit();
            return result;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
}
exports.Database = Database;
