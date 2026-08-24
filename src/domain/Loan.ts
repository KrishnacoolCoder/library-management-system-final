export type LoanStatus = "BORROWED" | "RETURNED";

export class Loan {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly bookId: number,
    public readonly borrowedAt: Date,
    public readonly dueAt: Date,
    public readonly status: LoanStatus
  ) {}

  isOverdue(now = new Date()) {
    return this.status === "BORROWED" && now.getTime() > this.dueAt.getTime();
  }

  calculateFine(now = new Date(), dailyRate = 10) {
    if (!this.isOverdue(now)) return 0;
    const days = Math.ceil((now.getTime() - this.dueAt.getTime()) / 86400000);
    return days * dailyRate;
  }
}
