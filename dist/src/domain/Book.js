"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
class Book {
    id;
    isbn;
    title;
    author;
    category;
    totalCopies;
    availableCopies;
    publishedYear;
    constructor(id, isbn, title, author, category, totalCopies, availableCopies, publishedYear) {
        this.id = id;
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.category = category;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
        this.publishedYear = publishedYear;
    }
    isAvailable() {
        return this.availableCopies > 0;
    }
}
exports.Book = Book;
