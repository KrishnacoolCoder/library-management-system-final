"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function main() {
    const db = await promise_1.default.createConnection({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD });
    const sql = fs_1.default.readFileSync(path_1.default.join(process.cwd(), "database/schema.sql"), "utf8");
    for (const statement of sql.split(";").map(s => s.trim()).filter(Boolean))
        await db.query(statement);
    await db.end();
    console.log("Database initialized.");
}
main().catch(e => { console.error(e); process.exit(1); });
