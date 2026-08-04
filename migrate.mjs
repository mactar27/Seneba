import fs from 'fs';
import mysql from 'mysql2/promise';

async function run() {
  const pool = mysql.createPool({
    host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '2CAFHNy5ELTTnHc.root',
    password: 'DYRkCECR8zQLihk9',
    database: 'seneba',
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    multipleStatements: true
  });
  
  const files = [
    'scripts/mysql-schema.sql',
    'scripts/seed-senegal.sql',
    'scripts/004-spatial-index-drivers.sql',
    'scripts/005-add-payment-method.sql'
  ];
  
  for (const f of files) {
    if (fs.existsSync(f)) {
      console.log(`Running ${f}...`);
      const sql = fs.readFileSync(f, 'utf8');
      // For multiple statements to work reliably we might need to split by ';'
      // However multipleStatements: true on createPool usually handles it.
      try {
          await pool.query(sql);
          console.log(`Finished ${f}`);
      } catch(e) {
          console.log(`Error in ${f}:`, e.message);
      }
    }
  }
  
  await pool.end();
}
run().catch(console.error);
