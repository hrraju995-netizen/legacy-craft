// This server.js is for the .next/standalone output.
// Copy this file to .next/standalone/ before running.
const { createServer } = require('http');
const { parse } = require('url');
const next = require('./node_modules/next/dist/server/lib/start-server');

// For standalone builds Next.js exports a minimal server
// Usage: node server.js
// This file should be run from inside .next/standalone/

process.env.NODE_ENV = 'production';
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';
process.env.PORT = process.env.PORT || '3000';

const port = parseInt(process.env.PORT, 10);

require('./.next/standalone/server.js');
