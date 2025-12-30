/**
 * Role Configuration for Resumate Analyzer
 * Two-tier system: Core (recommended) vs Extended (advanced)
 */

import { RoleInfo, CoreRole, ExtendedRole, AllRoles } from "@/types/analyzer";

// Core roles - well-tested, reliable scoring
export const CORE_ROLES: RoleInfo[] = [
  {
    id: "frontend-developer",
    label: "Web Developer / Frontend",
    description: "HTML, CSS, JavaScript, React, responsive design",
    isCore: true,
  },
  {
    id: "backend-fullstack",
    label: "Backend / Full-Stack",
    description: "APIs, databases, server-side logic, Node.js, Python",
    isCore: true,
  },
  {
    id: "data-analyst",
    label: "Data Analyst",
    description: "SQL, Excel, Python, data visualization, statistics",
    isCore: true,
  },
  {
    id: "ai-ml-intern",
    label: "AI / ML Intern",
    description: "Machine learning, Python, TensorFlow, data science",
    isCore: true,
  },
  {
    id: "cloud-devops",
    label: "Cloud / DevOps Intern",
    description: "AWS, Docker, CI/CD, Linux, infrastructure",
    isCore: true,
  },
];

// Extended roles - less refined, for advanced users
export const EXTENDED_ROLES: RoleInfo[] = [
  {
    id: "product-manager",
    label: "Product Manager",
    description: "Strategy, roadmaps, stakeholder management",
    isCore: false,
  },
  {
    id: "ui-ux-designer",
    label: "UI/UX Designer",
    description: "Figma, user research, prototyping, wireframes",
    isCore: false,
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity Analyst",
    description: "Security audits, penetration testing, compliance",
    isCore: false,
  },
  {
    id: "qa-engineer",
    label: "QA Engineer",
    description: "Testing frameworks, automation, bug tracking",
    isCore: false,
  },
  {
    id: "mobile-developer",
    label: "Mobile Developer",
    description: "iOS, Android, React Native, Flutter",
    isCore: false,
  },
  {
    id: "database-admin",
    label: "Database Administrator",
    description: "SQL, PostgreSQL, MongoDB, performance tuning",
    isCore: false,
  },
  {
    id: "technical-writer",
    label: "Technical Writer",
    description: "Documentation, API docs, user guides",
    isCore: false,
  },
  {
    id: "systems-analyst",
    label: "Systems Analyst",
    description: "Requirements analysis, system design, workflows",
    isCore: false,
  },
  {
    id: "network-engineer",
    label: "Network Engineer",
    description: "Networking, TCP/IP, firewalls, VPN",
    isCore: false,
  },
  {
    id: "blockchain-developer",
    label: "Blockchain Developer",
    description: "Solidity, smart contracts, Web3",
    isCore: false,
  },
  {
    id: "game-developer",
    label: "Game Developer",
    description: "Unity, Unreal, C++, game design",
    isCore: false,
  },
  {
    id: "embedded-systems",
    label: "Embedded Systems Engineer",
    description: "C/C++, microcontrollers, IoT, firmware",
    isCore: false,
  },
];

// Combined list
export const ALL_ROLES: RoleInfo[] = [...CORE_ROLES, ...EXTENDED_ROLES];

// Helper to get role info by ID
export function getRoleById(roleId: AllRoles): RoleInfo | undefined {
  return ALL_ROLES.find((r) => r.id === roleId);
}

// Helper to check if role is core
export function isCorRole(roleId: AllRoles): boolean {
  return CORE_ROLES.some((r) => r.id === roleId);
}
