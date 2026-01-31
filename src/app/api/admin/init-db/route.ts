/**
 * Database Initialization API
 * 
 * One-time setup endpoint to create database tables.
 * Protected by a secret key for security.
 * 
 * Usage: POST /api/admin/init-db
 * Header: x-admin-key: YOUR_ADMIN_KEY
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, checkConnection } from '@/lib/db';

export async function POST(request: NextRequest) {
  // Check for admin key
  const adminKey = request.headers.get('x-admin-key');
  const expectedKey = process.env.ADMIN_SECRET_KEY;
  
  if (!expectedKey || adminKey !== expectedKey) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Check database connection first
    const isConnected = await checkConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // Initialize tables
    await initializeDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database tables initialized successfully',
      tables: ['briefs', 'quotes'],
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also allow GET for quick health check
export async function GET() {
  try {
    const isConnected = await checkConnection();
    return NextResponse.json({
      database: isConnected ? 'connected' : 'disconnected',
    });
  } catch {
    return NextResponse.json({
      database: 'error',
    });
  }
}
