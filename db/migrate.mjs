#!/usr/bin/env node
/**
 * Database Migration Script
 * Run: node db/migrate.mjs
 */

import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env file
import { config } from 'dotenv'
config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment')
  process.exit(1)
}

console.log('🔗 Connecting to Neon database...')

const sql = neon(DATABASE_URL)

async function migrate() {
  try {
    console.log('📝 Running schema migration...')

    // Run each statement individually using tagged template

    // Enable UUID extension
    console.log('  ✓ Enabling UUID extension...')
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

    // Create profiles table
    console.log('  ✓ Creating profiles table...')
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE,
        display_name TEXT,
        avatar_url TEXT,
        stripe_customer_id TEXT UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `

    // Create subscriptions table
    console.log('  ✓ Creating subscriptions table...')
    await sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT UNIQUE,
        status TEXT DEFAULT 'free',
        plan TEXT DEFAULT 'free',
        current_period_start TIMESTAMPTZ,
        current_period_end TIMESTAMPTZ,
        cancel_at_period_end BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `

    // Create decisions table
    console.log('  ✓ Creating decisions table...')
    await sql`
      CREATE TABLE IF NOT EXISTS decisions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        user_email TEXT,
        stripe_customer_id TEXT,
        tool TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        data JSONB NOT NULL DEFAULT '{}',
        score INTEGER,
        advice_type TEXT,
        ai_analysis JSONB,
        outcome_rating INTEGER,
        outcome_notes TEXT,
        outcome_date TIMESTAMPTZ,
        is_public BOOLEAN DEFAULT FALSE,
        share_token TEXT UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `

    // Create ai_usage table
    console.log('  ✓ Creating ai_usage table...')
    await sql`
      CREATE TABLE IF NOT EXISTS ai_usage (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        user_identifier TEXT NOT NULL,
        month TEXT NOT NULL,
        count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_identifier, month)
      )
    `

    // Create indexes
    console.log('  ✓ Creating indexes...')
    await sql`CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_subscriptions_profile ON subscriptions(profile_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_decisions_profile ON decisions(profile_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_decisions_user_email ON decisions(user_email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_decisions_stripe_customer ON decisions(stripe_customer_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_decisions_created ON decisions(created_at DESC)`
    await sql`CREATE INDEX IF NOT EXISTS idx_decisions_share_token ON decisions(share_token)`
    await sql`CREATE INDEX IF NOT EXISTS idx_ai_usage_identifier_month ON ai_usage(user_identifier, month)`

    // Create update function
    console.log('  ✓ Creating update trigger function...')
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `

    // Create triggers
    console.log('  ✓ Creating triggers...')
    await sql`DROP TRIGGER IF EXISTS profiles_updated_at ON profiles`
    await sql`CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at()`

    await sql`DROP TRIGGER IF EXISTS subscriptions_updated_at ON subscriptions`
    await sql`CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at()`

    await sql`DROP TRIGGER IF EXISTS decisions_updated_at ON decisions`
    await sql`CREATE TRIGGER decisions_updated_at BEFORE UPDATE ON decisions FOR EACH ROW EXECUTE FUNCTION update_updated_at()`

    await sql`DROP TRIGGER IF EXISTS ai_usage_updated_at ON ai_usage`
    await sql`CREATE TRIGGER ai_usage_updated_at BEFORE UPDATE ON ai_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at()`

    console.log('\n✅ Migration complete!')

    // Verify tables exist
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    console.log('\n📊 Tables in database:')
    tables.forEach(t => console.log(`  - ${t.table_name}`))

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.error(error)
    process.exit(1)
  }
}

migrate()
