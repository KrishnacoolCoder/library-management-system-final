"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanRoutes = loanRoutes;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
function loanRoutes(c) { const r = (0, express_1.Router)(); r.post("/borrow", auth_1.authenticate, c.borrow); r.post("/:id/return", auth_1.authenticate, c.returnBook); r.get("/my", auth_1.authenticate, c.mine); r.get("/", auth_1.authenticate, (0, auth_1.authorize)("ADMIN", "LIBRARIAN"), c.all); return r; }
