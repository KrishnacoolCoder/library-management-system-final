import { Database } from "../config/database";

export class BookRepository {
  async search(query = "", page = 1, limit = 20, sort = "title") {
    const allowedSorts: Record<string, string> = {
      title: "title", author: "author", category: "category", newest: "created_at"
    };
    const sortColumn = allowedSorts[sort] || "title";
    const offset = (page - 1) * limit;
    const q = `%${query}%`;

    const [rows] = await Database.getPool().query(
      `SELECT * FROM books
       WHERE title LIKE ? OR author LIKE ? OR category LIKE ? OR isbn LIKE ?
       ORDER BY ${sortColumn} LIMIT ? OFFSET ?`,
      [q, q, q, q, limit, offset]
    );
    const [countRows] = await Database.getPool().query(
      `SELECT COUNT(*) AS total FROM books
       WHERE title LIKE ? OR author LIKE ? OR category LIKE ? OR isbn LIKE ?`,
      [q, q, q, q]
    );
    return { data: rows as any[], page, limit, total: Number((countRows as any[])[0].total) };
  }

  async findById(id: number, connection?: any, lock = false) {
    const executor = connection || Database.getPool();
    const [rows] = await executor.query(
      `SELECT * FROM books WHERE id=? LIMIT 1${lock ? " FOR UPDATE" : ""}`, [id]
    );
    return (rows as any[])[0] || null;
  }

  async create(data: any) {
    const [result] = await Database.getPool().execute(
      `INSERT INTO books (isbn,title,author,category,total_copies,available_copies,published_year)
       VALUES (?,?,?,?,?,?,?)`,
      [data.isbn, data.title, data.author, data.category, data.totalCopies, data.totalCopies, data.publishedYear || null]
    );
    return (result as any).insertId;
  }

  async update(id: number, data: any) {
    await Database.getPool().execute(
      `UPDATE books
       SET isbn=?,title=?,author=?,category=?,
           total_copies=?,available_copies=available_copies + (? - ?),published_year=?
       WHERE id=?`,
      [data.isbn, data.title, data.author, data.category,
       data.totalCopies, data.totalCopies, data.previousTotalCopies, data.publishedYear || null, id]
    );
  }

  async delete(id: number) {
    await Database.getPool().execute("DELETE FROM books WHERE id=?", [id]);
  }
}
