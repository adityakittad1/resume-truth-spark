/**
 * Resume Validity Gate - Rule-based, deterministic validation
 * 
 * Ensures only real resumes are analyzed.
 * Rejects: notes, sports lists, random PDFs, timetables, etc.
 */

export interface ResumeValidationResult {
  isValid: boolean;
  confidenceScore: number;
  rejectionReason?: string;
  signals: {
    hasContactInfo: boolean;
    hasDatePatterns: boolean;
    hasActionVerbs: boolean;
    hasExperienceSection: boolean;
    hasEducationSection: boolean;
    hasSkillsSection: boolean;
    hasPersonName: boolean;
    wordCount: number;
    domainNoisePercent: number;
  };
}

// Action verbs commonly found in resumes
const ACTION_VERBS = [
  "worked", "built", "developed", "implemented", "managed", "led", "created",
  "designed", "analyzed", "improved", "achieved", "delivered", "launched",
  "established", "coordinated", "supervised", "trained", "mentored", "optimized",
  "streamlined", "collaborated", "contributed", "maintained", "executed",
  "resolved", "increased", "reduced", "generated", "conducted", "presented",
  "organized", "prepared", "negotiated", "evaluated", "researched", "initiated"
];

// Non-resume domain keywords (academic notes, sports, etc.)
const ACADEMIC_NOISE_TERMS = [
  "chapter", "syllabus", "unit", "subject", "exam", "notes", "lecture",
  "textbook", "module", "semester", "question paper", "marks", "answer",
  "definition", "theorem", "formula", "equation", "diagram", "figure",
  "reference", "bibliography", "index", "contents", "objective", "learning outcomes"
];

const SPORTS_NOISE_TERMS = [
  "team", "squad", "goals", "match", "coach", "player", "tournament",
  "league", "score", "captain", "defender", "striker", "goalkeeper",
  "fixture", "season", "championship", "trophy", "medal", "referee",
  "innings", "wicket", "batting", "bowling", "runs", "overs"
];

const TIMETABLE_NOISE_TERMS = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
  "period", "slot", "schedule", "timetable", "class", "room", "venue",
  "breakfast", "lunch", "dinner", "break", "recess", "assembly"
];

/**
 * Validates whether a document is a real resume
 * Returns validation result with confidence score
 */
export function validateResume(text: string): ResumeValidationResult {
  const lowerText = text.toLowerCase();
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Initialize signals
  const signals = {
    hasContactInfo: false,
    hasDatePatterns: false,
    hasActionVerbs: false,
    hasExperienceSection: false,
    hasEducationSection: false,
    hasSkillsSection: false,
    hasPersonName: false,
    wordCount,
    domainNoisePercent: 0
  };

  // === HARD REJECT CONDITIONS ===

  // 1. Word count check (250-4000 words)
  if (wordCount < 250) {
    return {
      isValid: false,
      confidenceScore: 0,
      rejectionReason: "Document is too short to be a complete resume",
      signals
    };
  }
  
  if (wordCount > 4000) {
    return {
      isValid: false,
      confidenceScore: 0,
      rejectionReason: "Document exceeds typical resume length",
      signals
    };
  }

  // 2. Check for email or phone
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
  signals.hasContactInfo = emailPattern.test(text) || phonePattern.test(text);

  // 3. Check for date/year patterns
  const datePatterns = [
    /\b(19|20)\d{2}\b/g,  // Years like 2018, 2024
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{2,4}/gi,
    /\d{4}\s*[-–—]\s*(present|\d{4})/gi,
    /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/g
  ];
  signals.hasDatePatterns = datePatterns.some(pattern => pattern.test(text));

  // 4. Check for action verbs
  let actionVerbCount = 0;
  ACTION_VERBS.forEach(verb => {
    const regex = new RegExp(`\\b${verb}(s|ed|ing)?\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches) actionVerbCount += matches.length;
  });
  signals.hasActionVerbs = actionVerbCount >= 3;

  // Hard reject: No contact info AND no date patterns
  if (!signals.hasContactInfo && !signals.hasDatePatterns) {
    return {
      isValid: false,
      confidenceScore: 10,
      rejectionReason: "Missing basic resume elements (contact info and dates)",
      signals
    };
  }

  // Hard reject: No action verbs at all
  if (actionVerbCount < 2) {
    return {
      isValid: false,
      confidenceScore: 15,
      rejectionReason: "Document lacks professional action language typical of resumes",
      signals
    };
  }

  // === DOMAIN NOISE DETECTION ===
  const allNoiseTerms = [...ACADEMIC_NOISE_TERMS, ...SPORTS_NOISE_TERMS, ...TIMETABLE_NOISE_TERMS];
  let noiseTermCount = 0;
  
  allNoiseTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}s?\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches) noiseTermCount += matches.length;
  });

  // Calculate noise percentage (relative to total words)
  const noisePercent = (noiseTermCount / wordCount) * 100;
  signals.domainNoisePercent = Math.round(noisePercent * 10) / 10;

  // Hard reject: More than 40% non-resume domain terms
  if (noisePercent > 40) {
    return {
      isValid: false,
      confidenceScore: 20,
      rejectionReason: "Document appears to be notes, schedules, or non-resume content",
      signals
    };
  }

  // === RESUME CONFIDENCE SCORING ===
  let confidenceScore = 0;

  // +20 for email or phone
  if (signals.hasContactInfo) {
    confidenceScore += 20;
  }

  // +10 for likely person name (capitalized words at start or after contact patterns)
  const namePattern = /^[A-Z][a-z]+\s+[A-Z][a-z]+|name:\s*[A-Z][a-z]+\s+[A-Z][a-z]+/m;
  const hasName = namePattern.test(text) || /^[A-Z][A-Z\s]+$/m.test(text.split('\n')[0]);
  signals.hasPersonName = hasName;
  if (hasName) {
    confidenceScore += 10;
  }

  // +20 for experience section
  const experiencePattern = /\b(experience|work history|employment|professional experience|internship|work experience)\b/i;
  signals.hasExperienceSection = experiencePattern.test(text);
  if (signals.hasExperienceSection) {
    confidenceScore += 20;
  }

  // +15 for education section
  const educationPattern = /\b(education|academic|university|college|degree|bachelor|master|b\.?tech|b\.?e\.?|m\.?tech|b\.?sc|m\.?sc|diploma)\b/i;
  signals.hasEducationSection = educationPattern.test(text);
  if (signals.hasEducationSection) {
    confidenceScore += 15;
  }

  // +15 for skills section
  const skillsPattern = /\b(skills|technical skills|technologies|proficient|expertise|competencies|tools)\b/i;
  signals.hasSkillsSection = skillsPattern.test(text);
  if (signals.hasSkillsSection) {
    confidenceScore += 15;
  }

  // +20 for action verbs near roles/projects
  // Check if action verbs appear in context with job-related terms
  const jobContextPattern = /\b(role|position|project|responsibility|duties|intern|developer|engineer|analyst|manager|lead|associate|executive|designer)\b/i;
  const hasJobContext = jobContextPattern.test(text);
  if (signals.hasActionVerbs && hasJobContext) {
    confidenceScore += 20;
  } else if (signals.hasActionVerbs) {
    confidenceScore += 10; // Partial credit for action verbs without clear job context
  }

  // === THRESHOLD CHECK ===
  // Score < 60 → NOT A RESUME
  if (confidenceScore < 60) {
    return {
      isValid: false,
      confidenceScore,
      rejectionReason: "Document lacks sufficient resume characteristics",
      signals
    };
  }

  // Valid resume
  return {
    isValid: true,
    confidenceScore,
    signals
  };
}
