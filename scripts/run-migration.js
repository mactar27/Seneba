import fs from 'fs';
import 'dotenv/config';
import mysql from 'mysql2/promise';

async function run() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const sql = fs.readFileSync('scripts/005-add-payment-method.sql', 'utf8');
  await connection.query(sql);
  console.log("Migration executed!");
  await connection.end();
}
run().catch(console.error);
