import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, UsageLog, SavedResult, AdminSettings, PlanType } from '../types/index.ts';

const DB_FILE = path.resolve(process.cwd(), 'data', 'zenvix_db.json');

interface UserRecord extends User {
  passwordHash: string;
  salt: string;
  verificationToken?: string;
  resetToken?: string;
  resetTokenExpires?: number;
}

interface DBStructure {
  users: UserRecord[];
  usageLogs: UsageLog[];
  savedResults: SavedResult[];
  favorites: { id: string; userId: string; toolId: string; createdAt: string }[];
  subscriptions: {
    id: string;
    userId: string;
    plan: PlanType;
    billingCycle: 'monthly' | 'yearly';
    amount: number;
    status: 'active' | 'cancelled';
    currentPeriodEnd: string;
    createdAt: string;
  }[];
  settings: AdminSettings;
}

// Password hashing utility using PBKDF2
export function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')): { hash: string; salt: string } {
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculated = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return calculated === hash;
}

// Ensure database file exists with initial seeded records
function initDB(): DBStructure {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      return data;
    } catch (e) {
      console.error('Error reading db.json, re-initializing...', e);
    }
  }

  // Initial Seed
  const adminSalt = crypto.randomBytes(16).toString('hex');
  const userSalt = crypto.randomBytes(16).toString('hex');

  const initialDB: DBStructure = {
    users: [
      {
        id: 'usr_admin_001',
        email: 'admin@zenvix.ai',
        name: 'Alex Vance (Admin)',
        passwordHash: hashPassword('admin123', adminSalt).hash,
        salt: adminSalt,
        role: 'admin',
        plan: 'pro',
        credits: 99999,
        maxCredits: 99999,
        emailVerified: true,
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        lastLoginAt: new Date().toISOString(),
      },
      {
        id: 'usr_demo_002',
        email: 'user@zenvix.ai',
        name: 'Sarah Connor',
        passwordHash: hashPassword('password123', userSalt).hash,
        salt: userSalt,
        role: 'user',
        plan: 'free',
        credits: 45,
        maxCredits: 50,
        emailVerified: true,
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        lastLoginAt: new Date().toISOString(),
      },
    ],
    usageLogs: [
      {
        id: 'log_01',
        userId: 'usr_demo_002',
        userEmail: 'user@zenvix.ai',
        toolId: 'ai-writer',
        toolName: 'AI Writer',
        inputSnippet: 'The future of quantum computing in everyday finance',
        creditsCharged: 1,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        durationMs: 1420,
        status: 'success',
      },
      {
        id: 'log_02',
        userId: 'usr_demo_002',
        userEmail: 'user@zenvix.ai',
        toolId: 'youtube-title',
        toolName: 'YouTube Title Generator',
        inputSnippet: 'Mechanical keyboards testing 10 switches for quiet typing',
        creditsCharged: 1,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        durationMs: 1100,
        status: 'success',
      },
      {
        id: 'log_03',
        userId: 'usr_admin_001',
        userEmail: 'admin@zenvix.ai',
        toolId: 'code-assistant',
        toolName: 'AI Code Assistant',
        inputSnippet: 'TypeScript debounce function with cancel method',
        creditsCharged: 1,
        createdAt: new Date().toISOString(),
        durationMs: 1650,
        status: 'success',
      },
    ],
    savedResults: [
      {
        id: 'res_01',
        userId: 'usr_demo_002',
        toolId: 'ai-writer',
        toolName: 'AI Writer',
        title: 'Quantum Computing in Daily Banking',
        inputPayload: { topic: 'Quantum Computing in Daily Banking', tone: 'Professional & Authoritative' },
        outputContent: '### The Quantum Leap in Everyday Finance\n\nQuantum algorithms are poised to transform cryptographic security, portfolio risk modeling, and real-time fraud mitigation across modern decentralized financial hubs...',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        tags: ['Finance', 'Tech'],
      },
      {
        id: 'res_02',
        userId: 'usr_demo_002',
        toolId: 'youtube-title',
        toolName: 'YouTube Title Generator',
        title: 'Mechanical Keyboards Title Ideas',
        inputPayload: { topic: 'Mechanical Keyboards Testing' },
        outputContent: '1. I Tested 10 "Silent" Switches (Only 2 Actually Are!)\n2. Stop Buying Loud Keyboards: The 2026 Office Tier List\n3. The Ultimate Quiet Switch Guide for Developers',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        tags: ['YouTube', 'Gear'],
      },
    ],
    favorites: [
      { id: 'fav_01', userId: 'usr_demo_002', toolId: 'ai-writer', createdAt: new Date().toISOString() },
      { id: 'fav_02', userId: 'usr_demo_002', toolId: 'youtube-script', createdAt: new Date().toISOString() },
      { id: 'fav_03', userId: 'usr_demo_002', toolId: 'code-assistant', createdAt: new Date().toISOString() },
    ],
    subscriptions: [
      {
        id: 'sub_01',
        userId: 'usr_admin_001',
        plan: 'pro',
        billingCycle: 'yearly',
        amount: 190,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 335 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
    ],
    settings: {
      siteName: 'ZENVIX AI',
      maintenanceMode: false,
      announcementBanner: '🚀 Welcome to ZENVIX AI v2.4 — 24+ AI Power Tools Now Available!',
      defaultFreeCredits: 50,
      proCreditsMonthly: 5000,
      proPriceMonthly: 19,
      proPriceYearly: 190,
      allowSignups: true,
    },
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf-8');
  return initialDB;
}

let db = initDB();

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write to DB:', err);
  }
}

// Memory session tokens: token -> userId
const sessions = new Map<string, { userId: string; expiresAt: number }>();

export const dbService = {
  // Users
  getUserByEmail(email: string) {
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  getUserById(id: string) {
    return db.users.find((u) => u.id === id);
  },

  createUser(userData: { email: string; name: string; passwordHash: string; salt: string; role?: 'user' | 'admin' }) {
    const defaultCredits = db.settings.defaultFreeCredits || 50;
    const newUser: UserRecord = {
      id: 'usr_' + crypto.randomUUID().slice(0, 8),
      email: userData.email.toLowerCase(),
      name: userData.name,
      passwordHash: userData.passwordHash,
      salt: userData.salt,
      role: userData.role || 'user',
      plan: 'free',
      credits: defaultCredits,
      maxCredits: defaultCredits,
      emailVerified: false,
      verificationToken: crypto.randomBytes(20).toString('hex'),
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveDB();
    return newUser;
  },

  updateUser(id: string, updates: Partial<UserRecord>) {
    const user = db.users.find((u) => u.id === id);
    if (!user) return null;
    Object.assign(user, updates);
    saveDB();
    return user;
  },

  getAllUsers() {
    return db.users.map(({ passwordHash, salt, ...safeUser }) => safeUser);
  },

  // Sessions
  createSession(userId: string): string {
    const token = 'znv_' + crypto.randomBytes(32).toString('hex');
    sessions.set(token, {
      userId,
      expiresAt: Date.now() + 7 * 86400000, // 7 days
    });
    return token;
  },

  getUserByToken(token: string) {
    const session = sessions.get(token);
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      sessions.delete(token);
      return null;
    }
    return this.getUserById(session.userId);
  },

  removeSession(token: string) {
    sessions.delete(token);
  },

  // Usage & Credits
  deductCredit(userId: string, cost = 1) {
    const user = db.users.find((u) => u.id === userId);
    if (!user) return false;
    // Pro/Enterprise users have unlimited or very high credits
    if (user.plan !== 'free') {
      return true;
    }
    if (user.credits < cost) return false;
    user.credits -= cost;
    saveDB();
    return true;
  },

  logUsage(logData: Omit<UsageLog, 'id' | 'createdAt'>) {
    const log: UsageLog = {
      id: 'log_' + crypto.randomUUID().slice(0, 8),
      createdAt: new Date().toISOString(),
      ...logData,
    };
    db.usageLogs.unshift(log);
    // Keep last 1000 logs
    if (db.usageLogs.length > 1000) {
      db.usageLogs.pop();
    }
    saveDB();
    return log;
  },

  getUserUsageLogs(userId: string) {
    return db.usageLogs.filter((l) => l.userId === userId);
  },

  getAllUsageLogs() {
    return db.usageLogs;
  },

  // Saved Results
  saveResult(result: Omit<SavedResult, 'id' | 'createdAt'>) {
    const newResult: SavedResult = {
      id: 'res_' + crypto.randomUUID().slice(0, 8),
      createdAt: new Date().toISOString(),
      ...result,
    };
    db.savedResults.unshift(newResult);
    saveDB();
    return newResult;
  },

  getUserSavedResults(userId: string) {
    return db.savedResults.filter((r) => r.userId === userId);
  },

  deleteSavedResult(id: string, userId: string) {
    const index = db.savedResults.findIndex((r) => r.id === id && r.userId === userId);
    if (index === -1) return false;
    db.savedResults.splice(index, 1);
    saveDB();
    return true;
  },

  // Favorites
  getFavorites(userId: string) {
    return db.favorites.filter((f) => f.userId === userId).map((f) => f.toolId);
  },

  toggleFavorite(userId: string, toolId: string) {
    const index = db.favorites.findIndex((f) => f.userId === userId && f.toolId === toolId);
    if (index > -1) {
      db.favorites.splice(index, 1);
      saveDB();
      return false; // removed
    } else {
      db.favorites.push({
        id: 'fav_' + crypto.randomUUID().slice(0, 8),
        userId,
        toolId,
        createdAt: new Date().toISOString(),
      });
      saveDB();
      return true; // added
    }
  },

  // Subscriptions
  createOrUpdateSubscription(userId: string, plan: PlanType, billingCycle: 'monthly' | 'yearly', amount: number) {
    const user = db.users.find((u) => u.id === userId);
    if (!user) return null;
    user.plan = plan;
    user.credits = plan === 'pro' ? db.settings.proCreditsMonthly : db.settings.defaultFreeCredits;
    user.maxCredits = user.credits;

    const sub = {
      id: 'sub_' + crypto.randomUUID().slice(0, 8),
      userId,
      plan,
      billingCycle,
      amount,
      status: 'active' as const,
      currentPeriodEnd: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    db.subscriptions.unshift(sub);
    saveDB();
    return sub;
  },

  cancelSubscription(userId: string) {
    const user = db.users.find((u) => u.id === userId);
    if (!user) return false;
    user.plan = 'free';
    user.credits = db.settings.defaultFreeCredits;
    user.maxCredits = db.settings.defaultFreeCredits;
    const userSubs = db.subscriptions.filter((s) => s.userId === userId && s.status === 'active');
    for (const sub of userSubs) {
      sub.status = 'cancelled';
    }
    saveDB();
    return true;
  },

  // Settings
  getSettings(): AdminSettings {
    return db.settings;
  },

  updateSettings(newSettings: Partial<AdminSettings>) {
    Object.assign(db.settings, newSettings);
    saveDB();
    return db.settings;
  },
};
