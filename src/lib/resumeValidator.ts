/**
 * Resume Validity Gate - Rule-based, deterministic validation
 * 
 * Ensures only real resumes are analyzed.
 * Rejects: notes, sports lists, random PDFs, timetables, etc.
 * 
 * VALIDATION RULES:
 * 1. Must have AT LEAST 2 core sections (Experience, Education, Skills, Projects, Certifications)
 * 2. Must have AT LEAST 1 contact identifier (email, phone, LinkedIn/GitHub, or name)
 */

export interface ResumeValidationResult {
  isValid: boolean;
  rejectionReason?: string;
  detectedSections: string[];
  detectedIdentifiers: string[];
}

// Core resume sections (must have at least 2)
const SECTION_PATTERNS: { name: string; pattern: RegExp }[] = [
  { 
    name: "Experience", 
    pattern: /\b(experience|work\s*experience|employment|work\s*history|professional\s*experience|internship|career\s*history)\b/i 
  },
  { 
    name: "Education", 
    pattern: /\b(education|academic|qualification|university|college|degree|bachelor|master|b\.?tech|b\.?e\.?|m\.?tech|m\.?e\.?|b\.?sc|m\.?sc|b\.?a\.?|m\.?a\.?|ph\.?d|diploma|schooling|12th|10th|hsc|ssc)\b/i 
  },
  { 
    name: "Skills", 
    pattern: /\b(skills|technical\s*skills|core\s*competencies|technologies|proficiencies|expertise|competencies|tools|programming\s*languages)\b/i 
  },
  { 
    name: "Projects", 
    pattern: /\b(projects|personal\s*projects|academic\s*projects|key\s*projects|portfolio)\b/i 
  },
  { 
    name: "Certifications", 
    pattern: /\b(certifications?|certificates?|licensed?|accreditations?|credentials?|professional\s*development)\b/i 
  }
];

// Contact identifiers (must have at least 1)
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_PATTERN = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
const LINKEDIN_PATTERN = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
const GITHUB_PATTERN = /github\.com\/[a-zA-Z0-9_-]+/i;
// Name detection: First line or lines with capitalized words (2+ words, proper case)
const NAME_PATTERN = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\s*$/m;

/**
 * Validates whether a document is a real resume
 * Uses strict deterministic rules - no guessing
 */
export function validateResume(text: string): ResumeValidationResult {
  const detectedSections: string[] = [];
  const detectedIdentifiers: string[] = [];

  // === DETECT CORE SECTIONS ===
  SECTION_PATTERNS.forEach(({ name, pattern }) => {
    if (pattern.test(text)) {
      detectedSections.push(name);
    }
  });

  // === DETECT CONTACT IDENTIFIERS ===
  if (EMAIL_PATTERN.test(text)) {
    detectedIdentifiers.push("Email");
  }
  if (PHONE_PATTERN.test(text)) {
    detectedIdentifiers.push("Phone");
  }
  if (LINKEDIN_PATTERN.test(text)) {
    detectedIdentifiers.push("LinkedIn");
  }
  if (GITHUB_PATTERN.test(text)) {
    detectedIdentifiers.push("GitHub");
  }
  
  // Check for candidate name (typically at top of document)
  const firstLines = text.split('\n').slice(0, 5).join('\n');
  if (NAME_PATTERN.test(firstLines)) {
    detectedIdentifiers.push("Name");
  }

  // === VALIDATION RULES ===
  const hasSufficientSections = detectedSections.length >= 2;
  const hasContactIdentifier = detectedIdentifiers.length >= 1;

  // Both conditions must be met
  if (!hasSufficientSections && !hasContactIdentifier) {
    return {
      isValid: false,
      rejectionReason: "Missing resume sections and contact information",
      detectedSections,
      detectedIdentifiers
    };
  }

  if (!hasSufficientSections) {
    return {
      isValid: false,
      rejectionReason: "Missing standard resume sections (need at least 2: Experience, Education, Skills, Projects, or Certifications)",
      detectedSections,
      detectedIdentifiers
    };
  }

  if (!hasContactIdentifier) {
    return {
      isValid: false,
      rejectionReason: "Missing contact information (email, phone, LinkedIn, GitHub, or name)",
      detectedSections,
      detectedIdentifiers
    };
  }

  // Valid resume
  return {
    isValid: true,
    detectedSections,
    detectedIdentifiers
  };
}
