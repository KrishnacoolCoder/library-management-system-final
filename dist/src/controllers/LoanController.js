"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanController = void 0;
const zod_1 = require("zod");
const schema = zod_1.z.object({ bookId: zod_1.z.number().int().positive() });
class LoanController {
    service;
    constructor(service) {
        this.service = service;
    }
    borrow = async (req, res) => { const b = schema.parse(req.body); res.status(201).json(await this.service.borrow(req.user.id, b.bookId, req.ip)); };
    returnBook = async (req, res) => res.json(await this.service.returnBook(req.user.id, Number(req.params.id), req.ip));
    mine = async (req, res) => res.json(await this.service.myLoans(req.user.id));
    all = async (_req, res) => res.json(await this.service.allLoans());
}
exports.LoanController = LoanController;
