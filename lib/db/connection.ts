import 'server-only';
import { Pool, QueryResult, QueryResultRow } from 'pg';

let pool: Pool | null = null;
let isInitialized = false;

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

function getConfig(): DbConfig {
  return {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '',
    database: process.env.POSTGRES_DB || 'cultural_art_platform',
  };
}

export function getPool(): Pool {
  if (!pool) {
    const config = getConfig();
    pool = new Pool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const pool = getPool();
  try {
    return await pool.query<T>(text, params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export function getDefaultPool(): Pool {
  const config = getConfig();
  return new Pool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: 'postgres',
    max: 5,
  });
}

export function isDbInitialized(): boolean {
  return isInitialized;
}

export function setDbInitialized(value: boolean): void {
  isInitialized = value;
}

