import { ResumeData } from "@/types/resume";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr + "-01");
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

export const ResumePreview = ({ data }: ResumePreviewProps) => {
  const { personalInfo, experience, education, skills } = data;

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Card
      id="resume-preview"
      className="bg-white text-black p-8 shadow-lg max-w-[8.5in] mx-auto"
      style={{ minHeight: "11in", fontFamily: "Georgia, serif" }}
    >
      {/* Header */}
      <header className="text-center border-b-2 border-black pb-4 mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.portfolio && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {personalInfo.portfolio}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm">{exp.position}</h3>
                    <p className="text-sm italic">
                      {exp.company}
                      {exp.location && `, ${exp.location}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600 shrink-0">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 text-sm space-y-0.5">
                    {exp.description
                      .filter(Boolean)
                      .map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-sm italic">
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
                <span className="text-sm text-gray-600 shrink-0">
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">
            Skills
          </h2>
          <div className="space-y-1 text-sm">
            {Object.entries(groupedSkills).map(([category, skillList]) => (
              <p key={category}>
                <span className="font-semibold">{category}:</span>{" "}
                {skillList.join(", ")}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!personalInfo.fullName &&
        experience.length === 0 &&
        education.length === 0 &&
        skills.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <p className="text-center">
              Start filling in your information
              <br />
              to see your resume preview here
            </p>
          </div>
        )}
    </Card>
  );
};
