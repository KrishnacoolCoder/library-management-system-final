"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loan = void 0;
class Loan {
    id;
    userId;
    bookId;
    borrowedAt;
    dueAt;
    status;
    constructor(id, userId, bookId, borrowedAt, dueAt, status) {
        this.id = id;
        this.userId = userId;
        this.bookId = bookId;
        this.borrowedAt = borrowedAt;
        this.dueAt = dueAt;
        this.status = status;
    }
    isOverdue(now = new Date()) {
        return this.status === "BORROWED" && now.getTime() > this.dueAt.getTime();
    }
    calculateFine(now = new Date(), dailyRate = 10) {
        if (!this.isOverdue(now))
            return 0;
        const days = Math.ceil((now.getTime() - this.dueAt.getTime()) / 86400000);
        return days * dailyRate;
    }
}
exports.Loan = Loan;
