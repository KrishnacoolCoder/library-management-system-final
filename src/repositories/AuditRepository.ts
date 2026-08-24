import { Database } from "../config/database";

export class AuditRepository {
  async log(userId: number | null, action: string, entity: string, entityId?: string | number, metadata?: any, ip?: string) {
    await Database.getPool().execute(
      `INSERT INTO audit_logs (user_id,action,entity,entity_id,metadata,ip_address)
       VALUES (?,?,?,?,?,?)`,
      [userId, action, entity, entityId == null ? null : String(entityId),
       metadata ? JSON.stringify(metadata) : null, ip || null]
    );
  }

  async list(limit = 100) {
    const [rows] = await Database.getPool().query(
      `SELECT a.*,u.name AS user_name,u.email
       FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id
       ORDER BY a.created_at DESC LIMIT ?`, [limit]
    );
    return rows as any[];
  }
}
