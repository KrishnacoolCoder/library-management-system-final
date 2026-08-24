import { Database } from "../config/database";
import { Role } from "../domain/User";

export class UserRepository {
  async findByEmail(email: string): Promise<any | null> {
    const [rows] = await Database.getPool().query("SELECT * FROM users WHERE email=? LIMIT 1", [email]);
    return (rows as any[])[0] || null;
  }

  async findById(id: number): Promise<any | null> {
    const [rows] = await Database.getPool().query("SELECT * FROM users WHERE id=? LIMIT 1", [id]);
    return (rows as any[])[0] || null;
  }

  async create(name: string, email: string, passwordHash: string) {
    const [result] = await Database.getPool().execute(
      "INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,'STUDENT')",
      [name, email, passwordHash]
    );
    return (result as any).insertId;
  }

  async markVerified(email: string) {
    await Database.getPool().execute("UPDATE users SET is_verified=TRUE WHERE email=?", [email]);
  }

  async list() {
    const [rows] = await Database.getPool().query(
      "SELECT id,name,email,role,is_verified,is_active,created_at FROM users ORDER BY created_at DESC"
    );
    return rows as any[];
  }

  async setActive(id: number, active: boolean) {
    await Database.getPool().execute("UPDATE users SET is_active=? WHERE id=?", [active, id]);
  }
}
