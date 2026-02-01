/**
 * Database CLI Utilities
 * 
 * Run with:
 * - npm run db:init - Creates all tables (briefs, quotes, portal)
 * - npm run db:check - Tests database connection
 * - npm run db:init-portal - Creates only portal tables
 * 
 * Usage: npx tsx scripts/db.ts [command]
 */

// Load environment variables from .env.local
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getDb, checkConnection, initializeDatabase } from '../src/lib/db';
import { initializePortalTables } from '../src/lib/portal-db';

async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'init':
      console.log('🔄 Initializing database (all tables)...');
      try {
        await initializeDatabase();
        console.log('✅ Core tables initialized!');
        console.log('   - briefs table');
        console.log('   - quotes table');
        
        await initializePortalTables();
        console.log('✅ Portal tables initialized!');
        console.log('   - clients table');
        console.log('   - projects table');
        console.log('   - change_requests table');
        console.log('   - comments table');
        console.log('   - files table');
        console.log('   - activity_log table');
        console.log('\n✅ Database initialized successfully!');
      } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        process.exit(1);
      }
      break;

    case 'init-portal':
      console.log('🔄 Initializing portal tables only...');
      try {
        await initializePortalTables();
        console.log('✅ Portal tables initialized!');
        console.log('   - clients table');
        console.log('   - projects table');
        console.log('   - change_requests table');
        console.log('   - comments table');
        console.log('   - files table');
        console.log('   - activity_log table');
      } catch (error) {
        console.error('❌ Failed to initialize portal tables:', error);
        process.exit(1);
      }
      break;

    case 'check':
      console.log('🔄 Checking database connection...');
      try {
        const isConnected = await checkConnection();
        if (isConnected) {
          console.log('✅ Database connection successful!\n');
          
          const sql = getDb();
          
          // Check all tables
          const tables = ['briefs', 'quotes', 'clients', 'projects', 'change_requests', 'comments', 'files', 'activity_log'];
          
          for (const table of tables) {
            const tableCheck = await sql`
              SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = ${table}
              ) as exists
            ` as { exists: boolean }[];
            
            if (tableCheck[0]?.exists) {
              // Use raw query for dynamic table name
              const countResult = await sql`
                SELECT COUNT(*) as count FROM information_schema.tables WHERE table_name = ${table}
              ` as { count: string }[];
              console.log(`✅ ${table}: exists`);
            } else {
              console.log(`⚠️  ${table}: does not exist`);
            }
          }
          
          console.log('\n💡 Run "npm run db:init" to create missing tables');
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
      console.log('⚠️  This would reset all tables. For safety, this command is disabled.');
      console.log('   If you really need to reset, do it manually in your database console.');
      break;

    default:
      console.log(`
Database CLI Utilities

Commands:
  init         - Initialize all tables (briefs, quotes, portal)
  init-portal  - Initialize only portal tables
  check        - Test database connection and show table stats

Usage:
  npx tsx scripts/db.ts init
  npx tsx scripts/db.ts init-portal
  npx tsx scripts/db.ts check
      `);
      break;
  }

  process.exit(0);
}

main();
