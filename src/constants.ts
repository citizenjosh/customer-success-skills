
/**
 * REPlexus Customer Success Skill Framework - Master Registry
 * * @framework_author Josh Rosenthal (REPlexus.com)
 * @social linkedin.com/in/citizen
 * @license REPlexus Community License v1.0
 * @version 1.0.0
 * * Copyright (c) 2026 REPlexus LLC. All rights reserved.
 * This file acts as the primary index for the Customer Success Skill Agentic Library.
 * Use of this registry is permitted for personal and internal corporate use.
 * Commercial resale or redistribution of this taxonomy is prohibited.
 */

import { Skill, SkillCategory, Signal, ApprovalItem } from './types';
import skillsData from '../SKILLS_REGISTRY.json';

// Registry Mapping Helper
const getSkillMetadata = (id: string, name: string, stage: string, status: string, contributor: string, social: string, slug: string): Skill => {
  const categoryMap: Record<string, SkillCategory> = {
    'Technical': SkillCategory.TECHNICAL,
    'Onboarding': SkillCategory.ONBOARDING,
    'Alignment': SkillCategory.ALIGNMENT,
    'Adoption': SkillCategory.ADOPTION,
    'Expansion': SkillCategory.EXPANSION,
    'Churn': SkillCategory.CHURN,
    'Operations': SkillCategory.OPERATIONS,
  };

  const category = categoryMap[stage] || SkillCategory.TECHNICAL;

  return {
    id,
    name,
    slug,
    category,
    folder: category,
    filename: `${slug}.md`,
    status: status as 'Vetted' | 'Untested',
    lead_contributor: contributor,
    contributor_social: social,
  };
};

// This one line bridges the "Universal JSON" to the "TypeScript App"
export const SKILLS_LIBRARY: Skill[] = (skillsData.registry as any[]).map((s: any) => 
  getSkillMetadata(s.id, s.name, s.stage, s.status, s.contributor, s.contributor_social, s.slug)
);

export const MOCK_SIGNALS: Signal[] = [
  {
    id: 'SIG-001',
    source: 'Slack',
    type: 'Silent Killer',
    content: 'Client mentioned they are looking at alternatives due to pricing complexity.',
    sentiment: -0.8,
    detectedAt: new Date().toISOString(),
    customerId: 'CUST-101',
    customerName: 'Acme Corp'
  },
  {
    id: 'SIG-002',
    source: 'Email',
    type: 'Expansion Signal',
    content: 'Requested info on the new gRPC federation features for their other business unit.',
    sentiment: 0.9,
    detectedAt: new Date().toISOString(),
    customerId: 'CUST-202',
    customerName: 'Globex'
  }
];

export const MOCK_APPROVALS: ApprovalItem[] = [
  {
    id: 'APP-001',
    type: 'Save Play',
    customerId: 'CUST-101',
    customerName: 'Acme Corp',
    draftContent: 'Proposed 15% discount for 2-year renewal to mitigate churn risk.',
    status: 'Pending',
    timestamp: new Date().toISOString(),
    riskLevel: 'High'
  },
  {
    id: 'APP-002',
    type: 'Expansion Campaign',
    customerId: 'CUST-202',
    customerName: 'Globex',
    draftContent: 'Invite to VIP beta for multi-protocol schema mapping.',
    status: 'Approved',
    timestamp: new Date().toISOString(),
    riskLevel: 'Low'
  }
];
