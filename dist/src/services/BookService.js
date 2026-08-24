"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
class BookService {
    books;
    audit;
    constructor(books, audit) {
        this.books = books;
        this.audit = audit;
    }
    list(query, page, limit, sort) {
        return this.books.search(query, page, limit, sort);
    }
    get(id) { return this.books.findById(id); }
    async create(data, userId) {
        if (data.totalCopies < 1)
            throw new Error("INVALID_COPY_COUNT");
        const id = await this.books.create(data);
        await this.audit.log(userId, "CREATE", "BOOK", id, { title: data.title });
        return id;
    }
    async update(id, data, userId) {
        const existing = await this.books.findById(id);
        if (!existing)
            throw new Error("BOOK_NOT_FOUND");
        if (data.totalCopies < existing.total_copies - existing.available_copies)
            throw new Error("COPIES_BELOW_BORROWED");
        await this.books.update(id, { ...data, previousTotalCopies: existing.total_copies });
        await this.audit.log(userId, "UPDATE", "BOOK", id);
    }
    async delete(id, userId) {
        const existing = await this.books.findById(id);
        if (!existing)
            throw new Error("BOOK_NOT_FOUND");
        if (existing.available_copies !== existing.total_copies)
            throw new Error("BOOK_HAS_ACTIVE_LOANS");
        await this.books.delete(id);
        await this.audit.log(userId, "DELETE", "BOOK", id, { title: existing.title });
    }
}
exports.BookService = BookService;
