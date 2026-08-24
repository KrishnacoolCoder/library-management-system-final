"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditRepository = void 0;
const database_1 = require("../config/database");
class AuditRepository {
    async log(userId, action, entity, entityId, metadata, ip) {
        await database_1.Database.getPool().execute(`INSERT INTO audit_logs (user_id,action,entity,entity_id,metadata,ip_address)
       VALUES (?,?,?,?,?,?)`, [userId, action, entity, entityId == null ? null : String(entityId),
            metadata ? JSON.stringify(metadata) : null, ip || null]);
    }
    async list(limit = 100) {
        const [rows] = await database_1.Database.getPool().query(`SELECT a.*,u.name AS user_name,u.email
       FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id
       ORDER BY a.created_at DESC LIMIT ?`, [limit]);
        return rows;
    }
}
exports.AuditRepository = AuditRepository;
