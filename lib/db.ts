import mysql from 'mysql2/promise';

const pool = process.env.DATABASE_URL
  ? mysql.createPool({
      uri: process.env.DATABASE_URL,
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
    })
  : mysql.createPool({
      host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT || process.env.DB_PORT) || 3306,
      user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
      password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'seneba',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: (process.env.MYSQL_HOST && process.env.MYSQL_HOST !== 'localhost') || (process.env.DB_HOST && process.env.DB_HOST !== 'localhost')
        ? { minVersion: 'TLSv1.2', rejectUnauthorized: true }
        : undefined,
    });

export { pool };
export default pool;

