import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const db = await mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "library_manager",
  });

  const h = await bcrypt.hash("Password@123", 12);

  // Seed users
  for (const u of [
    ["Admin User", "admin@library.local", "ADMIN"],
    ["Main Librarian", "librarian@library.local", "LIBRARIAN"],
    ["Demo Student", "student@library.local", "STUDENT"],
  ]) {
    await db.execute(
      `INSERT INTO users
       (name, email, password_hash, role, is_verified)
       VALUES (?, ?, ?, ?, TRUE)
       ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       password_hash = VALUES(password_hash),
       role = VALUES(role),
       is_verified = TRUE`,
      [u[0], u[1], h, u[2]]
    );
  }

  // Seed books
  const books = [
    [
      "9780132350884",
      "Clean Code",
      "Robert C. Martin",
      "Software Engineering",
      2008,
      3,
      3,
    ],
    [
      "9780262033848",
      "Introduction to Algorithms",
      "Thomas H. Cormen",
      "Algorithms",
      2009,
      2,
      2,
    ],
    [
      "9780131103627",
      "The C Programming Language",
      "Brian Kernighan",
      "Programming",
      1988,
      2,
      2,
    ],
    [
      "9781492056355",
      "Designing Data-Intensive Applications",
      "Martin Kleppmann",
      "Systems",
      2017,
      2,
      2,
    ],
  ];

  for (const b of books) {
    await db.execute(
      `INSERT INTO books
       (isbn, title, author, category, published_year, total_copies, available_copies)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       title = VALUES(title)`,
      [...b]
    );
  }

  await db.end();

  console.log("Seed complete. Password: Password@123");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});