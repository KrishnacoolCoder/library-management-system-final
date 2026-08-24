# Interview Guide

## OOP
- `User` is an abstract class.
- `Student`, `Librarian`, `Admin` inherit from `User`.
- `getBorrowLimit()` is polymorphic.
- Domain classes encapsulate business behavior.
- Services use composition with repositories.

## DBMS
- Primary/foreign keys
- Unique and CHECK constraints
- Indexes
- Joins
- Transactions
- Row-level locking with `SELECT ... FOR UPDATE`
- Referential integrity

## Backend
- REST APIs
- JWT authentication
- RBAC
- bcrypt
- Zod validation
- centralized error handling
- rate limiting
- Helmet
- compression

## System design discussion
Borrowing updates both `loans` and `books.available_copies`, so both operations occur in one transaction. A row lock protects inventory from concurrent borrowing requests.

## Production improvements
- Redis caching
- refresh tokens
- observability/metrics
- CI/CD
- cloud deployment
- stronger automated integration tests
