import mysql, { Pool, PoolConnection } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export class Database {
  private static pool: Pool;

  static getPool(): Pool {
    if (!Database.pool) {
      Database.pool = mysql.createPool({
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

  static async transaction<T>(work: (connection: PoolConnection) => Promise<T>): Promise<T> {
    const connection = await Database.getPool().getConnection();
    try {
      await connection.beginTransaction();
      const result = await work(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
