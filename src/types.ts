export enum SkillCategory {
  TECHNICAL = '01-technical',
  ONBOARDING = '02-onboarding',
  ALIGNMENT = '03-alignment',
  ADOPTION = '04-adoption',
  EXPANSION = '05-expansion',
  CHURN = '06-churn',
  OPERATIONS = '07-operations'
}

export interface Skill {
  id: string;
  category: SkillCategory;
  name: string;
  slug: string;
  folder: string;
  filename: string;
  status: 'Vetted' | 'Untested';
  lead_contributor: string;
  contributor_social: string;
}

export interface ValueReceipt {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  nrrImpact: number;
  roiMetrics: { label: string; value: string }[];
  executiveSummary: string;
}

export interface OutcomeBlueprint {
  id: string;
  customerId: string;
  strategicGoals: string[];
  maturityLevel: 'Novice' | 'Intermediate' | 'Expert';
  nextMilestones: string[];
}

export interface ApprovalItem {
  id: string;
  type: 'Save Play' | 'Expansion Campaign';
  customerId: string;
  customerName: string;
  draftContent: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Signal {
  id: string;
  source: 'Slack' | 'Email' | 'Transcript';
  type: 'Silent Killer' | 'Expansion Signal';
  content: string;
  sentiment: number; // -1 to 1
  detectedAt: string;
  customerId: string;
  customerName: string;
}

export interface TelemetryData {
  customerId: string;
  apiLatency: number;
  healthScore: number;
  activeUsers: number;
  lastBillingEvent: string;
}
