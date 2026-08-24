"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const errorHandler_1 = require("./middleware/errorHandler");
const swagger_1 = require("./swagger");
const authRoutes_1 = require("./routes/authRoutes");
const bookRoutes_1 = require("./routes/bookRoutes");
const loanRoutes_1 = require("./routes/loanRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const UserRepository_1 = require("./repositories/UserRepository");
const BookRepository_1 = require("./repositories/BookRepository");
const LoanRepository_1 = require("./repositories/LoanRepository");
const AuditRepository_1 = require("./repositories/AuditRepository");
const EmailService_1 = require("./services/EmailService");
const OtpService_1 = require("./services/OtpService");
const AuthService_1 = require("./services/AuthService");
const BookService_1 = require("./services/BookService");
const LoanService_1 = require("./services/LoanService");
const AuthController_1 = require("./controllers/AuthController");
const BookController_1 = require("./controllers/BookController");
const LoanController_1 = require("./controllers/LoanController");
const UserController_1 = require("./controllers/UserController");
function createApp() {
    const app = (0, express_1.default)();
    app.set("trust proxy", 1);
    app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
    app.use((0, cors_1.default)({ origin: true }));
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: "1mb" }));
    const general = (0, express_rate_limit_1.default)({
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
        limit: Number(process.env.RATE_LIMIT_MAX || 100),
        standardHeaders: true, legacyHeaders: false
    });
    const authLimit = (0, express_rate_limit_1.default)({
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
        limit: Number(process.env.AUTH_RATE_LIMIT_MAX || 20),
        standardHeaders: true, legacyHeaders: false
    });
    app.use("/api", general);
    app.use("/api/auth", authLimit);
    app.use(express_1.default.static(path_1.default.join(process.cwd(), "public")));
    app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "library-management-system", version: "2.0.0" }));
    app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerDocument));
    const users = new UserRepository_1.UserRepository(), books = new BookRepository_1.BookRepository(), loans = new LoanRepository_1.LoanRepository(), audit = new AuditRepository_1.AuditRepository();
    const otp = new OtpService_1.OtpService(new EmailService_1.EmailService());
    const auth = new AuthController_1.AuthController(new AuthService_1.AuthService(users, otp, audit));
    const book = new BookController_1.BookController(new BookService_1.BookService(books, audit));
    const loan = new LoanController_1.LoanController(new LoanService_1.LoanService(users, books, loans, audit));
    const user = new UserController_1.UserController(users, audit);
    app.use("/api/auth", (0, authRoutes_1.authRoutes)(auth));
    app.use("/api/books", (0, bookRoutes_1.bookRoutes)(book));
    app.use("/api/loans", (0, loanRoutes_1.loanRoutes)(loan));
    app.use("/api/users", (0, userRoutes_1.userRoutes)(user));
    app.get("*", (_req, res) => res.sendFile(path_1.default.join(process.cwd(), "public", "index.html")));
    app.use(errorHandler_1.errorHandler);
    return app;
}
