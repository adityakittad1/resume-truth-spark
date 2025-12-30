/**
 * Resumate Resume Analyzer - Core Scoring Engine v2.0
 * 
 * Philosophy: Evidence-based, fair, and calibrated
 * - Good resumes: 65-85%
 * - Average resumes: 45-65%
 * - Weak resumes: 20-45%
 * - Keyword-stuffed: Penalized appropriately
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
  "fullstack-developer": {
    mandatorySkills: ["javascript", "react", "node", "database", "api"],
    optionalSkills: ["typescript", "python", "sql", "mongodb", "express", "next.js", "graphql", "docker", "git"],
    projectIndicators: ["full stack", "web app", "api", "frontend", "backend", "database", "deployed"],
    experienceKeywords: ["built", "developed", "deployed", "integrated", "architected", "implemented"],
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

  // Component scores (max 100 total)
  const coreSkills = scoreCoreSkills(text, requirements);
  const projectQuality = scoreProjectQuality(text, requirements);
  const experienceDepth = scoreExperienceDepth(text, requirements);
  const resumeStructure = scoreResumeStructure(text);

  // Calculate raw score (sum of components)
  const rawScore = 
    coreSkills.score + 
    projectQuality.score + 
    experienceDepth.score + 
    resumeStructure.score;

  // Calculate penalties (ADDITIVE, not multiplicative - fairer approach)
  const penalties = calculatePenalties(text, requirements, { coreSkills, projectQuality, experienceDepth });
  
  let totalPenalty = 0;
  penalties.forEach((penalty) => {
    if (penalty.applied) {
      totalPenalty += penalty.deduction;
    }
  });

  // Apply penalties (subtractive approach)
  let finalScore = rawScore - totalPenalty;

  // Apply soft caps based on evidence (less harsh than before)
  finalScore = applySoftCaps(finalScore, { coreSkills, projectQuality, experienceDepth });

  // Ensure score is within bounds
  finalScore = Math.round(Math.max(0, Math.min(100, finalScore)));

  // Calculate percentages for display
  const skillMatchPercent = Math.round((coreSkills.score / coreSkills.maxScore) * 100);
  const projectRelevancePercent = Math.round((projectQuality.score / projectQuality.maxScore) * 100);
  const resumeDepthPercent = Math.round(
    ((experienceDepth.score + resumeStructure.score) / 
     (experienceDepth.maxScore + resumeStructure.maxScore)) * 100
  );

  // Generate strengths and improvements
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
 * Score core skills - balanced approach
 * Max: 35 points
 * 
 * Changes from v1:
 * - Skills listed get base credit (recruiters value skill mentions)
 * - Bonus for evidence, not penalty for lacking it
 * - Higher cap for mandatory skills
 */
function scoreCoreSkills(
  text: string, 
  requirements: typeof ROLE_REQUIREMENTS[AllRoles]
): ComponentScore {
  const maxScore = 35;
  let score = 0;
  const foundMandatory: string[] = [];
  const foundOptional: string[] = [];

  // Check mandatory skills
  requirements.mandatorySkills.forEach((skill) => {
    if (text.includes(skill)) {
      // Base points for having the skill
      score += 4;
      foundMandatory.push(skill);
      
      // Bonus for evidence (action verbs or project context nearby)
      const index = text.indexOf(skill);
      const contextStart = Math.max(0, index - 150);
      const contextEnd = Math.min(text.length, index + skill.length + 150);
      const context = text.slice(contextStart, contextEnd);
      
      const hasEvidence = requirements.experienceKeywords.some((kw) => context.includes(kw)) ||
                         requirements.projectIndicators.some((pi) => context.includes(pi));
      
      if (hasEvidence) {
        score += 2; // Bonus for evidenced skill
      }
    }
  });

  // Cap mandatory skill score at 25 (allows more skills to count)
  score = Math.min(score, 25);

  // Check optional skills (1.5 points each, up to 10 points)
  let optionalScore = 0;
  requirements.optionalSkills.forEach((skill) => {
    if (text.includes(skill)) {
      optionalScore += 1.5;
      foundOptional.push(skill);
    }
  });
  score += Math.min(optionalScore, 10);

  score = Math.min(score, maxScore);

  const details = foundMandatory.length > 0 
    ? `Found ${foundMandatory.length} core skills, ${foundOptional.length} additional skills`
    : "Limited mandatory skills detected";

  return { score: Math.round(score), maxScore, details };
}

/**
 * Score project quality - looking for depth, not just mentions
 * Max: 30 points
 * 
 * Changes from v1:
 * - More generous base scoring
 * - Better pattern matching for project work
 */
function scoreProjectQuality(
  text: string,
  requirements: typeof ROLE_REQUIREMENTS[AllRoles]
): ComponentScore {
  const maxScore = 30;
  let score = 0;

  // Check for project section existence (broader patterns)
  const hasProjectSection = /project|portfolio|work|built|developed|created/i.test(text);
  if (!hasProjectSection) {
    return { score: 3, maxScore, details: "No clear project work detected" };
  }

  // Base score for having project-related content
  score += 5;

  // Count project indicators
  let projectIndicatorCount = 0;
  requirements.projectIndicators.forEach((indicator) => {
    const regex = new RegExp(indicator, "gi");
    const matches = text.match(regex);
    if (matches) {
      projectIndicatorCount += matches.length;
    }
  });

  // Score based on project indicators (more generous)
  if (projectIndicatorCount >= 5) score += 10;
  else if (projectIndicatorCount >= 3) score += 7;
  else if (projectIndicatorCount >= 1) score += 4;

  // Check for quantification (numbers, percentages, metrics)
  const quantificationPatterns = [
    /\d+%/g,
    /\d+\s*(users?|customers?|downloads?|visitors?)/gi,
    /\d+x\s*(faster|improvement|increase|better)/gi,
    /reduced.*\d+/gi,
    /increased.*\d+/gi,
    /improved.*\d+/gi,
    /\$[\d,]+/g,
    /\d+\s*(projects?|applications?|features?)/gi,
  ];

  let quantificationCount = 0;
  quantificationPatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) quantificationCount += matches.length;
  });

  // Quantification scoring (key differentiator)
  if (quantificationCount >= 4) score += 10;
  else if (quantificationCount >= 2) score += 7;
  else if (quantificationCount >= 1) score += 4;

  // Check for technology stack mentions in projects
  const techStackPattern = /using|with|built with|tech stack|technologies|stack/gi;
  if (techStackPattern.test(text)) {
    score += 3;
  }

  // GitHub/Portfolio links are a strong signal
  if (/github\.com|gitlab\.com|portfolio|live demo|deployed/i.test(text)) {
    score += 2;
  }

  score = Math.min(score, maxScore);

  const details = `${projectIndicatorCount} project signals, ${quantificationCount} metrics`;
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

  // Check for experience/work section (broader patterns for freshers)
  const hasExperienceSection = /experience|work|employment|internship|project|freelance|volunteer/i.test(text);
  if (!hasExperienceSection) {
    return { score: 4, maxScore, details: "No experience section detected" };
  }

  // Base score for having experience section
  score += 4;

  // Count action verbs (important for strong writing)
  let actionVerbCount = 0;
  const commonActionVerbs = [
    ...requirements.experienceKeywords,
    "led", "managed", "created", "improved", "launched", "designed", 
    "built", "developed", "implemented", "achieved", "delivered"
  ];
  
  commonActionVerbs.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}(ed|ing|s)?\\b`, "gi");
    const matches = text.match(regex);
    if (matches) actionVerbCount += matches.length;
  });

  // Score for action verbs
  if (actionVerbCount >= 8) score += 8;
  else if (actionVerbCount >= 5) score += 6;
  else if (actionVerbCount >= 3) score += 4;
  else if (actionVerbCount >= 1) score += 2;

  // Check for dates (indicates real experience)
  const datePatterns = [
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{2,4}/gi,
    /\d{4}\s*[-–]\s*(present|\d{4})/gi,
    /\d{1,2}\/\d{2,4}/gi,
    /\b\d{4}\b/g, // Just years
  ];

  let hasDate = false;
  datePatterns.forEach((pattern) => {
    if (pattern.test(text)) hasDate = true;
  });

  if (hasDate) score += 4;

  // Check for organization/company mentions
  if (/\bat\s+[A-Z][a-zA-Z]+|internship at|worked at|company|university|college/gi.test(text)) {
    score += 4;
  }

  score = Math.min(score, maxScore);

  const details = `${actionVerbCount} action verbs, ${hasDate ? "dates present" : "no dates"}`;
  return { score, maxScore, details };
}

/**
 * Score resume structure and completeness
 * Max: 15 points
 */
function scoreResumeStructure(text: string): ComponentScore {
  const maxScore = 15;
  let score = 0;

  // Essential sections (3 points each)
  const sections = [
    { pattern: /education|university|degree|bachelor|master|b\.?tech|b\.?e\.?|m\.?tech/i, points: 3 },
    { pattern: /skills|technologies|expertise|proficient|competenc/i, points: 3 },
    { pattern: /experience|work|employment|internship|project/i, points: 3 },
    { pattern: /contact|email|phone|linkedin|github|@/i, points: 3 },
  ];

  sections.forEach(({ pattern, points }) => {
    if (pattern.test(text)) score += points;
  });

  // Bonus for comprehensive resume
  if (/objective|summary|about|profile/i.test(text)) {
    score += 2;
  }

  // Bonus for certifications or achievements
  if (/certification|certified|award|achievement|honor|publication/i.test(text)) {
    score += 1;
  }

  score = Math.min(score, maxScore);

  const sectionCount = sections.filter(({ pattern }) => pattern.test(text)).length;
  const details = `${sectionCount}/4 key sections present`;

  return { score, maxScore, details };
}

/**
 * Calculate penalties - ADDITIVE approach (fairer than multiplicative)
 * Total max penalty: 25 points
 */
function calculatePenalties(
  text: string,
  requirements: typeof ROLE_REQUIREMENTS[AllRoles],
  scores: { coreSkills: ComponentScore; projectQuality: ComponentScore; experienceDepth: ComponentScore }
): PenaltyInfo[] {
  const penalties: PenaltyInfo[] = [];
  const wordCount = text.split(/\s+/).length;

  // Penalty 1: Skills without ANY project evidence (max -8)
  const skillsMentioned = requirements.mandatorySkills.filter((s) => text.includes(s)).length;
  const hasAnyProject = requirements.projectIndicators.some((p) => text.includes(p));
  
  if (skillsMentioned >= 3 && !hasAnyProject) {
    penalties.push({
      reason: "Skills listed but no project evidence found",
      multiplier: 1, // Legacy field
      deduction: 8,
      applied: true,
    });
  } else {
    penalties.push({
      reason: "Skills listed but no project evidence found",
      multiplier: 1,
      deduction: 8,
      applied: false,
    });
  }

  // Penalty 2: Keyword stuffing detection (max -12)
  const skillMentions = requirements.mandatorySkills.reduce((count, skill) => {
    const regex = new RegExp(skill, "gi");
    const matches = text.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);

  // Stuffing = same skills mentioned way too many times relative to resume length
  const stuffingRatio = wordCount > 0 ? skillMentions / wordCount : 0;
  if (stuffingRatio > 0.08) { // Very aggressive stuffing
    penalties.push({
      reason: "Keyword stuffing detected - skills over-repeated",
      multiplier: 1,
      deduction: 12,
      applied: true,
    });
  } else if (stuffingRatio > 0.05) { // Moderate stuffing
    penalties.push({
      reason: "Potential keyword stuffing detected",
      multiplier: 1,
      deduction: 6,
      applied: true,
    });
  } else {
    penalties.push({
      reason: "Keyword stuffing detected",
      multiplier: 1,
      deduction: 12,
      applied: false,
    });
  }

  // Penalty 3: Very short resume (max -10)
  if (wordCount < 80) {
    penalties.push({
      reason: "Resume too short (< 80 words)",
      multiplier: 1,
      deduction: 10,
      applied: true,
    });
  } else if (wordCount < 120) {
    penalties.push({
      reason: "Resume is brief (< 120 words)",
      multiplier: 1,
      deduction: 5,
      applied: true,
    });
  } else {
    penalties.push({
      reason: "Resume length adequate",
      multiplier: 1,
      deduction: 0,
      applied: false,
    });
  }

  return penalties;
}

/**
 * Apply soft caps - less harsh than hard caps
 * Only applies to extreme cases
 */
function applySoftCaps(
  score: number,
  scores: { coreSkills: ComponentScore; projectQuality: ComponentScore; experienceDepth: ComponentScore }
): number {
  // Soft cap: Without ANY projects, max 65 (still fair for skill-heavy resumes)
  if (scores.projectQuality.score <= 5) {
    score = Math.min(score, 65);
  }

  // Soft cap: Without skills OR projects, max 50
  if (scores.coreSkills.score < 10 && scores.projectQuality.score < 10) {
    score = Math.min(score, 50);
  }

  return score;
}

/**
 * Generate strengths based on scores
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

  if (scores.coreSkills.score >= 25) {
    strengths.push("Excellent alignment with required technical skills");
  } else if (scores.coreSkills.score >= 18) {
    strengths.push("Strong foundation of relevant skills");
  } else if (scores.coreSkills.score >= 12) {
    strengths.push("Good coverage of core skills");
  }

  if (scores.projectQuality.score >= 22) {
    strengths.push("Well-documented projects with quantified impact");
  } else if (scores.projectQuality.score >= 15) {
    strengths.push("Solid project experience demonstrates practical skills");
  } else if (scores.projectQuality.score >= 10) {
    strengths.push("Project work shows hands-on experience");
  }

  if (scores.experienceDepth.score >= 15) {
    strengths.push("Clear, action-oriented experience descriptions");
  } else if (scores.experienceDepth.score >= 10) {
    strengths.push("Experience section well-structured");
  }

  if (scores.resumeStructure.score >= 12) {
    strengths.push("Well-organized resume with essential sections");
  }

  // Always return at least one strength
  if (strengths.length === 0) {
    strengths.push("Resume submitted for analysis - areas for growth identified");
  }

  return strengths;
}

/**
 * Generate improvements based on gaps
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

  if (scores.coreSkills.score < 18) {
    const missing = requirements.mandatorySkills.filter((s) => !text.includes(s));
    if (missing.length > 0) {
      improvements.push(`Add experience with: ${missing.slice(0, 3).join(", ")}`);
    }
  }

  if (scores.projectQuality.score < 18) {
    improvements.push("Include 2-3 relevant projects with clear descriptions");
  }

  if (!/\d+%|\d+\s*(users?|increase|improvement)/i.test(text)) {
    improvements.push("Quantify achievements with numbers, percentages, or metrics");
  }

  if (scores.experienceDepth.score < 12) {
    improvements.push("Use strong action verbs (built, developed, led, achieved)");
  }

  if (scores.resumeStructure.score < 10) {
    improvements.push("Ensure clear section labels (Skills, Projects, Experience)");
  }

  if (!/github|portfolio|linkedin/i.test(text)) {
    improvements.push("Add GitHub or portfolio links to showcase your work");
  }

  // Always return at least one improvement
  if (improvements.length === 0) {
    improvements.push("Consider adding more specific examples to further strengthen your profile");
  }

  return improvements.slice(0, 4); // Max 4 improvements
}

/**
 * Determine analysis confidence level
 */
function determineConfidence(text: string, roleMode: RoleMode): "high" | "medium" | "low" {
  const wordCount = text.split(/\s+/).length;
  
  if (wordCount < 50) return "low";
  if (roleMode === "extended") return "medium";
  if (wordCount > 250) return "high";
  return "medium";
}
