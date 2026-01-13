/**
 * Neon PostgreSQL Client
 *
 * Serverless PostgreSQL connection for Netlify Functions.
 * Uses @neondatabase/serverless for connection pooling.
 */

import { neon } from '@neondatabase/serverless'

// Get database URL from environment
const getDatabaseUrl = () => {
  // In Netlify Functions, use Netlify.env
  if (typeof Netlify !== 'undefined' && Netlify.env) {
    return Netlify.env.get('DATABASE_URL')
  }
  // In Node.js / local dev
  return process.env.DATABASE_URL
}

// Create a SQL query function
export const sql = neon(getDatabaseUrl())

export default sql
