export type UserRole = 'user' | 'admin';
export type PlanType = 'free' | 'pro' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  plan: PlanType;
  credits: number;
  maxCredits: number;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export type ToolCategory =
  | 'writing'
  | 'marketing'
  | 'study'
  | 'coding'
  | 'productivity';

export interface ToolField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  placeholder?: string;
  defaultValue?: string | number;
  options?: { label: string; value: string }[];
  helperText?: string;
  required?: boolean;
}

export interface AIToolConfig {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  badge?: string;
  icon: string;
  fields: ToolField[];
  systemPrompt: string;
  userPromptTemplate: (values: Record<string, any>) => string;
  outputFormat: 'text' | 'markdown' | 'code' | 'json' | 'html' | 'quiz' | 'flashcards';
  isLocalOnly?: boolean; // For tools like word counter & password generator
  creditCost: number;
  popular?: boolean;
  enabled: boolean;
}

export interface SavedResult {
  id: string;
  userId: string;
  toolId: string;
  toolName: string;
  title: string;
  inputPayload: Record<string, any>;
  outputContent: string;
  createdAt: string;
  tags?: string[];
}

export interface UsageLog {
  id: string;
  userId: string;
  userEmail: string;
  toolId: string;
  toolName: string;
  inputSnippet: string;
  creditsCharged: number;
  createdAt: string;
  durationMs: number;
  status: 'success' | 'error';
}

export interface AdminSettings {
  siteName: string;
  maintenanceMode: boolean;
  announcementBanner: string;
  defaultFreeCredits: number;
  proCreditsMonthly: number;
  proPriceMonthly: number;
  proPriceYearly: number;
  allowSignups: boolean;
}
