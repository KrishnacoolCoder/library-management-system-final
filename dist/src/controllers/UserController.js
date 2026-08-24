"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const zod_1 = require("zod");
class UserController {
    users;
    audit;
    constructor(users, audit) {
        this.users = users;
        this.audit = audit;
    }
    list = async (_req, res) => res.json(await this.users.list());
    setStatus = async (req, res) => { const b = zod_1.z.object({ active: zod_1.z.boolean() }).parse(req.body); const id = Number(req.params.id); await this.users.setActive(id, b.active); await this.audit.log(req.user.id, "UPDATE_STATUS", "USER", id, b); res.json({ message: "User status updated." }); };
    audits = async (req, res) => res.json(await this.audit.list(Math.min(500, Math.max(1, Number(req.query.limit || 100)))));
}
exports.UserController = UserController;
