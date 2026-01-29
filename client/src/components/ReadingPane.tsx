import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Eye } from "lucide-react";
import type { LensType } from "@shared/schema";

const lensLabels: Record<LensType, string> = {
  consumer: "Consumer's Lens",
  executive: "Executive's Lens",
  technical: "Technical Lens",
  financial: "Financial Lens",
  strategic: "Strategic Lens",
  skeptic: "Skeptic's Lens",
};

interface ReadingPaneProps {
  text: string;
  activeLens: LensType | null;
  lensSummary?: string;
}

export function ReadingPane({ text, activeLens, lensSummary }: ReadingPaneProps) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Source Material</h3>
        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="outline">{wordCount.toLocaleString()} words</Badge>
          <Badge variant="secondary">{readingTime} min read</Badge>
        </div>
      </div>
      
      {activeLens && lensSummary && (
        <div className="p-4 border-b bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Viewing through {lensLabels[activeLens]}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {lensSummary}
          </p>
        </div>
      )}
      
      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-6 max-w-3xl mx-auto">
          <article className="prose-reading font-serif text-base leading-[1.8]">
            {paragraphs.map((paragraph, index) => (
              <p 
                key={index} 
                className="mb-6 text-foreground/90"
                data-testid={`paragraph-${index}`}
              >
                {paragraph}
              </p>
            ))}
          </article>
        </div>
      </ScrollArea>
    </div>
  );
}
