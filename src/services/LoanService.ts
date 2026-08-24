import { Database } from "../config/database";
import { createUserDomainObject, Role } from "../domain/User";
import { Book } from "../domain/Book";
import { Loan } from "../domain/Loan";
import { BookRepository } from "../repositories/BookRepository";
import { LoanRepository } from "../repositories/LoanRepository";
import { UserRepository } from "../repositories/UserRepository";
import { AuditRepository } from "../repositories/AuditRepository";

export class LoanService {
  constructor(
    private readonly users: UserRepository,
    private readonly books: BookRepository,
    private readonly loans: LoanRepository,
    private readonly audit: AuditRepository
  ) {}

  async borrow(userId: number, bookId: number, ip?: string) {
    return Database.transaction(async connection => {
      const user = await this.users.findById(userId);
      if (!user) throw new Error("USER_NOT_FOUND");

      const domainUser = createUserDomainObject(user.id,user.name,user.email,user.role as Role);
      const active = await this.loans.countActiveByUser(userId, connection);
      if (active >= domainUser.getBorrowLimit()) throw new Error("BORROW_LIMIT_REACHED");

      // Row lock makes the inventory operation safe against concurrent borrows.
      const row = await this.books.findById(bookId, connection, true);
      if (!row) throw new Error("BOOK_NOT_FOUND");

      const book = new Book(row.id,row.isbn,row.title,row.author,row.category,
        row.total_copies,row.available_copies,row.published_year);
      if (!book.isAvailable()) throw new Error("BOOK_UNAVAILABLE");

      if (await this.loans.findActive(userId,bookId,connection)) throw new Error("ALREADY_BORROWED");

      const dueAt = new Date();
      dueAt.setDate(dueAt.getDate()+14);

      const loanId = await this.loans.create(userId,bookId,dueAt,connection);
      await connection.execute(
        "UPDATE books SET available_copies=available_copies-1 WHERE id=? AND available_copies>0",
        [bookId]
      );

      await this.audit.log(userId,"BORROW","LOAN",loanId,{bookId},ip);
      return { loanId, dueAt, message:"Book borrowed successfully." };
    });
  }

  async returnBook(userId: number, loanId: number, ip?: string) {
    return Database.transaction(async connection => {
      const loanRow = await this.loans.findById(loanId);
      if (!loanRow) throw new Error("LOAN_NOT_FOUND");
      if (loanRow.user_id !== userId) throw new Error("FORBIDDEN");
      if (loanRow.status !== "BORROWED") throw new Error("ALREADY_RETURNED");

      const loan = new Loan(loanRow.id,loanRow.user_id,loanRow.book_id,
        new Date(loanRow.borrowed_at),new Date(loanRow.due_at),loanRow.status);
      const fine = loan.calculateFine();

      await this.loans.returnLoan(loanId,fine,connection);
      await connection.execute(
        "UPDATE books SET available_copies=LEAST(total_copies,available_copies+1) WHERE id=?",
        [loanRow.book_id]
      );
      await this.audit.log(userId,"RETURN","LOAN",loanId,{fine},ip);

      return { fine, message:"Book returned successfully." };
    });
  }

  myLoans(userId:number) { return this.loans.listByUser(userId); }
  allLoans() { return this.loans.listAll(); }
}
