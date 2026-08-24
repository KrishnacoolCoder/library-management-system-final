"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const zod_1 = require("zod");
const schema = zod_1.z.object({ isbn: zod_1.z.string().min(5).max(20), title: zod_1.z.string().min(1).max(200), author: zod_1.z.string().min(1).max(150), category: zod_1.z.string().min(1).max(100), totalCopies: zod_1.z.number().int().min(1), publishedYear: zod_1.z.number().int().min(1000).max(2100).optional() });
class BookController {
    service;
    constructor(service) {
        this.service = service;
    }
    list = async (req, res) => { const page = Math.max(1, Number(req.query.page || 1)); const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20))); res.json(await this.service.list(String(req.query.q || ""), page, limit, String(req.query.sort || "title"))); };
    get = async (req, res) => { const b = await this.service.get(Number(req.params.id)); if (!b)
        return res.status(404).json({ error: "Book not found." }); res.json(b); };
    create = async (req, res) => { const b = schema.parse(req.body); const id = await this.service.create(b, req.user.id); res.status(201).json({ id, message: "Book created." }); };
    update = async (req, res) => { const b = schema.parse(req.body); await this.service.update(Number(req.params.id), b, req.user.id); res.json({ message: "Book updated." }); };
    delete = async (req, res) => { await this.service.delete(Number(req.params.id), req.user.id); res.json({ message: "Book deleted." }); };
}
exports.BookController = BookController;
