import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Users, Briefcase, Code, DollarSign, Target, AlertTriangle, Check } from "lucide-react";
import type { Lens, LensType } from "@shared/schema";

const lensIcons: Record<LensType, typeof Eye> = {
  consumer: Users,
  executive: Briefcase,
  technical: Code,
  financial: DollarSign,
  strategic: Target,
  skeptic: AlertTriangle,
};

const lensLabels: Record<LensType, string> = {
  consumer: "Consumer's Lens",
  executive: "Executive's Lens",
  technical: "Technical Lens",
  financial: "Financial Lens",
  strategic: "Strategic Lens",
  skeptic: "Skeptic's Lens",
};

const lensDescriptions: Record<LensType, string> = {
  consumer: "How customers and end-users perceive this",
  executive: "Leadership and decision-making perspective",
  technical: "Implementation and technical feasibility",
  financial: "Cost, revenue, and ROI considerations",
  strategic: "Long-term positioning and competitive advantage",
  skeptic: "Critical analysis and potential weaknesses",
};

interface LensesPanelProps {
  lenses: Lens[];
  activeLens: LensType | null;
  onSelectLens: (lens: LensType | null) => void;
  isLoading?: boolean;
}

export function LensesPanel({ lenses, activeLens, onSelectLens, isLoading }: LensesPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold">Analyzing Lenses...</h3>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  const availableLensTypes: LensType[] = ["consumer", "executive", "technical", "financial", "strategic", "skeptic"];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b">
        <Eye className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Lenses</h3>
        <Badge variant="secondary" className="ml-auto">
          {(lenses ?? []).length} analyzed
        </Badge>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          <p className="text-sm text-muted-foreground mb-4">
            Select a lens to view the source through a specific perspective.
          </p>
          
          {availableLensTypes.map((lensType) => {
            const lens = (lenses ?? []).find((l) => l.type === lensType);
            const Icon = lensIcons[lensType];
            const isActive = activeLens === lensType;
            const isAvailable = !!lens;
            
            return (
              <Card
                key={lensType}
                data-testid={`lens-${lensType}`}
                className={`cursor-pointer transition-all ${
                  isActive
                    ? "ring-2 ring-primary bg-primary/5"
                    : isAvailable
                    ? "hover-elevate"
                    : "opacity-50"
                }`}
                onClick={() => isAvailable && onSelectLens(isActive ? null : lensType)}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className={`p-1.5 rounded-md ${isActive ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="flex-1">{lensLabels[lensType]}</span>
                    {isActive && <Check className="w-4 h-4 text-primary" />}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {lens ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {lens.summary}
                      </p>
                      {lens.keyPoints.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {lens.keyPoints.slice(0, 3).map((point, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {point.length > 25 ? point.slice(0, 25) + "..." : point}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      {lensDescriptions[lensType]}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {activeLens && (
            <Button
              data-testid="button-clear-lens"
              variant="ghost"
              className="w-full mt-4"
              onClick={() => onSelectLens(null)}
            >
              Clear Lens Selection
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
