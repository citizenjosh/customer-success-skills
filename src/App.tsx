/// <reference types="vite/client" />
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Library, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  FileText, 
  TrendingUp, 
  Search,
  ChevronRight,
  ShieldCheck,
  Activity,
  MessageSquare,
  Mail,
  FileAudio,
  UserCheck,
  Settings,
  ArrowUpRight,
  RefreshCw,
  Plug,
  BarChart3,
  Users,
  Target,
  Rocket,
  Shield,
  Cog
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { SKILLS_LIBRARY, MOCK_SIGNALS, MOCK_APPROVALS } from './constants';
import { Skill, SkillCategory, Signal, ApprovalItem, ValueReceipt, OutcomeBlueprint } from './types';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${
      active 
        ? 'bg-orange-500/10 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]' 
        : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-200'
    }`}
  >
    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
    <span className={active ? 'font-bold tracking-tight' : ''}>{label}</span>
  </button>
);

const CategoryIcon = ({ category, size = 18, className = "" }: { category: SkillCategory, size?: number, className?: string }) => {
  const icons: Record<string, any> = {
    '01-technical': Plug,
    '02-onboarding': Rocket,
    '03-alignment': Target,
    '04-adoption': Users,
    '05-expansion': BarChart3,
    '06-churn': Shield,
    '07-operations': Cog,
  };
  const Icon = icons[category] || Cog;
  return <Icon size={size} className={className} />;
};

const CategoryBadge = ({ category }: { category: SkillCategory }) => {
  const styles: Record<string, string> = {
    '01-technical': 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50',
    '02-onboarding': 'bg-blue-900/20 text-blue-400 border-blue-900/30',
    '03-alignment': 'bg-purple-900/20 text-purple-400 border-purple-900/30',
    '04-adoption': 'bg-emerald-900/20 text-emerald-400 border-emerald-900/30',
    '05-expansion': 'bg-amber-900/20 text-amber-400 border-amber-900/30',
    '06-churn': 'bg-red-900/20 text-red-400 border-red-900/30',
    '07-operations': 'bg-indigo-900/20 text-indigo-400 border-indigo-900/30',
  };

  const labels: Record<string, string> = {
    '01-technical': 'Technical',
    '02-onboarding': 'Onboarding',
    '03-alignment': 'Alignment',
    '04-adoption': 'Adoption',
    '05-expansion': 'Expansion',
    '06-churn': 'Churn',
    '07-operations': 'Operations',
  };

  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-tighter border backdrop-blur-sm ${styles[category] || styles['01-technical']}`}>
      <CategoryIcon category={category} size={10} />
      {labels[category] || category}
    </span>
  );
};

const Card = ({ children, title, subtitle, className = "", onClick }: { children: React.ReactNode, title?: string, subtitle?: string, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:translate-y-[-6px] hover:bg-slate-900/60 hover:border-white/10 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_30px_rgba(255,255,255,0.03)] ${className}`}
  >
    {(title || subtitle) && (
      <div className="px-6 py-4 border-b border-white/5 bg-white/2">
        {title && <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-1">{title}</h3>}
        {subtitle && <p className="text-xl font-bold text-white tracking-tight">{subtitle}</p>}
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'warning' | 'success' | 'danger' }) => {
  const styles = {
    default: 'bg-zinc-800/50 text-zinc-400 border-white/5',
    warning: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border backdrop-blur-sm ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'skills' | 'approvals' | 'signals' | 'settings'>('dashboard');
  const [skills, setSkills] = useState<Skill[]>(SKILLS_LIBRARY);
  const [signals, setSignals] = useState<Signal[]>(MOCK_SIGNALS);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(MOCK_APPROVALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fetch markdown when a skill is selected
  useEffect(() => {
    async function fetchMarkdown() {
      if (!selectedSkill) {
        setMarkdown('');
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}skills-library/${selectedSkill.folder}/${selectedSkill.filename}`);
        if (!response.ok) throw new Error('Failed to load skill content');
        const text = await response.text();
        setMarkdown(text);
      } catch (err) {
        console.error(err);
        setMarkdown('# Error\nFailed to load skill content. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMarkdown();
  }, [selectedSkill]);

  // Helper for category display
  const getCategoryDisplayName = (cat: SkillCategory) => {
    const mapping: Record<string, string> = {
      '01-technical': 'Technical',
      '02-onboarding': 'Onboarding',
      '03-alignment': 'Alignment',
      '04-adoption': 'Adoption',
      '05-expansion': 'Expansion',
      '06-churn': 'Churn',
      '07-operations': 'Operations',
    };
    return mapping[cat] || cat;
  };

  // Filtering skills
  const filteredSkills = useMemo(() => {
    return skills.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [skills, searchQuery]);

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
  };

  const handleReject = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
  };

  return (
    <div className="flex h-screen bg-[#020408] text-zinc-300 font-sans selection:bg-orange-500 selection:text-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col bg-[#010204]">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-black font-black text-sm shadow-[0_0_20px_rgba(249,115,22,0.3)]">R</div>
            <h1 className="text-lg font-black tracking-tighter text-white uppercase italic">REPlexus</h1>
          </div>
          <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-[0.3em]">Revenue Engineering</p>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Outcome Blueprint" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={Library} 
            label="Skill Library" 
            active={activeTab === 'skills'} 
            onClick={() => setActiveTab('skills')} 
          />
          <SidebarItem 
            icon={CheckCircle2} 
            label="HITL Queue" 
            active={activeTab === 'approvals'} 
            onClick={() => setActiveTab('approvals')} 
          />
          <SidebarItem 
            icon={AlertTriangle} 
            label="Silent Killers" 
            active={activeTab === 'signals'} 
            onClick={() => setActiveTab('signals')} 
          />
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-xs font-bold border border-white/10">JR</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Josh Rosenthal</p>
              <p className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest">Value Manager</p>
            </div>
            <Settings size={14} className="text-zinc-600 group-hover:text-zinc-300 transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#020408]">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#010204]/50 backdrop-blur-2xl z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
              {activeTab === 'dashboard' && "Executive Alignment / Outcome Blueprint"}
              {activeTab === 'skills' && "Customer Success Automation / Skill Library"}
              {activeTab === 'approvals' && "Human-in-the-Loop / Approval Queue"}
              {activeTab === 'signals' && "Unstructured Analysis / Silent Killers"}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
              <Activity size={12} className="text-emerald-500" />
              <span>OPAL: CONNECTED</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
              <Zap size={12} className="text-orange-500" />
              <span>KILOCLAW: ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Dashboard Hero */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card title="Net Revenue Retention" subtitle="124.5%" className="border-l-4 border-l-emerald-500">
                    <div className="flex items-end justify-between mt-2">
                      <div className="text-xs font-mono text-zinc-500">+12% vs LY</div>
                      <TrendingUp size={24} className="text-emerald-500" />
                    </div>
                  </Card>
                  <Card title="Value Realization Gap" subtitle="18.2%" className="border-l-4 border-l-orange-500">
                    <div className="flex items-end justify-between mt-2">
                      <div className="text-xs font-mono text-zinc-500">-4% vs Last Month</div>
                      <AlertTriangle size={24} className="text-orange-500" />
                    </div>
                  </Card>
                  <Card title="Agentic Execution Rate" subtitle="82.0%" className="border-l-4 border-l-blue-500">
                    <div className="flex items-end justify-between mt-2">
                      <div className="text-xs font-mono text-zinc-500">KiloClaw Efficiency</div>
                      <Zap size={24} className="text-blue-500" />
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Outcome Blueprint */}
                  <Card title="Outcome Blueprint" subtitle="Strategic Alignment">
                    <div className="space-y-6 mt-4">
                      <div className="flex items-center gap-3 p-6 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/5">
                        <div>
                          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Current Maturity</p>
                          <p className="text-2xl font-bold text-white tracking-tight">Intermediate</p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Next Milestone</p>
                          <p className="text-sm font-bold text-orange-400">gRPC Federation V2</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active Strategic Goals</h4>
                        {[
                          "Reduce operational error rates by 40%",
                          "Automate 90% of user provisioning",
                          "Achieve 100% API schema alignment"
                        ].map((goal, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            <div className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center text-[8px] font-mono">0{i+1}</div>
                            <span>{goal}</span>
                            <div className="ml-auto w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-500" style={{ width: `${70 - i * 15}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Value Receipt Generator */}
                  <Card title="Value Receipt" subtitle="CFO Executive Summary">
                    <div className="space-y-4 mt-4">
                      <div className="p-6 bg-white text-black rounded-sm shadow-2xl transform rotate-1">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h5 className="font-bold text-lg uppercase tracking-tighter">Value Receipt</h5>
                            <p className="text-[10px] font-mono text-zinc-500">ID: VR-2026-X99</p>
                          </div>
                          <ShieldCheck size={32} className="text-orange-500" />
                        </div>
                        
                        <div className="space-y-4 font-mono text-xs">
                          <div className="flex justify-between border-b border-zinc-200 pb-2">
                            <span>NRR IMPACT</span>
                            <span className="font-bold text-emerald-600">+$2.4M</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-200 pb-2">
                            <span>OPEX REDUCTION</span>
                            <span className="font-bold">14.2%</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-200 pb-2">
                            <span>VRE ATTAINMENT</span>
                            <span className="font-bold">92%</span>
                          </div>
                        </div>

                        <div className="mt-8 pt-4 border-t-2 border-dashed border-zinc-300">
                          <p className="text-[9px] italic leading-tight text-zinc-600">
                            "This document verifies the realized financial outcomes for the period Q1 2026. 
                            Verified by Opal Telemetry & KiloClaw Audit."
                          </p>
                        </div>
                      </div>
                      <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono uppercase tracking-widest transition-colors">
                        Generate New Receipt
                      </button>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === 'skills' && (
              <motion.div 
                key="skills"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <AnimatePresence mode="wait">
                  {!selectedSkill ? (
                    <motion.div
                      key="skill-list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-12"
                    >
                      {/* Impactful Header */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h2 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                            <span className="text-orange-500">REPlexus</span>
                            <span>Skill Registry</span>
                          </h2>
                          <p className="text-lg text-zinc-400 font-serif italic max-w-2xl">
                            The definitive taxonomy for Customer Success Automation. Agentic skills designed to automate the post-sales lifecycle.
                          </p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="relative w-full md:w-[480px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input 
                              type="text" 
                              placeholder="Search skills, categories, or contributors..." 
                              className="w-full bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all placeholder:text-zinc-600"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {Object.values(SkillCategory).map(cat => (
                              <button 
                                key={cat}
                                onClick={() => setSearchQuery(cat)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all border ${
                                  searchQuery === cat 
                                    ? 'bg-orange-500 text-black border-orange-500' 
                                    : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/20 hover:text-zinc-300'
                                }`}
                              >
                                {getCategoryDisplayName(cat)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredSkills.length > 0 ? (
                          filteredSkills.map(skill => (
                            <Card 
                              key={skill.id} 
                              className="hover:border-white/20 transition-all group cursor-pointer relative p-6"
                              onClick={() => setSelectedSkill(skill)}
                            >
                              <div className="flex justify-between items-start mb-6">
                                <CategoryBadge category={skill.category} />
                                <span className="text-[10px] font-mono text-zinc-700 font-bold tracking-widest">#{skill.id}</span>
                              </div>
                              
                              <div className="space-y-4">
                                <div className="p-3 bg-white/5 rounded-xl w-fit group-hover:bg-orange-500/10 transition-colors">
                                  <CategoryIcon category={skill.category} size={24} className="text-zinc-400 group-hover:text-orange-500 transition-colors" />
                                </div>
                                
                                <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors flex items-center gap-2">
                                  {skill.name}
                                  <span title={skill.status} className="text-sm">
                                    {skill.status === 'Vetted' ? '💎' : '🛠️'}
                                  </span>
                                </h3>

                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-500">
                                    {skill.lead_contributor.charAt(0)}
                                  </div>
                                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                                    <a 
                                      href={skill.contributor_social.startsWith('http') ? skill.contributor_social : `https://${skill.contributor_social}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:text-orange-500 transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {skill.lead_contributor}
                                    </a>
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">Open Registry</span>
                                <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-orange-500 transition-colors" />
                              </div>
                            </Card>
                          ))
                        ) : (
                          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-xl">
                            <p className="text-zinc-500 font-serif italic text-xl mb-4">No skill found. Think this is a gap?</p>
                            <a 
                              href="https://github.com/replexus/cs-engineering/blob/main/CONTRIBUTING.md" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-all"
                            >
                              <ArrowUpRight size={14} />
                              Contribute to Registry
                            </a>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="skill-detail"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <button 
                          onClick={() => setSelectedSkill(null)}
                          className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-500 hover:text-white transition-colors"
                        >
                          <ChevronRight size={14} className="rotate-180" />
                          Back to Library
                        </button>
                        <div className="h-4 w-px bg-zinc-800"></div>
                        <CategoryBadge category={selectedSkill.category} />
                        <span className="text-xs font-mono text-zinc-600">SKILL_ID: {selectedSkill.id}</span>
                        <div className="h-4 w-px bg-zinc-800"></div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Status:</span>
                          <span className="text-xs">{selectedSkill.status === 'Vetted' ? '💎 Vetted' : '🛠️ Untested'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg w-fit">
                        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                          Lead Contributor: {' '}
                          <a 
                            href={selectedSkill.contributor_social.startsWith('http') ? selectedSkill.contributor_social : `https://${selectedSkill.contributor_social}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:underline font-bold"
                          >
                            {selectedSkill.lead_contributor}
                          </a>
                        </p>
                      </div>

                      <Card className="bg-zinc-950 border-zinc-800 p-0 overflow-visible">
                        <div className="max-w-4xl mx-auto py-12 px-8">
                          {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                              <RefreshCw className="animate-spin text-orange-500" size={32} />
                              <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Fetching Registry Content...</p>
                            </div>
                          ) : (
                            <div className="prose prose-invert prose-orange max-w-none prose-headings:font-serif prose-headings:italic prose-h1:text-4xl prose-h1:mb-8 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:text-zinc-400 prose-p:leading-relaxed prose-li:text-zinc-400 prose-strong:text-white prose-code:text-orange-400">
                              <Markdown
                                components={{
                                  a: ({ node, ...props }) => {
                                    const isInternal = props.href?.startsWith('/');
                                    const isExternal = props.href?.startsWith('http');
                                    
                                    if (isInternal) {
                                      return <a {...props} />;
                                    }
                                    
                                    if (isExternal) {
                                      return <a {...props} target="_blank" rel="noopener noreferrer" />;
                                    }
                                    
                                    return <a {...props} />;
                                  }
                                }}
                              >
                                {markdown}
                              </Markdown>
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === 'approvals' && (
              <motion.div 
                key="approvals"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-serif italic text-white">HITL Approval Queue</h3>
                  <div className="flex gap-4">
                    <div className="text-center px-4 border-r border-zinc-800">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase">Pending</p>
                      <p className="text-xl font-bold text-orange-500">{approvals.filter(a => a.status === 'Pending').length}</p>
                    </div>
                    <div className="text-center px-4">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase">Approved Today</p>
                      <p className="text-xl font-bold text-emerald-500">{approvals.filter(a => a.status === 'Approved').length}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {approvals.map(item => (
                    <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex gap-6 items-start">
                      <div className={`p-3 rounded-lg ${item.type === 'Save Play' ? 'bg-red-900/20 text-red-400' : 'bg-emerald-900/20 text-emerald-400'}`}>
                        {item.type === 'Save Play' ? <ShieldCheck size={24} /> : <TrendingUp size={24} />}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-medium text-white">{item.customerName}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <Badge variant={item.type === 'Save Play' ? 'danger' : 'success'}>{item.type}</Badge>
                              <span className="text-[10px] font-mono text-zinc-500">{new Date(item.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                          <Badge variant={item.riskLevel === 'High' ? 'danger' : item.riskLevel === 'Medium' ? 'warning' : 'default'}>
                            Risk: {item.riskLevel}
                          </Badge>
                        </div>
                        
                        <div className="p-4 bg-black/50 rounded border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed">
                          {item.draftContent}
                        </div>

                        {item.status === 'Pending' ? (
                          <div className="flex gap-3 pt-2">
                            <button 
                              onClick={() => handleApprove(item.id)}
                              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-mono uppercase tracking-widest transition-colors rounded"
                            >
                              Approve & Execute
                            </button>
                            <button 
                              onClick={() => handleReject(item.id)}
                              className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-mono uppercase tracking-widest transition-colors rounded"
                            >
                              Reject
                            </button>
                            <button className="px-6 py-2 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 text-[10px] font-mono uppercase tracking-widest transition-colors rounded">
                              Edit Draft
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm font-medium">
                            {item.status === 'Approved' ? (
                              <><CheckCircle2 className="text-emerald-500" size={16} /> <span className="text-emerald-500">Approved & Sent to KiloClaw</span></>
                            ) : (
                              <><AlertTriangle className="text-red-500" size={16} /> <span className="text-red-500">Rejected</span></>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'signals' && (
              <motion.div 
                key="signals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Search size={120} />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-serif italic text-white mb-2">Unstructured Analysis</h3>
                    <p className="text-zinc-400 max-w-2xl">
                      LLM-powered detection of "Silent Killers" and expansion signals from Slack, email, and meeting transcripts. 
                      Monitoring 1,240 channels in real-time.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {signals.map(signal => (
                    <div key={signal.id} className="group bg-zinc-950 border border-zinc-900 hover:border-zinc-700 p-6 rounded-lg transition-all">
                      <div className="flex gap-6">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${signal.type === 'Silent Killer' ? 'bg-red-900/20 text-red-500' : 'bg-emerald-900/20 text-emerald-500'}`}>
                          {signal.source === 'Slack' && <MessageSquare size={20} />}
                          {signal.source === 'Email' && <Mail size={20} />}
                          {signal.source === 'Transcript' && <FileAudio size={20} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-white">{signal.customerName}</span>
                              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{signal.source}</span>
                              <Badge variant={signal.type === 'Silent Killer' ? 'danger' : 'success'}>{signal.type}</Badge>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500">{new Date(signal.detectedAt).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm text-zinc-300 italic font-serif leading-relaxed">"{signal.content}"</p>
                          
                          <div className="mt-4 flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-zinc-500 uppercase">Sentiment</span>
                              <div className="w-32 h-1 bg-zinc-800 rounded-full overflow-hidden flex">
                                <div className={`h-full ${signal.sentiment < 0 ? 'bg-red-500 ml-auto' : 'bg-emerald-500'}`} style={{ width: `${Math.abs(signal.sentiment * 100)}%` }}></div>
                              </div>
                            </div>
                            <button className="ml-auto flex items-center gap-1 text-[10px] font-mono uppercase text-orange-500 hover:text-orange-400 transition-colors">
                              Initiate Save Play <ChevronRight size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer / Status Bar */}
        <footer className="h-10 border-t border-zinc-800 bg-zinc-950 px-8 flex items-center justify-between text-[9px] font-mono text-zinc-500">
          <div className="flex gap-6">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>SYSTEMS NOMINAL</span>
            </div>
            <span>LATENCY: 14ms</span>
            <span>UPTIME: 99.99%</span>
          </div>
          <div className="flex gap-4">
            <span>© 2026 REPLEXUS CUSTOMER SUCCESS AUTOMATION</span>
            <span className="text-zinc-700">|</span>
            <span className="hover:text-zinc-300 cursor-pointer">DOCUMENTATION</span>
            <span className="hover:text-zinc-300 cursor-pointer">API STATUS</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
