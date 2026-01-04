import { useState, useEffect, forwardRef } from "react";
import { ArrowLeft, Download, Loader2, Edit2, FileText, File, FileType, ChevronDown, CheckCircle2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/types/resume";
import { TemplateSelector } from "./TemplateSelector";
import { ResumeTemplateRenderer, TemplateId, templateStyles } from "./ResumeTemplates";

interface ResumePreviewProps {
  data: ResumeData;
  onBack: () => void;
  onEdit: () => void;
  selectedTemplate?: TemplateId;
  onTemplateChange?: (templateId: TemplateId) => void;
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  function ResumePreview({ data, onBack, onEdit, selectedTemplate = "classic", onTemplateChange }, ref) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(true);
  const [localTemplate, setLocalTemplate] = useState<TemplateId>(selectedTemplate);
  const { toast } = useToast();

  const currentTemplate = onTemplateChange ? selectedTemplate : localTemplate;
  const handleTemplateSelect = (templateId: TemplateId) => {
    if (onTemplateChange) {
      onTemplateChange(templateId);
    } else {
      setLocalTemplate(templateId);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const generateTextContent = () => {
    const lines: string[] = [];

    lines.push(data.contact.name.toUpperCase());
    lines.push('');
    const contactParts = [data.contact.phone, data.contact.email, data.contact.linkedin, data.contact.github];
    lines.push(contactParts.filter(Boolean).join(' | '));
    lines.push('');

    // Education first (matching the user's format)
    if (data.education.length > 0) {
      lines.push('EDUCATION');
      lines.push('─'.repeat(60));
      for (const edu of data.education) {
        lines.push(`${edu.institution}`);
        let eduLine = edu.degree;
        if (edu.gpa) eduLine += `, GPA: ${edu.gpa}`;
        if (edu.graduationDate) eduLine += `, ${edu.graduationDate}`;
        lines.push(eduLine);
        lines.push('');
      }
    }

    // Technical Skills
    if (data.skills.length > 0) {
      lines.push('TECHNICAL SKILLS');
      lines.push('─'.repeat(60));
      lines.push(data.skills.join(', '));
      lines.push('');
    }

    // Experience
    if (data.experience.length > 0) {
      lines.push('EXPERIENCE');
      lines.push('─'.repeat(60));
      for (const exp of data.experience) {
        lines.push(`${exp.role}`);
        lines.push(`${exp.company} | ${exp.startDate} – ${exp.endDate}`);
        for (const bullet of exp.bullets.filter(b => b.trim())) {
          lines.push(`• ${bullet}`);
        }
        lines.push('');
      }
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
      lines.push('PROJECTS');
      lines.push('─'.repeat(60));
      for (const proj of data.projects) {
        lines.push(`${proj.name} | ${proj.technologies.join(', ')}`);
        lines.push(`• ${proj.description}`);
        lines.push('');
      }
    }

    // Certifications
    if (data.certifications && data.certifications.length > 0) {
      lines.push('CERTIFICATIONS & ACHIEVEMENTS');
      lines.push('─'.repeat(60));
      for (const cert of data.certifications) {
        let certLine = cert.name;
        if (cert.issuer) certLine += `, ${cert.issuer}`;
        if (cert.date) certLine += `, ${cert.date}`;
        lines.push(certLine);
      }
      lines.push('');
    }

    // Professional Summary at end if present
    if (data.summary?.trim()) {
      lines.push('PROFESSIONAL SUMMARY');
      lines.push('─'.repeat(60));
      lines.push(data.summary);
      lines.push('');
    }

    return lines.join('\n');
  };

  const getTemplateStyles = () => {
    const styles = templateStyles[currentTemplate];
    return `
      body { ${styles.container.includes('font-serif') ? 'font-family: Georgia, serif;' : 'font-family: Helvetica, Arial, sans-serif;'} font-size: 11pt; line-height: 1.5; margin: 1in; }
      h1 { font-size: 18pt; text-align: center; margin-bottom: 5pt; letter-spacing: 2pt; }
      .contact { text-align: center; color: #666; margin-bottom: 20pt; }
      h2 { font-size: 12pt; border-bottom: 1pt solid #333; padding-bottom: 3pt; margin-top: 15pt; margin-bottom: 10pt; }
      .job-title { font-weight: bold; margin-top: 10pt; }
      .company { color: #666; margin-bottom: 5pt; }
      ul { margin: 5pt 0; padding-left: 20pt; }
      li { margin-bottom: 3pt; }
      .degree { font-weight: bold; }
      .institution { color: #666; }
      .skills { margin-top: 5pt; }
    `;
  };

  const generateWordContent = () => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${getTemplateStyles()}</style>
      </head>
      <body>
        <h1>${data.contact.name.toUpperCase()}</h1>
        <p class="contact">${[data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin].filter(Boolean).join(' | ')}</p>

        ${data.summary?.trim() ? `
          <h2>PROFESSIONAL SUMMARY</h2>
          <p>${data.summary}</p>
        ` : ''}

        ${data.experience.length > 0 ? `
          <h2>PROFESSIONAL EXPERIENCE</h2>
          ${data.experience.map(exp => `
            <p class="job-title">${exp.role}</p>
            <p class="company">${exp.company} | ${exp.startDate} - ${exp.endDate}</p>
            <ul>
              ${exp.bullets.filter(b => b.trim()).map(bullet => `<li>${bullet}</li>`).join('')}
            </ul>
          `).join('')}
        ` : ''}

        ${data.education.length > 0 ? `
          <h2>EDUCATION</h2>
          ${data.education.map(edu => `
            <p class="degree">${edu.degree}</p>
            <p class="institution">${edu.institution}${edu.graduationDate ? ` | ${edu.graduationDate}` : ''}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
          `).join('')}
        ` : ''}

        ${data.skills.length > 0 ? `
          <h2>SKILLS</h2>
          <p class="skills">${data.skills.join(' | ')}</p>
        ` : ''}
      </body>
      </html>
    `;
    return html;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownload = async (format: 'pdf' | 'word' | 'txt') => {
    setIsGenerating(true);
    setDownloadFormat(format);

    try {
      const fileName = data.contact.name.replace(/\s+/g, '_');

      switch (format) {
        case 'txt':
          const textContent = generateTextContent();
          downloadFile(textContent, `${fileName}_Resume.txt`, 'text/plain');
          toast({
            title: "Resume downloaded",
            description: "Your resume has been downloaded as a text file.",
          });
          break;

        case 'word':
          const wordContent = generateWordContent();
          downloadFile(wordContent, `${fileName}_Resume.doc`, 'application/msword');
          toast({
            title: "Resume downloaded",
            description: "Your resume has been downloaded as a Word document.",
          });
          break;

        case 'pdf':
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            const pdfHtml = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <title>${data.contact.name} - Resume</title>
                <style>
                  @page { margin: 0.75in; size: letter; }
                  ${getTemplateStyles()}
                  body { margin: 0; padding: 40px; }
                </style>
              </head>
              <body>
                <h1>${data.contact.name.toUpperCase()}</h1>
                <p class="contact">${[data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin].filter(Boolean).join(' | ')}</p>
                ${data.summary?.trim() ? `<h2>PROFESSIONAL SUMMARY</h2><p>${data.summary}</p>` : ''}
                ${data.experience.length > 0 ? `<h2>PROFESSIONAL EXPERIENCE</h2>${data.experience.map(exp => `<p class="job-title">${exp.role}</p><p class="company">${exp.company} | ${exp.startDate} - ${exp.endDate}</p><ul>${exp.bullets.filter(b => b.trim()).map(bullet => `<li>${bullet}</li>`).join('')}</ul>`).join('')}` : ''}
                ${data.education.length > 0 ? `<h2>EDUCATION</h2>${data.education.map(edu => `<p class="degree">${edu.degree}</p><p class="institution">${edu.institution}${edu.graduationDate ? ` | ${edu.graduationDate}` : ''}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>`).join('')}` : ''}
                ${data.skills.length > 0 ? `<h2>SKILLS</h2><p class="skills">${data.skills.join(' | ')}</p>` : ''}
                <script>window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); }</script>
              </body>
              </html>
            `;
            printWindow.document.write(pdfHtml);
            printWindow.document.close();
          }
          toast({
            title: "Print dialog opened",
            description: "Save as PDF using your browser's print dialog.",
          });
          break;
      }
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: "Download failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setDownloadFormat(null);
    }
  };

  const SkeletonPreview = () => (
    <Card className="p-8 bg-card shadow-lg">
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-72 mx-auto" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onBack} className="hover-lift transition-all duration-300">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onEdit} className="hover-lift transition-all duration-300">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="btn-animated gap-2" disabled={isGenerating}>
                {downloadSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 animate-bounce-in" />
                ) : isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {downloadSuccess ? 'Downloaded!' : 'Download Resume'}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-card border shadow-xl">
              <DropdownMenuItem
                onClick={() => handleDownload('pdf')}
                className="cursor-pointer py-3 hover:bg-primary/10 transition-all duration-200"
              >
                <FileText className="w-5 h-5 mr-3 text-red-500" />
                <div>
                  <p className="font-medium">PDF Format</p>
                  <p className="text-xs text-muted-foreground">Best for sharing</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDownload('word')}
                className="cursor-pointer py-3 hover:bg-primary/10 transition-all duration-200"
              >
                <File className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="font-medium">Word Document</p>
                  <p className="text-xs text-muted-foreground">Easy to edit</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDownload('txt')}
                className="cursor-pointer py-3 hover:bg-primary/10 transition-all duration-200"
              >
                <FileType className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Plain Text</p>
                  <p className="text-xs text-muted-foreground">ATS optimized</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Template Selector */}
      <Collapsible open={templateOpen} onOpenChange={setTemplateOpen} className="mb-6">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between mb-2">
            <span className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Choose Template Style
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${templateOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="animate-fade-in">
          <Card className="p-4 border-0 shadow-md">
            <TemplateSelector
              selectedTemplate={currentTemplate}
              onSelectTemplate={handleTemplateSelect}
            />
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Show skeleton while loading, then fade in actual content */}
      {isLoading ? (
        <SkeletonPreview />
      ) : (
        <Card className="bg-card shadow-xl border-0 animate-scale-in transition-all duration-500 hover:shadow-2xl overflow-hidden">
          <div className="bg-gray-100 p-4 overflow-auto max-h-[900px]">
            <div className="bg-white shadow-lg mx-auto" style={{ width: '210mm' }}>
              <ResumeTemplateRenderer data={data} templateId={currentTemplate} />
            </div>
          </div>
        </Card>
      )}

      <p className="text-center text-sm text-muted-foreground mt-6 animate-fade-in delay-500" style={{ opacity: 0 }}>
        This preview shows an ATS-optimized format: single column, standard fonts, no graphics.
      </p>
    </div>
  );
});
