"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoutes = bookRoutes;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
function bookRoutes(c) { const r = (0, express_1.Router)(); r.get("/", auth_1.authenticate, c.list); r.get("/:id", auth_1.authenticate, c.get); r.post("/", auth_1.authenticate, (0, auth_1.authorize)("ADMIN", "LIBRARIAN"), c.create); r.put("/:id", auth_1.authenticate, (0, auth_1.authorize)("ADMIN", "LIBRARIAN"), c.update); r.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("ADMIN"), c.delete); return r; }
