"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocument = void 0;
exports.swaggerDocument = {
    openapi: "3.0.0",
    info: { title: "Library Management API", version: "2.0.0", description: "OOP + DBMS + REST API library backend" },
    servers: [{ url: "http://localhost:3000" }],
    components: {
        securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } }
    },
    paths: {
        "/api/health": { get: { summary: "Health check", responses: { "200": { description: "OK" } } } },
        "/api/auth/register": { post: { summary: "Register user", responses: { "201": { description: "Created" } } } },
        "/api/auth/login": { post: { summary: "Login", responses: { "200": { description: "JWT returned" } } } },
        "/api/auth/verify-email": { post: { summary: "Verify email using OTP", responses: { "200": { description: "Verified" } } } },
        "/api/books": {
            get: { summary: "Search books with pagination", security: [{ bearerAuth: [] }], responses: { "200": { description: "Book page" } } },
            post: { summary: "Create book", security: [{ bearerAuth: [] }], responses: { "201": { description: "Created" } } }
        },
        "/api/loans/borrow": { post: { summary: "Borrow book", security: [{ bearerAuth: [] }], responses: { "201": { description: "Loan created" } } } },
        "/api/loans/{id}/return": { post: { summary: "Return book", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Returned" } } } },
        "/api/loans/my": { get: { summary: "Current user's loans", security: [{ bearerAuth: [] }], responses: { "200": { description: "Loans" } } } },
        "/api/loans": { get: { summary: "All loans", security: [{ bearerAuth: [] }], responses: { "200": { description: "Loans" } } } },
        "/api/users": { get: { summary: "List users", security: [{ bearerAuth: [] }], responses: { "200": { description: "Users" } } } },
        "/api/users/audit-logs": { get: { summary: "Audit logs", security: [{ bearerAuth: [] }], responses: { "200": { description: "Audit logs" } } } }
    }
};
