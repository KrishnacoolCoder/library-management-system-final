"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const express_1 = require("express");
function authRoutes(c) { const r = (0, express_1.Router)(); r.post("/register", c.register); r.post("/verify-email", c.verifyEmail); r.post("/login", c.login); return r; }
