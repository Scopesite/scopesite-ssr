/**
 * Database CLI Utilities
 * 
 * Run with:
 * - npm run db:init - Creates the briefs table
 * - npm run db:check - Tests database connection
 * 
 * Usage: npx tsx scripts/db.ts [command]
 */

// Load environment variables from .env.local
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getDb, checkConnection, initializeDatabase } from '../src/lib/db';

async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'init':
      console.log('🔄 Initializing database...');
      try {
        await initializeDatabase();
        console.log('✅ Database initialized successfully!');
        console.log('   - Created briefs table (if not exists)');
        console.log('   - Created indexes for email, status, and created_at');
      } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        process.exit(1);
      }
      break;

    case 'check':
      console.log('🔄 Checking database connection...');
      try {
        const isConnected = await checkConnection();
        if (isConnected) {
          console.log('✅ Database connection successful!');
          
          // Check if briefs table exists
          const sql = getDb();
          const tableCheck = await sql`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_name = 'briefs'
            ) as exists
          `;
          
          if (tableCheck[0]?.exists) {
            console.log('✅ Briefs table exists');
            
            // Count existing briefs
            const countResult = await sql`SELECT COUNT(*) as count FROM briefs`;
            console.log(`   - Total briefs: ${countResult[0]?.count || 0}`);
          } else {
            console.log('⚠️  Briefs table does not exist. Run: npm run db:init');
          }
        } else {
          console.log('❌ Database connection failed');
          process.exit(1);
        }
      } catch (error) {
        console.error('❌ Database check failed:', error);
        process.exit(1);
      }
      break;

    case 'reset':
      console.log('⚠️  Resetting database (dropping and recreating briefs table)...');
      try {
        const sql = getDb();
        await sql`DROP TABLE IF EXISTS briefs`;
        console.log('   - Dropped existing briefs table');
        await initializeDatabase();
        console.log('✅ Database reset successfully!');
      } catch (error) {
        console.error('❌ Failed to reset database:', error);
        process.exit(1);
      }
      break;

    default:
      console.log(`
Database CLI Utilities

Commands:
  init   - Initialize the database (create tables)
  check  - Test database connection and show stats
  reset  - Drop and recreate the briefs table (⚠️ destructive)

Usage:
  npx tsx scripts/db.ts init
  npx tsx scripts/db.ts check
  npx tsx scripts/db.ts reset
      `);
      break;
  }

  process.exit(0);
}

main();

