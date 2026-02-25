import Database from "better-sqlite3";

const dbPath =
  process.env.NODE_ENV === "production"
    ? "/tmp/database.sqlite"
    : "./database.sqlite";

const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS user(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS todos(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        task TEXT,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES user(id)
    );
`);

export default db;