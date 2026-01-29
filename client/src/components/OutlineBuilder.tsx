import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ListTree, 
  Plus, 
  GripVertical, 
  ChevronDown, 
  ChevronRight,
  Trash2,
  Wand2,
  Loader2
} from "lucide-react";
import type { OutlineItem, ToneOption } from "@shared/schema";

interface OutlineBuilderProps {
  outline: OutlineItem[];
  onAddItem: (item: OutlineItem) => void;
  onUpdateItem: (id: string, updates: Partial<OutlineItem>) => void;
  onRemoveItem: (id: string) => void;
  onReorder: (items: OutlineItem[]) => void;
  onExpandHeading: (id: string, heading: string, tone?: ToneOption) => Promise<string>;
  isLoading?: boolean;
}

function OutlineItemCard({
  item,
  onUpdate,
  onRemove,
  onExpand,
  isExpanding,
}: {
  item: OutlineItem;
  onUpdate: (updates: Partial<OutlineItem>) => void;
  onRemove: () => void;
  onExpand: () => void;
  isExpanding: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.heading);

  const handleSaveHeading = () => {
    if (editValue.trim()) {
      onUpdate({ heading: editValue.trim() });
    }
    setIsEditing(false);
  };

  return (
    <Card 
      data-testid={`outline-item-${item.id}`}
      className="group"
    >
      <CardHeader className="p-3 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <div className="cursor-grab opacity-0 group-hover:opacity-50 transition-opacity">
            <GripVertical className="w-4 h-4" />
          </div>
          
          <button
            data-testid={`button-toggle-expand-${item.id}`}
            onClick={() => onUpdate({ isExpanded: !item.isExpanded })}
            className="p-0.5"
          >
            {item.isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          
          {isEditing ? (
            <Input
              data-testid={`input-heading-${item.id}`}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSaveHeading}
              onKeyDown={(e) => e.key === "Enter" && handleSaveHeading()}
              className="h-7 text-sm font-medium flex-1"
              autoFocus
            />
          ) : (
            <span 
              className="flex-1 font-medium cursor-text"
              onClick={() => setIsEditing(true)}
              data-testid={`text-heading-${item.id}`}
            >
              {item.heading}
            </span>
          )}
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              data-testid={`button-expand-ai-${item.id}`}
              size="sm"
              variant="ghost"
              className="h-7 gap-1 text-xs"
              onClick={onExpand}
              disabled={isExpanding}
            >
              {isExpanding ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Wand2 className="w-3 h-3" />
              )}
              Generate
            </Button>
            <Button
              data-testid={`button-remove-${item.id}`}
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      {item.isExpanded && (
        <CardContent className="p-3 pt-0">
          <Textarea
            data-testid={`textarea-content-${item.id}`}
            placeholder="Write your content here, or use AI to generate from the heading..."
            value={item.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="min-h-[100px] text-sm resize-none"
          />
          {item.content && (
            <div className="flex items-center justify-end gap-2 mt-2">
              <span className="text-xs text-muted-foreground">
                {item.content.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export function OutlineBuilder({
  outline,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onReorder,
  onExpandHeading,
  isLoading,
}: OutlineBuilderProps) {
  const [newHeading, setNewHeading] = useState("");
  const [expandingId, setExpandingId] = useState<string | null>(null);
  
  const safeOutline = outline ?? [];

  const handleAddItem = () => {
    if (newHeading.trim()) {
      const newItem: OutlineItem = {
        id: Date.now().toString(),
        heading: newHeading.trim(),
        content: "",
        order: safeOutline.length,
        isExpanded: true,
      };
      onAddItem(newItem);
      setNewHeading("");
    }
  };

  const handleExpand = async (item: OutlineItem) => {
    setExpandingId(item.id);
    try {
      const content = await onExpandHeading(item.id, item.heading);
      onUpdateItem(item.id, { content, isExpanded: true });
    } catch (error) {
      console.error("Failed to expand heading:", error);
    } finally {
      setExpandingId(null);
    }
  };

  const totalWords = safeOutline.reduce(
    (sum, item) => sum + item.content.split(/\s+/).filter(Boolean).length,
    0
  );

  if (isLoading) {
    return (
      <div className="h-full flex flex-col p-4 space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <ListTree className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Outline</h3>
        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="outline">{safeOutline.length} sections</Badge>
          <Badge variant="secondary">{totalWords} words</Badge>
        </div>
      </div>
      
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Input
            data-testid="input-new-heading"
            placeholder="Add a section heading..."
            value={newHeading}
            onChange={(e) => setNewHeading(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
            className="flex-1"
          />
          <Button
            data-testid="button-add-section"
            size="sm"
            onClick={handleAddItem}
            disabled={!newHeading.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Build your argument structure. AI can help expand, but the structure is yours.
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {safeOutline.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <ListTree className="w-10 h-10 text-muted-foreground/50 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Start building your outline by adding section headings above.
              </p>
            </div>
          ) : (
            safeOutline
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <OutlineItemCard
                  key={item.id}
                  item={item}
                  onUpdate={(updates) => onUpdateItem(item.id, updates)}
                  onRemove={() => onRemoveItem(item.id)}
                  onExpand={() => handleExpand(item)}
                  isExpanding={expandingId === item.id}
                />
              ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
