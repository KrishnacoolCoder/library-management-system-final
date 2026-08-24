"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    const known = {
        EMAIL_ALREADY_REGISTERED: [409, "Email is already registered."],
        INVALID_OR_EXPIRED_OTP: [400, "Invalid or expired OTP."],
        INVALID_CREDENTIALS: [401, "Invalid email or password."],
        ACCOUNT_DISABLED: [403, "Account is disabled."],
        EMAIL_NOT_VERIFIED: [403, "Please verify your email first."],
        USER_NOT_FOUND: [404, "User not found."],
        BOOK_NOT_FOUND: [404, "Book not found."],
        BOOK_UNAVAILABLE: [409, "Book is currently unavailable."],
        BORROW_LIMIT_REACHED: [409, "Borrowing limit reached."],
        ALREADY_BORROWED: [409, "You already have this book."],
        INVALID_COPY_COUNT: [400, "Copy count must be at least 1."],
        COPIES_BELOW_BORROWED: [400, "Total copies cannot be lower than currently borrowed copies."],
        BOOK_HAS_ACTIVE_LOANS: [409, "Book has active loans and cannot be deleted."],
        LOAN_NOT_FOUND: [404, "Loan not found."],
        ALREADY_RETURNED: [409, "Loan has already been returned."],
        FORBIDDEN: [403, "You cannot modify this loan."]
    };
    const [status, message] = known[err?.message] || [500, "Internal server error."];
    if (status === 500)
        console.error(err);
    res.status(status).json({ error: message });
}
