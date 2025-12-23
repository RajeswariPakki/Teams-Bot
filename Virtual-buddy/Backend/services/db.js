import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDB() {
  return open({
    filename: "./emotion_data.sqlite",
    driver: sqlite3.Database
  });
}

export async function initDB() {
  const db = await openDB();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS emotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_message TEXT,
      detected_emotion TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return db;
}
