#!/usr/bin/env node
/**
 * MKM Properties - Secure Administrator Provisioning Script
 * 
 * Usage:
 *   node scripts/create-admin.js <email> <password> [mobile]
 * 
 * Example:
 *   node scripts/create-admin.js admin@example.com MyStrongPass#2026 9629048171
 * 
 * Zero hardcoded credentials. Passwords are validated and hashed with bcrypt (cost 12).
 */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const readline = require('readline');

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'mkm_properties.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Ensure tables exist
db.exec(`
  CREATE TABLE IF NOT EXISTS AdminUser (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    email TEXT UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    status TEXT NOT NULL DEFAULT 'PENDING',
    enquiryId TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(pass) {
  if (!pass || pass.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  return null;
}

async function createAdmin(email, password, phone) {
  const cleanEmail = email.trim().toLowerCase();
  if (!validateEmail(cleanEmail)) {
    console.error('❌ Error: Invalid email address format.');
    process.exit(1);
  }

  const passErr = validatePassword(password);
  if (passErr) {
    console.error(`❌ Error: ${passErr}`);
    process.exit(1);
  }

  const cleanPhone = (phone || '').trim();
  const now = new Date().toISOString();
  console.log(`🔐 Hashing password with bcrypt (cost factor 12)...`);
  const passwordHash = await bcrypt.hash(password, 12);

  // Check if admin exists
  const existingAdmin = db.prepare('SELECT id FROM AdminUser WHERE email = ?').get(cleanEmail);
  const existingUser = db.prepare('SELECT id FROM User WHERE email = ?').get(cleanEmail);

  if (existingAdmin) {
    db.prepare('UPDATE AdminUser SET passwordHash = ? WHERE id = ?').run(passwordHash, existingAdmin.id);
    console.log(`✅ Updated password for existing AdminUser (${cleanEmail})`);
  } else {
    const adminId = crypto.randomUUID();
    db.prepare('INSERT INTO AdminUser (id, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?)').run(
      adminId,
      cleanEmail,
      passwordHash,
      'admin',
      now
    );
    console.log(`✅ Created new AdminUser (${cleanEmail})`);
  }

  if (existingUser) {
    db.prepare('UPDATE User SET passwordHash = ?, role = ?, status = ?, updatedAt = ? WHERE id = ?').run(
      passwordHash,
      'admin',
      'APPROVED',
      now,
      existingUser.id
    );
    console.log(`✅ Synchronized User portal account (${cleanEmail}) as APPROVED admin`);
  } else {
    const userId = crypto.randomUUID();
    db.prepare(`
      INSERT INTO User (id, name, phone, whatsapp, email, passwordHash, role, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      'Administrator',
      cleanPhone || null,
      cleanPhone || null,
      cleanEmail,
      passwordHash,
      'admin',
      'APPROVED',
      now,
      now
    );
    console.log(`✅ Created unified User portal account (${cleanEmail})`);
  }

  console.log('\n=============================================================');
  console.log(' 🎉 Administrator account ready!');
  console.log(` Email: ${cleanEmail}`);
  console.log(' Role:  admin (Full System Access)');
  console.log(' Status: APPROVED');
  console.log('=============================================================\n');
}

const args = process.argv.slice(2);

if (args.length >= 2) {
  createAdmin(args[0], args[1], args[2]).catch(err => {
    console.error('❌ Failed to provision admin:', err);
    process.exit(1);
  });
} else {
  // Interactive prompt
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('=== MKM Properties - Administrator Provisioning Tool ===\n');
  rl.question('Enter Administrator Email: ', (email) => {
    rl.question('Enter Administrator Password (min 8 chars): ', (password) => {
      rl.question('Enter Mobile Number (optional): ', (phone) => {
        rl.close();
        createAdmin(email, password, phone).catch(err => {
          console.error('❌ Failed to provision admin:', err);
          process.exit(1);
        });
      });
    });
  });
}

