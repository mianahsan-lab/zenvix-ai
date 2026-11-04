import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import JSZip from 'jszip';
import { GoogleGenAI } from '@google/genai';
import { dbService, hashPassword, verifyPassword } from './src/server/db.ts';
import { TOOLS_REGISTRY } from './src/shared/toolsRegistry.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Auth helper middleware
function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  return dbService.getUserByToken(token);
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  (req as any).user = user;
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }
  (req as any).user = user;
  next();
}

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------

app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, name, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existing = dbService.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const { hash, salt } = hashPassword(password);
    const user = dbService.createUser({
      email,
      name,
      passwordHash: hash,
      salt,
      role: 'user',
    });

    const token = dbService.createSession(user.id);
    const { passwordHash: _, salt: __, ...safeUser } = user;
    return res.json({ user: safeUser, token });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to create account.' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = dbService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = verifyPassword(password, user.passwordHash, user.salt);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    dbService.updateUser(user.id, { lastLoginAt: new Date().toISOString() });
    const token = dbService.createSession(user.id);
    const { passwordHash: _, salt: __, ...safeUser } = user;
    return res.json({ user: safeUser, token });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed.' });
  }
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { passwordHash: _, salt: __, ...safeUser } = user as any;
  return res.json({ user: safeUser });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    dbService.removeSession(token);
  }
  return res.json({ success: true });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });
  const user = dbService.getUserByEmail(email);
  if (!user) {
    // Return friendly message even if user not found for security
    return res.json({ message: 'If an account exists, a password reset link has been dispatched.' });
  }
  const resetToken = 'rst_' + Math.random().toString(36).substring(2, 12);
  dbService.updateUser(user.id, {
    resetToken,
    resetTokenExpires: Date.now() + 3600000,
  });
  return res.json({
    message: 'Password reset link dispatched.',
    simulationResetToken: resetToken,
  });
});

app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password required.' });
  }
  const allUsers = dbService.getAllUsers();
  const target = allUsers.find((u: any) => u.resetToken === token);
  if (!target || (target as any).resetTokenExpires < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired password reset token.' });
  }

  const { hash, salt } = hashPassword(newPassword);
  dbService.updateUser(target.id, {
    passwordHash: hash,
    salt,
    resetToken: undefined,
    resetTokenExpires: undefined,
  });
  return res.json({ message: 'Password has been successfully updated. You may now log in.' });
});

app.post('/api/auth/verify-email', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  dbService.updateUser(user.id, { emailVerified: true });
  return res.json({ success: true, message: 'Email successfully verified!' });
});

app.put('/api/auth/profile', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name cannot be empty.' });
  const updated = dbService.updateUser(user.id, { name });
  const { passwordHash: _, salt: __, ...safeUser } = updated as any;
  return res.json({ user: safeUser });
});

// -------------------------------------------------------------
// AI Generation Endpoint
// -------------------------------------------------------------

app.post('/api/ai/generate', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const user = getAuthenticatedUser(req);
    const { toolId, inputValues } = req.body;

    if (!toolId || !inputValues) {
      return res.status(400).json({ error: 'Missing toolId or inputValues' });
    }

    const toolConfig = TOOLS_REGISTRY.find((t) => t.id === toolId);
    if (!toolConfig) {
      return res.status(404).json({ error: 'AI Tool not found' });
    }

    // Check credits if logged in
    const userId = user ? user.id : 'guest';
    const userEmail = user ? user.email : 'guest@zenvix.ai';
    const cost = toolConfig.creditCost || 1;

    if (user) {
      if (user.plan === 'free' && user.credits < cost) {
        return res.status(403).json({
          error: 'Credit limit reached. Please upgrade to ZENVIX Pro for unlimited generation or wait for daily reset.',
          creditsNeeded: cost,
          creditsAvailable: user.credits,
        });
      }
    }

    // Build prompt
    const userPrompt = toolConfig.userPromptTemplate(inputValues);
    const systemPrompt = toolConfig.systemPrompt;

    let generatedText = '';

    // Check API Key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is configured in Settings > Secrets.',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    generatedText = response.text || '';

    // Deduct credit if user exists
    if (user && cost > 0) {
      dbService.deductCredit(user.id, cost);
    }

    // Log usage
    const durationMs = Date.now() - startTime;
    const inputSnippet = Object.values(inputValues).join(' ').slice(0, 100);
    dbService.logUsage({
      userId,
      userEmail,
      toolId: toolConfig.id,
      toolName: toolConfig.name,
      inputSnippet,
      creditsCharged: cost,
      durationMs,
      status: 'success',
    });

    const updatedUser = user ? dbService.getUserById(user.id) : null;

    return res.json({
      output: generatedText,
      toolId,
      creditsRemaining: updatedUser ? updatedUser.credits : null,
      durationMs,
    });
  } catch (err: any) {
    console.error('AI Generation Error:', err);
    const durationMs = Date.now() - startTime;
    const user = getAuthenticatedUser(req);
    if (user) {
      dbService.logUsage({
        userId: user.id,
        userEmail: user.email,
        toolId: req.body.toolId || 'unknown',
        toolName: 'Error Run',
        inputSnippet: 'Error',
        creditsCharged: 0,
        durationMs,
        status: 'error',
      });
    }

    return res.status(500).json({
      error: err.message || 'An error occurred during AI content generation. Please try again.',
    });
  }
});

// -------------------------------------------------------------
// User Dashboard & Data Management
// -------------------------------------------------------------

app.get('/api/user/dashboard-stats', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const usageLogs = dbService.getUserUsageLogs(user.id);
  const savedResults = dbService.getUserSavedResults(user.id);
  const favorites = dbService.getFavorites(user.id);

  // Calculate past 7 days usage counts
  const last7Days: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const count = usageLogs.filter((l) => l.createdAt.startsWith(dateStr)).length;
    last7Days.push({ date: dayLabel, count });
  }

  return res.json({
    user,
    totalGenerations: usageLogs.length,
    savedResultsCount: savedResults.length,
    favoritesCount: favorites.length,
    last7DaysUsage: last7Days,
    recentLogs: usageLogs.slice(0, 10),
  });
});

app.get('/api/user/saved-results', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const results = dbService.getUserSavedResults(user.id);
  return res.json({ results });
});

app.post('/api/user/saved-results', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { toolId, toolName, title, inputPayload, outputContent, tags } = req.body;
  if (!toolId || !title || !outputContent) {
    return res.status(400).json({ error: 'Missing required saved result data' });
  }

  const saved = dbService.saveResult({
    userId: user.id,
    toolId,
    toolName,
    title,
    inputPayload: inputPayload || {},
    outputContent,
    tags: tags || [],
  });

  return res.json({ result: saved });
});

app.delete('/api/user/saved-results/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const success = dbService.deleteSavedResult(req.params.id, user.id);
  return res.json({ success });
});

app.get('/api/user/favorites', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const favorites = dbService.getFavorites(user.id);
  return res.json({ favorites });
});

app.post('/api/user/favorites/toggle', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { toolId } = req.body;
  if (!toolId) return res.status(400).json({ error: 'toolId required' });
  const isFavorite = dbService.toggleFavorite(user.id, toolId);
  return res.json({ isFavorite, favorites: dbService.getFavorites(user.id) });
});

app.get('/api/user/history', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const logs = dbService.getUserUsageLogs(user.id);
  return res.json({ logs });
});

app.post('/api/user/upgrade-subscription', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { plan, billingCycle, provider } = req.body; // 'monthly' | 'yearly'
  const cycle = billingCycle === 'yearly' ? 'yearly' : 'monthly';
  const amount = cycle === 'yearly' ? 190 : 19;

  const sub = dbService.createOrUpdateSubscription(user.id, plan || 'pro', cycle, amount);
  const updatedUser = dbService.getUserById(user.id);
  const { passwordHash: _, salt: __, ...safeUser } = updatedUser as any;

  return res.json({
    success: true,
    subscription: sub,
    user: safeUser,
    message: `Upgraded to ZENVIX Pro (${cycle}) successfully! Test payment via ${provider || 'Stripe'} processed.`,
  });
});

app.post('/api/user/cancel-subscription', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  dbService.cancelSubscription(user.id);
  const updatedUser = dbService.getUserById(user.id);
  const { passwordHash: _, salt: __, ...safeUser } = updatedUser as any;
  return res.json({
    success: true,
    user: safeUser,
    message: 'Subscription has been cancelled. Plan reset to Free.',
  });
});

// -------------------------------------------------------------
// Admin Endpoints
// -------------------------------------------------------------

app.get('/api/admin/overview', requireAdmin, (req: Request, res: Response) => {
  const allUsers = dbService.getAllUsers();
  const allLogs = dbService.getAllUsageLogs();
  const settings = dbService.getSettings();

  const proUsers = allUsers.filter((u) => u.plan === 'pro').length;
  const totalGenerations = allLogs.length;

  // Tool usage distribution
  const toolDistribution: Record<string, number> = {};
  for (const log of allLogs) {
    toolDistribution[log.toolName] = (toolDistribution[log.toolName] || 0) + 1;
  }

  const topTools = Object.entries(toolDistribution)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const estimatedRevenue = proUsers * 19; // baseline monthly MRR

  return res.json({
    totalUsers: allUsers.length,
    proUsers,
    totalGenerations,
    estimatedRevenue,
    topTools,
    settings,
    recentUsers: allUsers.slice(-6).reverse(),
    recentLogs: allLogs.slice(0, 15),
  });
});

app.get('/api/admin/users', requireAdmin, (req: Request, res: Response) => {
  const users = dbService.getAllUsers();
  return res.json({ users });
});

app.put('/api/admin/users/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { credits, role, plan } = req.body;
  const updated = dbService.updateUser(id, { credits, role, plan });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  const { passwordHash: _, salt: __, ...safeUser } = updated as any;
  return res.json({ user: safeUser });
});

app.get('/api/admin/logs', requireAdmin, (req: Request, res: Response) => {
  const logs = dbService.getAllUsageLogs();
  return res.json({ logs });
});

app.get('/api/admin/settings', (req: Request, res: Response) => {
  const settings = dbService.getSettings();
  return res.json({ settings });
});

app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = dbService.updateSettings(req.body);
  return res.json({ settings: updated });
});

// -------------------------------------------------------------
// Contact & Support Form
// -------------------------------------------------------------

app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  // Log message or store
  console.log(`[Support Inquiry] From: ${name} <${email}> Subject: ${subject || 'General'}\n${message}`);
  return res.json({
    success: true,
    message: 'Thank you for reaching out! Our engineering team will respond to your inquiry within 24 hours.',
  });
});

// -------------------------------------------------------------
// Project ZIP Export (Full source code download)
// -------------------------------------------------------------

app.get('/api/download-zip', async (req: Request, res: Response) => {
  try {
    const zip = new JSZip();
    const rootDir = process.cwd();

    function addFolderToZip(currentDir: string, zipFolder: JSZip) {
      const items = fs.readdirSync(currentDir);
      for (const item of items) {
        if (
          item === 'node_modules' ||
          item === 'dist' ||
          item === '.git' ||
          item === '.env' ||
          item.startsWith('.aistudio')
        ) {
          continue;
        }

        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          const subFolder = zipFolder.folder(item);
          if (subFolder) {
            addFolderToZip(fullPath, subFolder);
          }
        } else {
          const content = fs.readFileSync(fullPath);
          zipFolder.file(item, content);
        }
      }
    }

    addFolderToZip(rootDir, zip);

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="zenvix-ai-production-platform.zip"');
    return res.send(zipBuffer);
  } catch (err: any) {
    console.error('Error generating project ZIP:', err);
    return res.status(500).json({ error: 'Failed to generate project archive.' });
  }
});

// -------------------------------------------------------------
// Frontend Integration (Vite in dev, static dist in prod)
// -------------------------------------------------------------

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`ZENVIX AI Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
