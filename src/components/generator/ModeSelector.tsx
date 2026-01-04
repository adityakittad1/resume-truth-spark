import { useState, forwardRef } from "react";
import { FileText, Upload, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ModeSelectorProps {
  onSelectMode: (mode: 'scratch' | 'improve') => void;
}

export const ModeSelector = forwardRef<HTMLDivElement, ModeSelectorProps>(function ModeSelector({ onSelectMode }, ref) {
  const [hoveredCard, setHoveredCard] = useState<'scratch' | 'improve' | null>(null);

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Start from Scratch Card */}
      <Card
        className={`
          relative overflow-hidden cursor-pointer group
          transition-all duration-500 ease-out
          border-2 hover:border-primary/50
          ${hoveredCard === 'scratch' ? 'scale-[1.02] shadow-2xl shadow-primary/10' : 'shadow-lg'}
          animate-fade-in-up
        `}
        style={{ opacity: 0 }}
        onMouseEnter={() => setHoveredCard('scratch')}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => onSelectMode('scratch')}
      >
        {/* Gradient overlay on hover */}
        <div className={`
          absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10
          transition-opacity duration-500
          ${hoveredCard === 'scratch' ? 'opacity-100' : 'opacity-0'}
        `} />

        <CardHeader className="relative z-10 pb-4">
          <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center mb-4
            bg-gradient-to-br from-primary/20 to-primary/5
            transition-all duration-500 ease-out
            ${hoveredCard === 'scratch' ? 'scale-110 rotate-3' : ''}
          `}>
            <FileText className={`
              w-7 h-7 text-primary transition-transform duration-500
              ${hoveredCard === 'scratch' ? 'scale-110' : ''}
            `} />
          </div>
          <CardTitle className="text-xl font-bold">Start from Scratch</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Build a new ATS-friendly resume step by step using our guided form
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pt-2">
          <Button
            className={`
              w-full h-12 font-semibold btn-animated group/btn
              transition-all duration-300
              ${hoveredCard === 'scratch' ? 'shadow-lg' : ''}
            `}
          >
            <Sparkles className="w-4 h-4 mr-2 transition-transform group-hover/btn:rotate-12" />
            Create New Resume
            <ArrowRight className={`
              w-4 h-4 ml-2 transition-all duration-300
              ${hoveredCard === 'scratch' ? 'translate-x-1' : ''}
            `} />
          </Button>
        </CardContent>
      </Card>

      {/* Improve Existing Card */}
      <Card
        className={`
          relative overflow-hidden cursor-pointer group
          transition-all duration-500 ease-out
          border-2 hover:border-primary/50
          ${hoveredCard === 'improve' ? 'scale-[1.02] shadow-2xl shadow-primary/10' : 'shadow-lg'}
          animate-fade-in-up delay-200
        `}
        style={{ opacity: 0 }}
        onMouseEnter={() => setHoveredCard('improve')}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => onSelectMode('improve')}
      >
        {/* Gradient overlay on hover */}
        <div className={`
          absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10
          transition-opacity duration-500
          ${hoveredCard === 'improve' ? 'opacity-100' : 'opacity-0'}
        `} />

        <CardHeader className="relative z-10 pb-4">
          <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center mb-4
            bg-gradient-to-br from-primary/20 to-primary/5
            transition-all duration-500 ease-out
            ${hoveredCard === 'improve' ? 'scale-110 rotate-3' : ''}
          `}>
            <Upload className={`
              w-7 h-7 text-primary transition-transform duration-500
              ${hoveredCard === 'improve' ? 'scale-110' : ''}
            `} />
          </div>
          <CardTitle className="text-xl font-bold">Improve Existing Resume</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Upload your current resume and we'll restructure it into an ATS-optimized format
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pt-2">
          <Button
            variant="outline"
            className={`
              w-full h-12 font-semibold group/btn
              transition-all duration-300 hover:bg-primary/5
              ${hoveredCard === 'improve' ? 'border-primary/50 shadow-md' : ''}
            `}
          >
            <Upload className="w-4 h-4 mr-2 transition-transform group-hover/btn:-translate-y-0.5" />
            Upload & Improve
            <ArrowRight className={`
              w-4 h-4 ml-2 transition-all duration-300
              ${hoveredCard === 'improve' ? 'translate-x-1' : ''}
            `} />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});
