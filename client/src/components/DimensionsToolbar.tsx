import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Sparkles, 
  Target, 
  BarChart3, 
  Megaphone, 
  Shield,
  ArrowDownToLine,
  ArrowUpToLine,
  Equal,
  Loader2,
  Check,
  X
} from "lucide-react";
import type { ToneOption } from "@shared/schema";

const toneIcons: Record<ToneOption, typeof Sparkles> = {
  inspirational: Sparkles,
  practical: Target,
  analytical: BarChart3,
  persuasive: Megaphone,
  cautious: Shield,
};

const toneDescriptions: Record<ToneOption, string> = {
  inspirational: "Motivating and vision-focused",
  practical: "Action-oriented and concrete",
  analytical: "Data-driven and logical",
  persuasive: "Compelling and convincing",
  cautious: "Measured and risk-aware",
};

interface DimensionsToolbarProps {
  selectedTone: ToneOption;
  onToneChange: (tone: ToneOption) => void;
  targetLength: "shorter" | "same" | "longer";
  onLengthChange: (length: "shorter" | "same" | "longer") => void;
  onRefine: () => void;
  isRefining?: boolean;
  hasContent?: boolean;
  refinedPreview?: string | null;
  onApplyRefinement?: () => void;
  onDiscardRefinement?: () => void;
}

export function DimensionsToolbar({
  selectedTone,
  onToneChange,
  targetLength,
  onLengthChange,
  onRefine,
  isRefining,
  hasContent,
  refinedPreview,
  onApplyRefinement,
  onDiscardRefinement,
}: DimensionsToolbarProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Tone</h4>
            <Badge variant="outline" className="text-xs capitalize">
              {selectedTone}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(toneIcons) as ToneOption[]).map((tone) => {
              const Icon = toneIcons[tone];
              const isSelected = selectedTone === tone;
              return (
                <Tooltip key={tone}>
                  <TooltipTrigger asChild>
                    <Button
                      data-testid={`tone-${tone}`}
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      className="gap-1.5 capitalize"
                      onClick={() => onToneChange(tone)}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tone}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{toneDescriptions[tone]}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Length Adjustment</h4>
            <Badge variant="outline" className="text-xs capitalize">
              {targetLength}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  data-testid="length-shorter"
                  size="sm"
                  variant={targetLength === "shorter" ? "default" : "outline"}
                  className="gap-1.5 flex-1"
                  onClick={() => onLengthChange("shorter")}
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  Shorter
                </Button>
              </TooltipTrigger>
              <TooltipContent>Condense to key points</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  data-testid="length-same"
                  size="sm"
                  variant={targetLength === "same" ? "default" : "outline"}
                  className="gap-1.5 flex-1"
                  onClick={() => onLengthChange("same")}
                >
                  <Equal className="w-3.5 h-3.5" />
                  Same
                </Button>
              </TooltipTrigger>
              <TooltipContent>Keep similar length</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  data-testid="length-longer"
                  size="sm"
                  variant={targetLength === "longer" ? "default" : "outline"}
                  className="gap-1.5 flex-1"
                  onClick={() => onLengthChange("longer")}
                >
                  <ArrowUpToLine className="w-3.5 h-3.5" />
                  Longer
                </Button>
              </TooltipTrigger>
              <TooltipContent>Expand with more detail</TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        <Button
          data-testid="button-refine"
          onClick={onRefine}
          disabled={isRefining || !hasContent}
          className="w-full gap-2"
        >
          {isRefining ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Refining...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Refine Outline Content
            </>
          )}
        </Button>
        
        {!hasContent && (
          <p className="text-xs text-muted-foreground text-center">
            Add content to your outline sections to enable refinement
          </p>
        )}
      </Card>

      {refinedPreview && (
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Refined Preview</h4>
            <Badge variant="default" className="text-xs">Ready to Apply</Badge>
          </div>
          
          <ScrollArea className="h-[200px] rounded-md border p-3">
            <div className="prose-sm font-serif text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {refinedPreview}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <Button
              data-testid="button-apply-refinement"
              onClick={onApplyRefinement}
              className="flex-1 gap-1.5"
            >
              <Check className="w-4 h-4" />
              Apply to Outline
            </Button>
            <Button
              data-testid="button-discard-refinement"
              variant="outline"
              onClick={onDiscardRefinement}
              className="gap-1.5"
            >
              <X className="w-4 h-4" />
              Discard
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
