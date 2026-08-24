"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = exports.Librarian = exports.Student = exports.User = void 0;
exports.createUserDomainObject = createUserDomainObject;
class User {
    id;
    name;
    email;
    role;
    constructor(id, name, email, role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
exports.User = User;
class Student extends User {
    getBorrowLimit() { return 5; }
    getRoleDescription() { return "Student borrower"; }
}
exports.Student = Student;
class Librarian extends User {
    getBorrowLimit() { return 20; }
    getRoleDescription() { return "Library staff member"; }
}
exports.Librarian = Librarian;
class Admin extends User {
    getBorrowLimit() { return Number.MAX_SAFE_INTEGER; }
    getRoleDescription() { return "System administrator"; }
}
exports.Admin = Admin;
function createUserDomainObject(id, name, email, role) {
    if (role === "ADMIN")
        return new Admin(id, name, email, role);
    if (role === "LIBRARIAN")
        return new Librarian(id, name, email, role);
    return new Student(id, name, email, role);
}
