import {Student,Librarian,Admin} from "../src/domain/User";
import {Loan} from "../src/domain/Loan";

describe("OOP domain model",()=>{
  test("polymorphic borrow limits",()=>{
    const users=[new Student(1,"S","s@x.com","STUDENT"),new Librarian(2,"L","l@x.com","LIBRARIAN"),new Admin(3,"A","a@x.com","ADMIN")];
    expect(users.map(u=>u.getBorrowLimit())).toEqual([5,20,Number.MAX_SAFE_INTEGER]);
  });

  test("loan fine calculation",()=>{
    const due=new Date("2026-08-01T00:00:00Z");
    const loan=new Loan(1,1,1,new Date("2026-07-20T00:00:00Z"),due,"BORROWED");
    expect(loan.calculateFine(new Date("2026-08-04T00:00:00Z"),10)).toBe(30);
  });

  test("returned loan has no fine",()=>{
    const loan=new Loan(1,1,1,new Date(),new Date("2020-01-01"),"RETURNED");
    expect(loan.calculateFine(new Date("2026-01-01"))).toBe(0);
  });
});
