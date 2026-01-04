import { ResumeData } from "@/types/resume";

export type TemplateId = "classic" | "modern" | "professional" | "minimal" | "bold";

export interface ResumeTemplate {
  id: TemplateId;
  name: string;
  description: string;
  preview: string; // CSS gradient for preview
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout with serif headers",
    preview: "from-slate-100 to-slate-200"
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean design with accent colors and sans-serif fonts",
    preview: "from-blue-100 to-indigo-100"
  },
  {
    id: "professional",
    name: "Professional",
    description: "Formal layout with subtle styling and clear sections",
    preview: "from-gray-100 to-gray-200"
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Ultra-clean with maximum whitespace and simplicity",
    preview: "from-white to-gray-50"
  },
  {
    id: "bold",
    name: "Bold",
    description: "Strong visual hierarchy with prominent headings",
    preview: "from-zinc-100 to-zinc-200"
  }
];

interface TemplateStyleConfig {
  container: string;
  header: string;
  name: string;
  contact: string;
  sectionTitle: string;
  sectionDivider: string;
  jobTitle: string;
  company: string;
  bullet: string;
  skills: string;
}

export const templateStyles: Record<TemplateId, TemplateStyleConfig> = {
  classic: {
    container: "font-serif bg-white",
    header: "text-center mb-4 pb-2 border-b-2 border-gray-800",
    name: "text-2xl font-bold tracking-wide mb-1 text-gray-900",
    contact: "text-gray-600 text-xs",
    sectionTitle: "font-bold text-sm mb-2 text-gray-900 border-b border-gray-300 pb-1 uppercase tracking-wider",
    sectionDivider: "mb-4",
    jobTitle: "font-bold text-gray-900 text-sm",
    company: "text-gray-600 text-xs italic mb-1",
    bullet: "text-gray-700 text-xs",
    skills: "text-gray-700 text-xs"
  },
  modern: {
    container: "font-sans bg-white",
    header: "mb-4 pb-2 border-b-4 border-blue-500",
    name: "text-2xl font-bold mb-1 text-gray-900 tracking-tight",
    contact: "text-blue-600 text-xs font-medium",
    sectionTitle: "font-bold text-xs mb-2 text-blue-600 uppercase tracking-widest",
    sectionDivider: "mb-4 pl-3 border-l-4 border-blue-100",
    jobTitle: "font-semibold text-gray-900 text-sm",
    company: "text-blue-600 text-xs mb-1",
    bullet: "text-gray-600 text-xs",
    skills: "text-gray-700 text-xs"
  },
  professional: {
    container: "font-sans bg-white",
    header: "text-center mb-4 pb-2 bg-gray-50 -mx-6 px-6 py-3",
    name: "text-xl font-bold mb-1 text-gray-800 uppercase tracking-wide",
    contact: "text-gray-600 text-xs",
    sectionTitle: "font-bold text-xs mb-2 text-gray-700 uppercase tracking-widest bg-gray-100 -mx-6 px-6 py-1.5",
    sectionDivider: "mb-4",
    jobTitle: "font-semibold text-gray-800 text-sm",
    company: "text-gray-500 text-xs mb-1",
    bullet: "text-gray-600 text-xs",
    skills: "text-gray-600 text-xs"
  },
  minimal: {
    container: "font-sans bg-white",
    header: "mb-6",
    name: "text-2xl font-light mb-2 text-gray-900 tracking-wide",
    contact: "text-gray-500 text-xs font-light tracking-wide",
    sectionTitle: "font-medium text-xs mb-3 text-gray-400 uppercase tracking-[0.3em]",
    sectionDivider: "mb-5",
    jobTitle: "font-medium text-gray-900 text-sm",
    company: "text-gray-400 text-xs mb-2",
    bullet: "text-gray-500 text-xs font-light",
    skills: "text-gray-500 text-xs font-light"
  },
  bold: {
    container: "font-sans bg-white",
    header: "mb-4 pb-2 border-b-4 border-gray-900",
    name: "text-2xl font-black mb-1 text-gray-900 uppercase",
    contact: "text-gray-600 text-xs font-medium",
    sectionTitle: "font-black text-sm mb-2 text-gray-900 uppercase",
    sectionDivider: "mb-4",
    jobTitle: "font-bold text-gray-900 text-sm",
    company: "text-gray-600 text-xs font-semibold mb-1 uppercase tracking-wide",
    bullet: "text-gray-700 text-xs",
    skills: "text-gray-700 text-xs font-medium"
  }
};

interface ResumeTemplateRendererProps {
  data: ResumeData;
  templateId: TemplateId;
}

export function ResumeTemplateRenderer({ data, templateId }: ResumeTemplateRendererProps) {
  const styles = templateStyles[templateId];

  return (
    <div
      className={`${styles.container} overflow-auto`}
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '15mm 20mm',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}
    >
      {/* Header - Name & Contact */}
      <div className={styles.header}>
        <h1 className={styles.name}>
          {data.contact.name || 'YOUR NAME'}
        </h1>
        <p className={styles.contact}>
          {[data.contact.phone, data.contact.email, data.contact.linkedin, data.contact.github, data.contact.portfolio]
            .filter(Boolean)
            .join(' | ') || 'Contact information'}
        </p>
      </div>

      {/* Education - First Section */}
      {data.education.length > 0 && (
        <div className={styles.sectionDivider}>
          <h2 className={styles.sectionTitle}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={styles.jobTitle}>{edu.institution || 'Institution'}</h3>
                  <p className={styles.company}>
                    {edu.degree || 'Degree'}
                    {edu.gpa && `, GPA: ${edu.gpa}`}
                  </p>
                </div>
                {edu.graduationDate && (
                  <span className={`${styles.company} text-right`}>{edu.graduationDate}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills */}
      {data.skills.length > 0 && (
        <div className={styles.sectionDivider}>
          <h2 className={styles.sectionTitle}>Technical Skills</h2>
          <p className={styles.skills}>{data.skills.join(', ')}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className={styles.sectionDivider}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={styles.jobTitle}>{exp.role || 'Job Title'}</h3>
                  <p className={styles.company}>{exp.company || 'Company'}</p>
                </div>
                <span className={`${styles.company} text-right whitespace-nowrap`}>
                  {exp.startDate || 'Start'} – {exp.endDate || 'End'}
                </span>
              </div>
              <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5">
                {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                  <li key={idx} className={styles.bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className={styles.sectionDivider}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-start">
                <h3 className={styles.jobTitle}>{proj.name || 'Project Name'}</h3>
                {proj.technologies.length > 0 && (
                  <span className={`${styles.company} text-right`}>
                    {proj.technologies.join(', ')}
                  </span>
                )}
              </div>
              {proj.link && (
                <p className={`${styles.company} text-xs`}>{proj.link}</p>
              )}
              <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5">
                <li className={styles.bullet}>{proj.description}</li>
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Certifications & Achievements */}
      {data.certifications && data.certifications.length > 0 && (
        <div className={styles.sectionDivider}>
          <h2 className={styles.sectionTitle}>Certifications & Achievements</h2>
          <div className="space-y-1">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between">
                <span className={styles.bullet}>
                  <strong>{cert.name}</strong>
                  {cert.issuer && ` - ${cert.issuer}`}
                </span>
                {cert.date && <span className={styles.company}>{cert.date}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary - at the end if present */}
      {data.summary && (
        <div className={styles.sectionDivider}>
          <h2 className={styles.sectionTitle}>Professional Summary</h2>
          <p className={`${styles.bullet} leading-relaxed`}>{data.summary}</p>
        </div>
      )}
    </div>
  );
}
