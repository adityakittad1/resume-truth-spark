/**
 * Resumate Resume Analyzer - Core Scoring Engine
 * 
 * Philosophy: Claims without evidence = penalties
 * Scoring is strict, evidence-based, and penalizes keyword stuffing
 */

import { 
  AnalysisResult, 
  AnalysisRequest, 
  ComponentScore, 
  PenaltyInfo,
  AllRoles,
  RoleMode 
} from "@/types/analyzer";

// Role-specific requirements for accurate matching
const ROLE_REQUIREMENTS: Record<AllRoles, {
  mandatorySkills: string[];
  optionalSkills: string[];
  projectIndicators: string[];
  experienceKeywords: string[];
}> = {
  "frontend-developer": {
    mandatorySkills: ["html", "css", "javascript", "react", "responsive"],
    optionalSkills: ["typescript", "vue", "angular", "tailwind", "sass", "webpack", "git"],
    projectIndicators: ["website", "web app", "ui", "frontend", "landing page", "dashboard"],
    experienceKeywords: ["developed", "built", "designed", "implemented", "created"],
  },
  "backend-fullstack": {
    mandatorySkills: ["api", "database", "server", "backend"],
    optionalSkills: ["node", "python", "java", "sql", "mongodb", "express", "django", "rest", "graphql"],
    projectIndicators: ["api", "server", "backend", "database", "microservice", "crud"],
    experienceKeywords: ["architected", "implemented", "deployed", "integrated", "scaled"],
  },
  "data-analyst": {
    mandatorySkills: ["sql", "excel", "data", "analysis"],
    optionalSkills: ["python", "tableau", "power bi", "statistics", "visualization", "pandas", "r"],
    projectIndicators: ["analysis", "dashboard", "report", "visualization", "insights", "metrics"],
    experienceKeywords: ["analyzed", "visualized", "reported", "identified", "improved"],
  },
  "ai-ml-intern": {
    mandatorySkills: ["python", "machine learning", "data"],
    optionalSkills: ["tensorflow", "pytorch", "sklearn", "deep learning", "nlp", "neural network", "pandas", "numpy"],
    projectIndicators: ["model", "prediction", "classification", "training", "dataset", "accuracy"],
    experienceKeywords: ["trained", "developed", "implemented", "achieved", "improved accuracy"],
  },
  "cloud-devops": {
    mandatorySkills: ["cloud", "linux", "docker"],
    optionalSkills: ["aws", "azure", "gcp", "kubernetes", "ci/cd", "terraform", "jenkins", "ansible"],
    projectIndicators: ["deployment", "pipeline", "infrastructure", "automation", "container"],
    experienceKeywords: ["deployed", "automated", "configured", "managed", "optimized"],
  },
  // Extended roles with basic requirements
  "product-manager": {
    mandatorySkills: ["product", "roadmap", "stakeholder"],
    optionalSkills: ["agile", "scrum", "jira", "analytics", "user research", "a/b testing"],
    projectIndicators: ["launched", "product", "feature", "user", "growth", "metrics"],
    experienceKeywords: ["led", "managed", "launched", "defined", "prioritized"],
  },
  "ui-ux-designer": {
    mandatorySkills: ["design", "user experience", "prototype"],
    optionalSkills: ["figma", "sketch", "adobe xd", "user research", "wireframe", "usability"],
    projectIndicators: ["design", "prototype", "wireframe", "user flow", "redesign"],
    experienceKeywords: ["designed", "created", "researched", "improved", "tested"],
  },
  "cybersecurity": {
    mandatorySkills: ["security", "vulnerability", "network"],
    optionalSkills: ["penetration testing", "firewall", "encryption", "compliance", "siem", "nist"],
    projectIndicators: ["audit", "security", "vulnerability", "penetration", "compliance"],
    experienceKeywords: ["secured", "audited", "identified", "remediated", "implemented"],
  },
  "qa-engineer": {
    mandatorySkills: ["testing", "quality", "automation"],
    optionalSkills: ["selenium", "jest", "cypress", "jira", "test cases", "regression"],
    projectIndicators: ["test", "automation", "bug", "quality", "coverage"],
    experienceKeywords: ["tested", "automated", "identified", "verified", "improved quality"],
  },
  "mobile-developer": {
    mandatorySkills: ["mobile", "app", "ios", "android"],
    optionalSkills: ["react native", "flutter", "swift", "kotlin", "java"],
    projectIndicators: ["app", "mobile", "ios", "android", "playstore", "appstore"],
    experienceKeywords: ["developed", "published", "built", "integrated", "optimized"],
  },
  "database-admin": {
    mandatorySkills: ["database", "sql", "performance"],
    optionalSkills: ["postgresql", "mysql", "mongodb", "oracle", "backup", "replication"],
    projectIndicators: ["database", "migration", "optimization", "backup", "schema"],
    experienceKeywords: ["managed", "optimized", "migrated", "designed", "maintained"],
  },
  "technical-writer": {
    mandatorySkills: ["documentation", "technical writing", "api"],
    optionalSkills: ["markdown", "confluence", "git", "swagger", "user guide"],
    projectIndicators: ["documentation", "guide", "api docs", "readme", "tutorial"],
    experienceKeywords: ["documented", "wrote", "created", "maintained", "reviewed"],
  },
  "systems-analyst": {
    mandatorySkills: ["requirements", "analysis", "system design"],
    optionalSkills: ["uml", "sql", "business analysis", "workflow", "stakeholder"],
    projectIndicators: ["requirements", "analysis", "system", "workflow", "specification"],
    experienceKeywords: ["analyzed", "designed", "gathered", "defined", "documented"],
  },
  "network-engineer": {
    mandatorySkills: ["network", "tcp/ip", "routing"],
    optionalSkills: ["cisco", "firewall", "vpn", "dns", "load balancer", "monitoring"],
    projectIndicators: ["network", "infrastructure", "migration", "monitoring", "security"],
    experienceKeywords: ["configured", "maintained", "troubleshot", "designed", "implemented"],
  },
  "blockchain-developer": {
    mandatorySkills: ["blockchain", "smart contract", "web3"],
    optionalSkills: ["solidity", "ethereum", "defi", "nft", "cryptography"],
    projectIndicators: ["smart contract", "dapp", "token", "blockchain", "defi"],
    experienceKeywords: ["developed", "deployed", "audited", "integrated", "built"],
  },
  "game-developer": {
    mandatorySkills: ["game", "development", "programming"],
    optionalSkills: ["unity", "unreal", "c++", "c#", "game design", "3d"],
    projectIndicators: ["game", "gameplay", "engine", "multiplayer", "mobile game"],
    experienceKeywords: ["developed", "designed", "implemented", "optimized", "published"],
  },
  "embedded-systems": {
    mandatorySkills: ["embedded", "microcontroller", "firmware"],
    optionalSkills: ["c", "c++", "rtos", "iot", "arduino", "raspberry pi"],
    projectIndicators: ["firmware", "embedded", "iot", "sensor", "microcontroller"],
    experienceKeywords: ["developed", "programmed", "debugged", "optimized", "integrated"],
  },
};

/**
 * Main analysis function - processes resume text and returns structured results
 */
export function analyzeResume(request: AnalysisRequest): AnalysisResult {
  const { resumeText, role, roleMode } = request;
  const text = resumeText.toLowerCase();
  const requirements = ROLE_REQUIREMENTS[role];

  // Component scores
  const coreSkills = scoreCoreSkills(text, requirements);
  const projectQuality = scoreProjectQuality(text, requirements);
  const experienceDepth = scoreExperienceDepth(text, requirements);
  const resumeStructure = scoreResumeStructure(text);

  // Calculate raw score
  const rawScore = 
    coreSkills.score + 
    projectQuality.score + 
    experienceDepth.score + 
    resumeStructure.score;

  // Apply penalties
  const penalties = calculatePenalties(text, requirements, { coreSkills, projectQuality, experienceDepth });
  
  let finalScore = rawScore;
  penalties.forEach((penalty) => {
    if (penalty.applied) {
      finalScore *= penalty.multiplier;
    }
  });

  // Apply hard caps based on evidence
  finalScore = applyHardCaps(finalScore, { coreSkills, projectQuality, experienceDepth });

  // Ensure score is within bounds
  finalScore = Math.round(Math.max(0, Math.min(100, finalScore)));

  // Calculate percentages for display
  const skillMatchPercent = Math.round((coreSkills.score / coreSkills.maxScore) * 100);
  const projectRelevancePercent = Math.round((projectQuality.score / projectQuality.maxScore) * 100);
  const resumeDepthPercent = Math.round(
    ((experienceDepth.score + resumeStructure.score) / 
     (experienceDepth.maxScore + resumeStructure.maxScore)) * 100
  );

  // Generate strengths and improvements (always non-empty)
  const strengths = generateStrengths(
    { coreSkills, projectQuality, experienceDepth, resumeStructure },
    role
  );
  const improvements = generateImprovements(
    { coreSkills, projectQuality, experienceDepth, resumeStructure },
    requirements,
    text
  );

  // Determine confidence based on text quality
  const confidence = determineConfidence(text, roleMode);

  return {
    overallScore: finalScore,
    skillMatchPercent,
    projectRelevancePercent,
    resumeDepthPercent,
    strengths,
    improvements,
    breakdown: {
      coreSkills,
      projectQuality,
      experienceDepth,
      resumeStructure,
    },
    penalties,
    metadata: {
      role,
      roleMode,
      analyzedAt: new Date().toISOString(),
      confidence,
    },
  };
}

/**
 * Score core skills with evidence validation
 * Max: 35 points
 */
function scoreCoreSkills(
  text: string, 
  requirements: typeof ROLE_REQUIREMENTS[AllRoles]
): ComponentScore {
  const maxScore = 35;
  let score = 0;
  const foundMandatory: string[] = [];
  const foundOptional: string[] = [];

  // Check mandatory skills with context window (200 chars for better evidence)
  requirements.mandatorySkills.forEach((skill) => {
    const index = text.indexOf(skill);
    if (index !== -1) {
      // Check for context around the skill (evidence of usage)
      const contextStart = Math.max(0, index - 100);
      const contextEnd = Math.min(text.length, index + skill.length + 100);
      const context = text.slice(contextStart, contextEnd);
      
      // Look for action verbs or project context
      const hasEvidence = requirements.experienceKeywords.some((kw) => context.includes(kw)) ||
                         requirements.projectIndicators.some((pi) => context.includes(pi));
      
      if (hasEvidence) {
        score += 7; // Full points for evidenced skill
        foundMandatory.push(skill);
      } else {
        score += 3; // Partial points for mentioned but not evidenced
      }
    }
  });

  // Cap mandatory skill score
  score = Math.min(score, 21); // 3 mandatory skills * 7 points

  // Check optional skills
  requirements.optionalSkills.forEach((skill) => {
    if (text.includes(skill)) {
      score += 2;
      foundOptional.push(skill);
    }
  });

  // Cap optional skill score
  score = Math.min(score, maxScore);

  const details = foundMandatory.length > 0 
    ? `Found ${foundMandatory.length} core skills with evidence, ${foundOptional.length} additional skills`
    : "No mandatory skills found with clear evidence";

  return { score, maxScore, details };
}

/**
 * Score project quality - looking for depth, not just mentions
 * Max: 30 points
 */
function scoreProjectQuality(
  text: string,
  requirements: typeof ROLE_REQUIREMENTS[AllRoles]
): ComponentScore {
  const maxScore = 30;
  let score = 0;

  // Check for project section existence
  const hasProjectSection = /project|portfolio|work/i.test(text);
  if (!hasProjectSection) {
    return { score: 0, maxScore, details: "No project section detected" };
  }

  // Count project indicators
  let projectCount = 0;
  requirements.projectIndicators.forEach((indicator) => {
    const regex = new RegExp(indicator, "gi");
    const matches = text.match(regex);
    if (matches) {
      projectCount += matches.length;
    }
  });

  // Base score for having projects
  if (projectCount >= 3) score += 10;
  else if (projectCount >= 1) score += 5;

  // Check for quantification (numbers, percentages, metrics)
  const quantificationPatterns = [
    /\d+%/g,           // Percentages
    /\d+\s*(users?|customers?|downloads?)/gi,  // User counts
    /\d+x\s*(faster|improvement|increase)/gi,  // Multipliers
    /reduced.*\d+/gi,  // Reduction metrics
    /increased.*\d+/gi, // Increase metrics
    /\$\d+/g,          // Dollar amounts
  ];

  let quantificationCount = 0;
  quantificationPatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) quantificationCount += matches.length;
  });

  if (quantificationCount >= 3) score += 15;
  else if (quantificationCount >= 1) score += 8;

  // Check for technology stack mentions in projects
  const techStackPattern = /using|with|built with|tech stack|technologies/gi;
  if (techStackPattern.test(text)) {
    score += 5;
  }

  score = Math.min(score, maxScore);

  const details = `${projectCount} project indicators, ${quantificationCount} quantified achievements`;
  return { score, maxScore, details };
}

/**
 * Score experience depth
 * Max: 20 points
 */
function scoreExperienceDepth(
  text: string,
  requirements: typeof ROLE_REQUIREMENTS[AllRoles]
): ComponentScore {
  const maxScore = 20;
  let score = 0;

  // Check for experience/work section
  const hasExperienceSection = /experience|work history|employment|internship/i.test(text);
  if (!hasExperienceSection) {
    return { score: 3, maxScore, details: "No clear experience section" };
  }

  // Count action verbs
  let actionVerbCount = 0;
  requirements.experienceKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    const matches = text.match(regex);
    if (matches) actionVerbCount += matches.length;
  });

  if (actionVerbCount >= 5) score += 10;
  else if (actionVerbCount >= 3) score += 6;
  else if (actionVerbCount >= 1) score += 3;

  // Check for dates (indicates real experience)
  const datePatterns = [
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{4}/gi,
    /\d{4}\s*-\s*(present|\d{4})/gi,
    /\d{1,2}\/\d{4}/gi,
  ];

  let hasDate = false;
  datePatterns.forEach((pattern) => {
    if (pattern.test(text)) hasDate = true;
  });

  if (hasDate) score += 5;

  // Check for company/organization names (capitalized words)
  const orgPattern = /\bat\s+[A-Z][a-zA-Z]+/g;
  const orgMatches = text.match(orgPattern);
  if (orgMatches && orgMatches.length >= 1) score += 5;

  score = Math.min(score, maxScore);

  const details = `${actionVerbCount} action verbs, ${hasDate ? "dates present" : "no dates found"}`;
  return { score, maxScore, details };
}

/**
 * Score resume structure and completeness
 * Max: 15 points
 */
function scoreResumeStructure(text: string): ComponentScore {
  const maxScore = 15;
  let score = 0;

  // Essential sections
  const sections = [
    { pattern: /education|university|degree|bachelor|master/i, points: 3 },
    { pattern: /skills|technologies|expertise/i, points: 3 },
    { pattern: /experience|work|employment/i, points: 3 },
    { pattern: /project|portfolio/i, points: 3 },
    { pattern: /contact|email|phone|linkedin|github/i, points: 3 },
  ];

  sections.forEach(({ pattern, points }) => {
    if (pattern.test(text)) score += points;
  });

  score = Math.min(score, maxScore);

  const sectionCount = sections.filter(({ pattern }) => pattern.test(text)).length;
  const details = `${sectionCount}/5 essential sections present`;

  return { score, maxScore, details };
}

/**
 * Calculate penalties for inconsistencies and red flags
 */
function calculatePenalties(
  text: string,
  requirements: typeof ROLE_REQUIREMENTS[AllRoles],
  scores: { coreSkills: ComponentScore; projectQuality: ComponentScore; experienceDepth: ComponentScore }
): PenaltyInfo[] {
  const penalties: PenaltyInfo[] = [];

  // Penalty: Skills mentioned but not evidenced in projects
  const skillsMentioned = requirements.mandatorySkills.filter((s) => text.includes(s)).length;
  const projectEvidence = requirements.projectIndicators.filter((p) => text.includes(p)).length;
  
  if (skillsMentioned > 0 && projectEvidence === 0) {
    penalties.push({
      reason: "Skills listed but no project evidence",
      multiplier: 0.75,
      applied: true,
    });
  } else {
    penalties.push({
      reason: "Skills listed but no project evidence",
      multiplier: 0.75,
      applied: false,
    });
  }

  // Penalty: Keyword stuffing detection
  const wordCount = text.split(/\s+/).length;
  const skillMentions = requirements.mandatorySkills.reduce((count, skill) => {
    const regex = new RegExp(skill, "gi");
    const matches = text.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);

  if (skillMentions > 0 && skillMentions / wordCount > 0.05) {
    penalties.push({
      reason: "Potential keyword stuffing detected",
      multiplier: 0.7,
      applied: true,
    });
  } else {
    penalties.push({
      reason: "Potential keyword stuffing detected",
      multiplier: 0.7,
      applied: false,
    });
  }

  // Penalty: No quantification in achievements
  const hasQuantification = /\d+%|\d+\s*(users?|increase|decrease|improvement)/i.test(text);
  if (!hasQuantification && scores.projectQuality.score > 0) {
    penalties.push({
      reason: "No quantified achievements",
      multiplier: 0.85,
      applied: true,
    });
  } else {
    penalties.push({
      reason: "No quantified achievements",
      multiplier: 0.85,
      applied: false,
    });
  }

  // Penalty: Very short resume
  if (wordCount < 100) {
    penalties.push({
      reason: "Resume too short (< 100 words)",
      multiplier: 0.6,
      applied: true,
    });
  } else {
    penalties.push({
      reason: "Resume too short (< 100 words)",
      multiplier: 0.6,
      applied: false,
    });
  }

  return penalties;
}

/**
 * Apply hard caps to prevent inflated scores
 */
function applyHardCaps(
  score: number,
  scores: { coreSkills: ComponentScore; projectQuality: ComponentScore; experienceDepth: ComponentScore }
): number {
  // Hard cap: Cannot score above 55 without project evidence
  if (scores.projectQuality.score < 10) {
    score = Math.min(score, 55);
  }

  // Hard cap: Cannot score above 70 without quantified achievements
  if (scores.projectQuality.score < 15) {
    score = Math.min(score, 70);
  }

  // Hard cap: Cannot score above 60 without experience section
  if (scores.experienceDepth.score < 5) {
    score = Math.min(score, 60);
  }

  return score;
}

/**
 * Generate strengths based on scores (always returns at least one)
 */
function generateStrengths(
  scores: { 
    coreSkills: ComponentScore; 
    projectQuality: ComponentScore; 
    experienceDepth: ComponentScore;
    resumeStructure: ComponentScore;
  },
  role: AllRoles
): string[] {
  const strengths: string[] = [];

  if (scores.coreSkills.score >= 20) {
    strengths.push("Strong alignment with required technical skills");
  } else if (scores.coreSkills.score >= 10) {
    strengths.push("Good foundation of relevant skills");
  }

  if (scores.projectQuality.score >= 20) {
    strengths.push("Well-documented projects with quantified impact");
  } else if (scores.projectQuality.score >= 10) {
    strengths.push("Project experience demonstrates practical application");
  }

  if (scores.experienceDepth.score >= 15) {
    strengths.push("Clear, action-oriented experience descriptions");
  }

  if (scores.resumeStructure.score >= 12) {
    strengths.push("Well-structured resume with all essential sections");
  }

  // Always return at least one strength
  if (strengths.length === 0) {
    strengths.push("Resume submitted for analysis - room for improvement identified");
  }

  return strengths;
}

/**
 * Generate improvements based on gaps (always returns at least one)
 */
function generateImprovements(
  scores: { 
    coreSkills: ComponentScore; 
    projectQuality: ComponentScore; 
    experienceDepth: ComponentScore;
    resumeStructure: ComponentScore;
  },
  requirements: typeof ROLE_REQUIREMENTS[AllRoles],
  text: string
): string[] {
  const improvements: string[] = [];

  if (scores.coreSkills.score < 15) {
    const missing = requirements.mandatorySkills.filter((s) => !text.includes(s));
    if (missing.length > 0) {
      improvements.push(`Add experience with: ${missing.slice(0, 3).join(", ")}`);
    }
  }

  if (scores.projectQuality.score < 15) {
    improvements.push("Add 2-3 relevant projects with measurable outcomes");
  }

  if (!/\d+%|\d+\s*(users?|increase)/i.test(text)) {
    improvements.push("Quantify achievements with numbers, percentages, or metrics");
  }

  if (scores.experienceDepth.score < 10) {
    improvements.push("Use action verbs and add dates to experience entries");
  }

  if (scores.resumeStructure.score < 10) {
    improvements.push("Ensure all sections are clearly labeled (Skills, Projects, Experience)");
  }

  // Always return at least one improvement
  if (improvements.length === 0) {
    improvements.push("Consider adding more specific examples to strengthen your profile");
  }

  return improvements;
}

/**
 * Determine analysis confidence level
 */
function determineConfidence(text: string, roleMode: RoleMode): "high" | "medium" | "low" {
  const wordCount = text.split(/\s+/).length;
  
  if (wordCount < 50) return "low";
  if (roleMode === "extended") return "medium";
  if (wordCount > 200) return "high";
  return "medium";
}
