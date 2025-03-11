/*
  This file interacts with the app's database and is used by the app's REST APIs.
*/

import sqlite3 from "sqlite3";
import path from "path";
import shopify from "./shopify.js";

const DEFAULT_DB_FILE = path.join(process.cwd(), "db.sqlite");
// const DEFAULT_PURCHASE_QUANTITY = 1;

export const NoteDB = {
  NOTE_TABLE_NAME: "notes",
  db: null,
  ready: null,

  create: async function ({ shopId, title, content, tag, date, month, year }) {
    await this.ready;

    const query = `
      INSERT INTO ${this.NOTE_TABLE_NAME}
      (shopId, title, content, tag, date, month, year)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING id;
    `;

    const rawResults = await this.__query(query, [
      shopId,
      title,
      content,
      tag,
      date,
      month,
      year,
    ]);

    return rawResults[0].id;
  },

  list: async function () {
    await this.ready;
    const query = `
        SELECT * FROM ${this.NOTE_TABLE_NAME};
      `;

    const results = await this.__query(query);

    return results;
  },

  read: async function ({ shopId, date, month, year }) {
    await this.ready;
    const query = `
      SELECT * FROM ${this.NOTE_TABLE_NAME}
      WHERE date = ? AND month = ? AND year = ? AND shopId = ?;
      `;
    const rows = await this.__query(query, [date, month, year, shopId]);
    if (!Array.isArray(rows)) return undefined;

    return rows;
  },

  readByMonth: async function ({ month, year, shopId }) {
    await this.ready;
    const query = `
      SELECT * FROM ${this.NOTE_TABLE_NAME}
      WHERE month = ? AND year = ? AND shopId = ?;
      `;
    const rows = await this.__query(query, [month, year, shopId]);

    if (!Array.isArray(rows)) return undefined;

    return rows;
  },

  update: async function ({ id, title, content, tag }) {
    await this.ready;
    const query = `
        UPDATE ${this.NOTE_TABLE_NAME}
        SET
          title = ?,
          content = ?,
          tag = ?
        WHERE id = ?;
      `;
    await this.__query(query, [title, content, tag, id]);
    return true;
  },

  delete: async function ({ id }) {
    await this.ready;
    const query = `
        DELETE FROM ${this.NOTE_TABLE_NAME}
        WHERE id = ?;
      `;
    await this.__query(query, [id]);
    return true;
  },

  /* Private */

  /*
    Used to check whether to create the database.
    Also used to make sure the database and table are set up before the server starts.
  */

  __hasNoteTable: async function () {
    const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `;
    const rows = await this.__query(query, [this.NOTE_TABLE_NAME]);
    return rows.length === 1;
  },

  /* Initializes the connection with the app's sqlite3 database */
  init: async function () {
    /* Initializes the connection to the database */
    this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

    const hasNoteTable = await this.__hasNoteTable();

    if (hasNoteTable) {
      this.ready = Promise.resolve();
    } else {
      const query = `
        CREATE TABLE ${this.NOTE_TABLE_NAME} (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          shopId INTEGER NOT NULL,
          title VARCHAR(511) NOT NULL,
          content TEXT NOT NULL,
          date INTEGER NOT NULL,
          month INTEGER NOT NULL,
          year INTEGER NOT NULL,
          tag VARCHAR(511) NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
        );
      `;

      // id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      // title VARCHAR(511) NOT NULL,
      // price INTEGER NOT NULL,
      // image BLOB NOT NULL,
      // as_product_id VARCHAR(511),
      // is_active BOOLEAN DEFAULT FALSE NOT NULL,
      // createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))

      this.ready = this.__query(query);
    }
  },

  __query: function (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  },
};
