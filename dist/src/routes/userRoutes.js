"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
function userRoutes(c) { const r = (0, express_1.Router)(); r.get("/", auth_1.authenticate, (0, auth_1.authorize)("ADMIN"), c.list); r.patch("/:id/status", auth_1.authenticate, (0, auth_1.authorize)("ADMIN"), c.setStatus); r.get("/audit-logs", auth_1.authenticate, (0, auth_1.authorize)("ADMIN"), c.audits); return r; }
