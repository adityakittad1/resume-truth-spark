import { useState, useEffect } from "react";
import { Plus, Trash2, ArrowLeft, ArrowRight, GripVertical, X, Sparkles, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResumeData, ResumeExperience, ResumeEducation, emptyResumeData } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getStateNames, getCitiesByState } from "@/data/indianLocations";

interface ResumeFormProps {
  initialData?: ResumeData;
  onSubmit: (data: ResumeData) => void;
  onBack: () => void;
}

const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
];

const OTHER_CITY_VALUE = "__other__";

export function ResumeForm({ initialData, onSubmit, onBack }: ResumeFormProps) {
  const [data, setData] = useState<ResumeData>(initialData || emptyResumeData);
  const [currentStep, setCurrentStep] = useState(0);
  const [countryCode, setCountryCode] = useState("+91");
  const [skillInput, setSkillInput] = useState("");
  const [enhancingField, setEnhancingField] = useState<string | null>(null);
  const { toast } = useToast();

  // Location state
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [customCity, setCustomCity] = useState<string>("");
  const [isOtherCity, setIsOtherCity] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Parse initial location data
  useEffect(() => {
    if (initialData?.contact.location) {
      const parts = initialData.contact.location.split(", ");
      if (parts.length === 2) {
        const [city, state] = parts;
        const stateNames = getStateNames();
        if (stateNames.includes(state)) {
          setSelectedState(state);
          const cities = getCitiesByState(state);
          setAvailableCities(cities);
          if (cities.includes(city)) {
            setSelectedCity(city);
          } else {
            setIsOtherCity(true);
            setSelectedCity(OTHER_CITY_VALUE);
            setCustomCity(city);
          }
        }
      }
    }
  }, [initialData]);

  // Update available cities when state changes
  useEffect(() => {
    if (selectedState) {
      const cities = getCitiesByState(selectedState);
      setAvailableCities(cities);
    } else {
      setAvailableCities([]);
    }
  }, [selectedState]);

  // Update location in data when state/city changes
  useEffect(() => {
    if (selectedState) {
      let cityValue = "";
      if (isOtherCity && customCity.trim()) {
        cityValue = customCity.trim();
      } else if (selectedCity && selectedCity !== OTHER_CITY_VALUE) {
        cityValue = selectedCity;
      }

      if (cityValue) {
        const locationString = `${cityValue}, ${selectedState}`;
        setData(prev => ({
          ...prev,
          contact: { ...prev.contact, location: locationString }
        }));
      }
    }
  }, [selectedState, selectedCity, customCity, isOtherCity]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity("");
    setCustomCity("");
    setIsOtherCity(false);
  };

  const handleCityChange = (city: string) => {
    if (city === OTHER_CITY_VALUE) {
      setIsOtherCity(true);
      setSelectedCity(OTHER_CITY_VALUE);
    } else {
      setIsOtherCity(false);
      setSelectedCity(city);
      setCustomCity("");
    }
  };

  const steps = ['Contact', 'Summary', 'Experience', 'Education', 'Skills'];

  const enhanceContent = async (content: string, type: 'summary' | 'bullet', fieldId: string) => {
    if (!content.trim()) {
      toast({
        title: "Nothing to enhance",
        description: "Please enter some text first.",
        variant: "destructive",
      });
      return null;
    }

    setEnhancingField(fieldId);

    try {
      const { data: responseData, error } = await supabase.functions.invoke('enhance-content', {
        body: { content, type }
      });

      if (error) {
        throw error;
      }

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      toast({
        title: "Content enhanced!",
        description: "Your text has been improved with AI.",
      });

      return responseData.enhanced;
    } catch (error) {
      console.error('Enhancement error:', error);
      toast({
        title: "Enhancement failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setEnhancingField(null);
    }
  };

  const enhanceSummary = async () => {
    const enhanced = await enhanceContent(data.summary, 'summary', 'summary');
    if (enhanced) {
      setData(prev => ({ ...prev, summary: enhanced }));
    }
  };

  const enhanceBullet = async (expId: string, bulletIdx: number) => {
    const exp = data.experience.find(e => e.id === expId);
    if (!exp) return;

    const bullet = exp.bullets[bulletIdx];
    const enhanced = await enhanceContent(bullet, 'bullet', `${expId}-${bulletIdx}`);
    if (enhanced) {
      updateBullet(expId, bulletIdx, enhanced);
    }
  };

  const updateContact = (field: keyof ResumeData['contact'], value: string) => {
    setData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const updatePhoneWithCode = (phone: string) => {
    updateContact('phone', phone);
  };

  const getFullPhone = () => {
    if (data.contact.phone) {
      return `${countryCode} ${data.contact.phone}`;
    }
    return '';
  };

  const addExperience = () => {
    const newExp: ResumeExperience = {
      id: `exp-${Date.now()}`,
      role: '',
      company: '',
      startDate: '',
      endDate: '',
      bullets: ['']
    };
    setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const updateExperience = (id: string, field: keyof Omit<ResumeExperience, 'id'>, value: any) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addBullet = (expId: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === expId ? { ...exp, bullets: [...exp.bullets, ''] } : exp
      )
    }));
  };

  const updateBullet = (expId: string, bulletIdx: number, value: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === expId
          ? { ...exp, bullets: exp.bullets.map((b, i) => i === bulletIdx ? value : b) }
          : exp
      )
    }));
  };

  const removeBullet = (expId: string, bulletIdx: number) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === expId
          ? { ...exp, bullets: exp.bullets.filter((_, i) => i !== bulletIdx) }
          : exp
      )
    }));
  };

  const addEducation = () => {
    const newEdu: ResumeEducation = {
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      graduationDate: '',
      gpa: ''
    };
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id: string, field: keyof Omit<ResumeEducation, 'id'>, value: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const handleSkillInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      const skill = skillInput.replace(/,/g, '').trim();
      if (skill && !data.skills.includes(skill)) {
        setData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      }
      setSkillInput("");
    }
  };

  const handleSkillInputChange = (value: string) => {
    if (value.endsWith(',') || value.endsWith(' ')) {
      const skill = value.slice(0, -1).trim();
      if (skill && !data.skills.includes(skill)) {
        setData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      }
      setSkillInput("");
    } else {
      setSkillInput(value);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const submitData = {
        ...data,
        contact: {
          ...data.contact,
          phone: getFullPhone()
        }
      };
      onSubmit(submitData);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8 gap-2">
        {steps.map((step, idx) => (
          <div key={step} className="flex items-center">
            <button
              onClick={() => setCurrentStep(idx)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 transform hover:scale-110 ${
                idx === currentStep
                  ? 'bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20'
                  : idx < currentStep
                  ? 'bg-primary/80 text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {idx + 1}
            </button>
            {idx < steps.length - 1 && (
              <div className={`w-8 md:w-12 h-1 mx-1 rounded-full transition-colors duration-300 ${idx < currentStep ? 'bg-primary/60' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex items-center justify-center mb-6">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>

      <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {steps[currentStep]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Contact Step */}
          {currentStep === 0 && (
            <div className="grid gap-5 animate-fade-in">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-semibold">Full Name *</Label>
                <Input
                  id="name"
                  value={data.contact.name}
                  onChange={(e) => updateContact('name', e.target.value)}
                  placeholder="John Doe"
                  className="h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.contact.email}
                    onChange={(e) => updateContact('email', e.target.value)}
                    placeholder="john@example.com"
                    className="h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-sm font-semibold">Phone *</Label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-[130px] h-12">
                        <SelectValue>
                          {countryCodes.find(c => c.code === countryCode)?.flag} {countryCode}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <span className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.code}</span>
                              <span className="text-muted-foreground text-xs">({country.country})</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      value={data.contact.phone}
                      onChange={(e) => updatePhoneWithCode(e.target.value)}
                      placeholder="9876543210"
                      className="flex-1 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Location *
                </Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* State Dropdown */}
                  <div className="grid gap-2">
                    <Label htmlFor="state" className="text-xs text-muted-foreground">State</Label>
                    <Select value={selectedState} onValueChange={handleStateChange}>
                      <SelectTrigger className="h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] bg-card">
                        {getStateNames().map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* City Dropdown */}
                  <div className="grid gap-2">
                    <Label htmlFor="city" className="text-xs text-muted-foreground">City</Label>
                    <Select
                      value={selectedCity}
                      onValueChange={handleCityChange}
                      disabled={!selectedState}
                    >
                      <SelectTrigger className={`h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${!selectedState ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <SelectValue placeholder={selectedState ? "Select City" : "Select state first"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] bg-card">
                        {availableCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                        <SelectItem value={OTHER_CITY_VALUE} className="border-t mt-1 pt-1">
                          <span className="text-muted-foreground">Other / Not listed</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Custom City Input */}
                {isOtherCity && (
                  <div className="animate-fade-in">
                    <Label htmlFor="customCity" className="text-xs text-muted-foreground">Enter City Name</Label>
                    <Input
                      id="customCity"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="Enter your city name"
                      className="h-12 mt-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                )}

                {/* Location Preview */}
                {data.contact.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2 animate-fade-in">
                    <MapPin className="w-3 h-3" />
                    Preview: <span className="font-medium text-foreground">{data.contact.location}</span>
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="linkedin" className="text-sm font-semibold">LinkedIn (optional)</Label>
                <Input
                  id="linkedin"
                  value={data.contact.linkedin || ''}
                  onChange={(e) => updateContact('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                  className="h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          )}

          {/* Summary Step */}
          {currentStep === 1 && (
            <div className="grid gap-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <Label htmlFor="summary" className="text-sm font-semibold">Professional Summary</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={enhanceSummary}
                  disabled={enhancingField === 'summary' || !data.summary.trim()}
                  className="gap-2 text-xs bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/30 hover:border-violet-500/50 hover:bg-violet-500/20 transition-all duration-300"
                >
                  {enhancingField === 'summary' ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-violet-500" />
                  )}
                  Enhance with AI
                </Button>
              </div>
              <Textarea
                id="summary"
                value={data.summary}
                onChange={(e) => setData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="A brief 2-3 sentence summary of your professional background and key strengths..."
                rows={6}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Keep it concise and focused on your key qualifications. Click "Enhance with AI" to improve your text with a professional, humanized tone.
              </p>
            </div>
          )}

          {/* Experience Step */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              {data.experience.map((exp, idx) => (
                <Card key={exp.id} className="border-muted/50 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-2 mb-4">
                      <GripVertical className="w-5 h-5 text-muted-foreground mt-2 cursor-grab" />
                      <div className="flex-1 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label className="text-sm font-semibold">Job Title *</Label>
                            <Input
                              value={exp.role}
                              onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                              placeholder="Software Engineer"
                              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-sm font-semibold">Company *</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              placeholder="Tech Company Inc."
                              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label className="text-sm font-semibold">Start Date *</Label>
                            <Input
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                              placeholder="January 2022"
                              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-sm font-semibold">End Date *</Label>
                            <Input
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              placeholder="Present"
                              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold">Achievements / Responsibilities</Label>
                          {exp.bullets.map((bullet, bulletIdx) => (
                            <div key={bulletIdx} className="flex gap-2 group">
                              <div className="flex-1 relative">
                                <Input
                                  value={bullet}
                                  onChange={(e) => updateBullet(exp.id, bulletIdx, e.target.value)}
                                  placeholder="Describe an achievement or responsibility..."
                                  className="h-11 pr-24 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => enhanceBullet(exp.id, bulletIdx)}
                                  disabled={enhancingField === `${exp.id}-${bulletIdx}` || !bullet.trim()}
                                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 gap-1 text-xs text-violet-500 hover:text-violet-600 hover:bg-violet-500/10"
                                >
                                  {enhancingField === `${exp.id}-${bulletIdx}` ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Sparkles className="w-3 h-3" />
                                  )}
                                  AI
                                </Button>
                              </div>
                              {exp.bullets.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeBullet(exp.id, bulletIdx)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addBullet(exp.id)}
                            className="transition-all duration-200 hover:scale-105 hover:bg-primary/5"
                          >
                            <Plus className="w-4 h-4 mr-1" /> Add Bullet
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExperience(exp.id)}
                        className="hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={addExperience}
                className="w-full h-12 transition-all duration-300 hover:scale-[1.02] hover:bg-primary/5 hover:border-primary/50"
              >
                <Plus className="w-5 h-5 mr-2" /> Add Experience
              </Button>
            </div>
          )}

          {/* Education Step */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              {data.education.map((edu) => (
                <Card key={edu.id} className="border-muted/50 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label className="text-sm font-semibold">Degree *</Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              placeholder="Bachelor of Science in Computer Science"
                              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-sm font-semibold">Institution *</Label>
                            <Input
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              placeholder="University Name"
                              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label className="text-sm font-semibold">Graduation Date *</Label>
                            <Input
                              value={edu.graduationDate}
                              onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                              placeholder="May 2022"
                              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-sm font-semibold">GPA (optional)</Label>
                            <Input
                              value={edu.gpa || ''}
                              onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                              placeholder="3.8/4.0"
                              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEducation(edu.id)}
                        className="hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={addEducation}
                className="w-full h-12 transition-all duration-300 hover:scale-[1.02] hover:bg-primary/5 hover:border-primary/50"
              >
                <Plus className="w-5 h-5 mr-2" /> Add Education
              </Button>
            </div>
          )}

          {/* Skills Step */}
          {currentStep === 4 && (
            <div className="grid gap-4 animate-fade-in">
              <Label htmlFor="skills" className="text-sm font-semibold">Skills</Label>
              <div className="space-y-4">
                <Input
                  id="skills"
                  value={skillInput}
                  onChange={(e) => handleSkillInputChange(e.target.value)}
                  onKeyDown={handleSkillInput}
                  placeholder="Type a skill and press comma, space, or enter to add..."
                  className="h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-sm text-muted-foreground">
                  Press <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">comma</kbd>, <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">space</kbd>, or <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">enter</kbd> to add each skill.
                </p>
                {data.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg border border-border/50">
                    {data.skills.map((skill, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 animate-scale-in hover:bg-secondary/80 transition-colors cursor-default"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-destructive transition-colors rounded-full hover:bg-destructive/10 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrev}
          className="h-12 px-6 transition-all duration-300 hover:scale-105 hover:bg-muted/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep === 0 ? 'Back' : 'Previous'}
        </Button>
        <Button
          onClick={handleNext}
          className="h-12 px-8 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          {currentStep === steps.length - 1 ? 'Preview Resume' : 'Next'}
          {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
