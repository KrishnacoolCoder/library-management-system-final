"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BookService_1 = require("../src/services/BookService");
describe("BookService", () => {
    test("rejects invalid copy count", async () => {
        const books = { create: jest.fn(), findById: jest.fn() };
        const audit = { log: jest.fn() };
        const service = new BookService_1.BookService(books, audit);
        await expect(service.create({ totalCopies: 0 }, 1)).rejects.toThrow("INVALID_COPY_COUNT");
        expect(books.create).not.toHaveBeenCalled();
    });
    test("creates and audits book", async () => {
        const books = { create: jest.fn().mockResolvedValue(7) };
        const audit = { log: jest.fn() };
        const service = new BookService_1.BookService(books, audit);
        const id = await service.create({ totalCopies: 2, title: "X" }, 4);
        expect(id).toBe(7);
        expect(audit.log).toHaveBeenCalledWith(4, "CREATE", "BOOK", 7, { title: "X" });
    });
});
