import 'server-only';
import { getPool, getDefaultPool, query, setDbInitialized, isDbInitialized, closePool } from './connection';
import { readFileSync } from 'fs';
import { join } from 'path';
import { seedDatabase } from './seed';

let initPromise: Promise<void> | null = null;

async function databaseExists(dbName: string): Promise<boolean> {
  const defaultPool = getDefaultPool();
  try {
    const result = await defaultPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking database existence:', error);
    throw error;
  } finally {
    await defaultPool.end();
  }
}

async function createDatabase(dbName: string): Promise<void> {
  const defaultPool = getDefaultPool();
  try {
    // Escape database name to prevent SQL injection
    const escapedName = dbName.replace(/"/g, '""');
    await defaultPool.query(`CREATE DATABASE "${escapedName}"`);
    console.log(`Database ${dbName} created successfully`);
  } catch (error) {
    console.error(`Error creating database ${dbName}:`, error);
    throw error;
  } finally {
    await defaultPool.end();
  }
}

async function initializeSchema(): Promise<void> {
  let schemaPath: string | undefined;
  
  // Try multiple possible paths for Next.js
  const possiblePaths = [
    join(process.cwd(), 'lib', 'db', 'schema.sql'),
    join(process.cwd(), 'frontend', 'next-app', 'lib', 'db', 'schema.sql'),
  ];
  
  // Add __dirname if available (CommonJS)
  try {
    if (typeof __dirname !== 'undefined') {
      possiblePaths.push(join(__dirname, 'schema.sql'));
    }
  } catch {
    // __dirname not available in ES modules
  }
  
  for (const path of possiblePaths) {
    try {
      const content = readFileSync(path, 'utf-8');
      if (content.length > 0) {
        schemaPath = path;
        break;
      }
    } catch {
      continue;
    }
  }
  
  if (!schemaPath) {
    const errorMsg = `Schema file not found. Tried: ${possiblePaths.join(', ')}. Current working directory: ${process.cwd()}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  console.log(`Reading schema from: ${schemaPath}`);
  const schema = readFileSync(schemaPath, 'utf-8');
  
  // Split by semicolon, but preserve multi-line statements
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => {
      // Filter out empty statements and comments-only lines
      const withoutComments = s.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('--'))
        .join(' ');
      return withoutComments.length > 0;
    });

  console.log(`Executing ${statements.length} schema statements...`);
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const withoutComments = statement.split('\n')
      .map(line => {
        const commentIndex = line.indexOf('--');
        if (commentIndex >= 0) {
          return line.substring(0, commentIndex).trim();
        }
        return line.trim();
      })
      .filter(line => line.length > 0)
      .join(' ');
    
    if (withoutComments.length === 0) continue;
    
    try {
      await query(withoutComments);
      console.log(`Executed statement ${i + 1}/${statements.length}`);
    } catch (error: unknown) {
      // Ignore "already exists" errors for IF NOT EXISTS statements
      const err = error as { message?: string; code?: string };
      if (err?.message?.includes('already exists') || err?.code === '42P07') {
        console.log(`Statement ${i + 1} skipped (already exists)`);
        continue;
      }
      console.error(`Error executing schema statement ${i + 1}:`, error);
      console.error('Statement:', withoutComments.substring(0, 200));
      throw error;
    }
  }
  
  console.log('Schema initialized successfully');
  
  // Run migrations
  await runMigrations();
  
  // Verify tables were created
  const verifyResult = await query<{ table_name: string }>(
    `SELECT table_name FROM information_schema.tables 
     WHERE table_schema = 'public' 
     AND table_name IN ('users', 'artworks', 'exhibitions', 'registrations')
     ORDER BY table_name`
  );
  
  const createdTables = verifyResult.rows.map((r) => r.table_name);
  console.log(`Verified tables created: ${createdTables.join(', ')}`);
  
  if (createdTables.length < 4) {
    throw new Error(`Schema initialization incomplete. Expected 4+ tables, found: ${createdTables.length}`);
  }
}

async function runMigrations(): Promise<void> {
  // Migrate: Add verified column to exhibitions if it doesn't exist
  try {
    await query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'exhibitions' AND column_name = 'verified'
        ) THEN
          ALTER TABLE exhibitions ADD COLUMN verified BOOLEAN DEFAULT false;
          CREATE INDEX IF NOT EXISTS idx_exhibitions_verified ON exhibitions(verified);
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'exhibitions' AND column_name = 'verification_feedback'
        ) THEN
          ALTER TABLE exhibitions ADD COLUMN verification_feedback TEXT;
        END IF;
      END $$;
    `);
    console.log('Migration: verified and verification_feedback columns check completed');
  } catch (error: unknown) {
    // Ignore if column already exists
    const err = error as { message?: string; code?: string };
    if (!err?.message?.includes('already exists') && err?.code !== '42701') {
      console.error('Migration error (non-critical):', error);
    }
  }
}

async function checkSchemaExists(): Promise<boolean> {
  try {
    const result = await query<{ exists: boolean }>(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )`
    );
    return result.rows[0].exists;
  } catch {
    return false;
  }
}

export async function initializeDatabase(): Promise<void> {
  if (isDbInitialized()) {
    return;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const dbName = process.env.POSTGRES_DB || 'cultural_art_platform';
      
      const exists = await databaseExists(dbName);
      
      if (!exists) {
        console.log(`Database ${dbName} does not exist. Creating...`);
        await createDatabase(dbName);
        
        await closePool();
        const pool = getPool();
        await pool.query('SELECT 1');
        
        console.log('Initializing schema...');
        await initializeSchema();
        
        console.log('Seeding database...');
        await seedDatabase();
        
        console.log('Database initialization complete');
      } else {
        // Database exists, ensure we can connect
        const pool = getPool();
        try {
          await pool.query('SELECT 1');
        } catch {
          console.log('Reconnecting to database...');
          await closePool();
          const newPool = getPool();
          await newPool.query('SELECT 1');
        }
        
        // Always check if schema exists and initialize if needed
        const schemaExists = await checkSchemaExists();
        if (!schemaExists) {
          console.log('Schema does not exist. Initializing...');
          await initializeSchema();
        } else {
          console.log('Schema already exists');
          // Run migrations for existing schema
          await runMigrations();
        }
      }
      
      setDbInitialized(true);
    } catch (error) {
      console.error('Database initialization failed:', error);
      setDbInitialized(false);
      throw error;
    }
  })();

  return initPromise;
}

