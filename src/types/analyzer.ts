/**
 * Resumate Analyzer Type Definitions
 * Central location for all analysis-related types
 */

// Role categories for the two-tier system
export type RoleMode = "core" | "extended";

// Core roles - well-tested, recommended for most users
export type CoreRole = 
  | "frontend-developer"
  | "fullstack-developer"
  | "backend-fullstack"
  | "data-analyst"
  | "ai-ml-intern"
  | "cloud-devops";

// Extended roles - all other roles, advanced users only
export type ExtendedRole =
  | "product-manager"
  | "ui-ux-designer"
  | "cybersecurity"
  | "qa-engineer"
  | "mobile-developer"
  | "database-admin"
  | "technical-writer"
  | "systems-analyst"
  | "network-engineer"
  | "blockchain-developer"
  | "game-developer"
  | "embedded-systems";

export type AllRoles = CoreRole | ExtendedRole;

// Role display information
export interface RoleInfo {
  id: AllRoles;
  label: string;
  description: string;
  isCore: boolean;
}

// Analysis result structure - matches what the analyzer returns
export interface AnalysisResult {
  overallScore: number;
  skillMatchPercent: number;
  projectRelevancePercent: number;
  resumeDepthPercent: number;
  strengths: string[];
  improvements: string[];
  breakdown: {
    coreSkills: ComponentScore;
    projectQuality: ComponentScore;
    experienceDepth: ComponentScore;
    resumeStructure: ComponentScore;
  };
  penalties: PenaltyInfo[];
  metadata: {
    role: AllRoles;
    roleMode: RoleMode;
    analyzedAt: string;
    confidence: "high" | "medium" | "low";
  };
}

export interface ComponentScore {
  score: number;
  maxScore: number;
  details: string;
}

export interface PenaltyInfo {
  reason: string;
  multiplier: number; // Legacy field, kept for compatibility
  deduction: number;  // Actual points deducted
  applied: boolean;
}

// Analysis request structure
export interface AnalysisRequest {
  resumeText: string;
  role: AllRoles;
  roleMode: RoleMode;
}

// Feedback form data
export interface FeedbackData {
  message: string;
  rating?: number;
  pageName: string;
  timestamp: string;
}
