export type Role = "STUDENT" | "LIBRARIAN" | "ADMIN";

export abstract class User {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly role: Role
  ) {}

  abstract getBorrowLimit(): number;
  abstract getRoleDescription(): string;
}

export class Student extends User {
  getBorrowLimit() { return 5; }
  getRoleDescription() { return "Student borrower"; }
}

export class Librarian extends User {
  getBorrowLimit() { return 20; }
  getRoleDescription() { return "Library staff member"; }
}

export class Admin extends User {
  getBorrowLimit() { return Number.MAX_SAFE_INTEGER; }
  getRoleDescription() { return "System administrator"; }
}

export function createUserDomainObject(id: number, name: string, email: string, role: Role): User {
  if (role === "ADMIN") return new Admin(id, name, email, role);
  if (role === "LIBRARIAN") return new Librarian(id, name, email, role);
  return new Student(id, name, email, role);
}
