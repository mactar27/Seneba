import fs from 'fs';
import { pool } from '../lib/db';

async function run() {
  const sql = fs.readFileSync('scripts/005-add-payment-method.sql', 'utf8');
  await pool.query(sql);
  console.log("Migration executed!");
  process.exit(0);
}
run().catch(console.error);
