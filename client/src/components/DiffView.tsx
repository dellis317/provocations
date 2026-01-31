import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { GitCompare, Plus, Minus } from "lucide-react";
import type { DocumentVersion } from "@shared/schema";

interface DiffViewProps {
  previousVersion: DocumentVersion;
  currentVersion: DocumentVersion;
}

function computeDiff(oldText: string, newText: string): Array<{
  type: "unchanged" | "added" | "removed";
  content: string;
}> {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  const result: Array<{ type: "unchanged" | "added" | "removed"; content: string }> = [];
  
  const oldSet = new Set(oldLines);
  const newSet = new Set(newLines);
  
  let oldIdx = 0;
  let newIdx = 0;
  
  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    const oldLine = oldLines[oldIdx];
    const newLine = newLines[newIdx];
    
    if (oldIdx >= oldLines.length) {
      result.push({ type: "added", content: newLine });
      newIdx++;
    } else if (newIdx >= newLines.length) {
      result.push({ type: "removed", content: oldLine });
      oldIdx++;
    } else if (oldLine === newLine) {
      result.push({ type: "unchanged", content: oldLine });
      oldIdx++;
      newIdx++;
    } else if (!newSet.has(oldLine)) {
      result.push({ type: "removed", content: oldLine });
      oldIdx++;
    } else if (!oldSet.has(newLine)) {
      result.push({ type: "added", content: newLine });
      newIdx++;
    } else {
      result.push({ type: "removed", content: oldLine });
      result.push({ type: "added", content: newLine });
      oldIdx++;
      newIdx++;
    }
  }
  
  return result;
}

export function DiffView({ previousVersion, currentVersion }: DiffViewProps) {
  const diffLines = computeDiff(previousVersion.text, currentVersion.text);
  
  const addedCount = diffLines.filter(l => l.type === "added").length;
  const removedCount = diffLines.filter(l => l.type === "removed").length;

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <GitCompare className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Version Comparison</h3>
        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="outline" className="text-emerald-600 border-emerald-300">
            <Plus className="w-3 h-3 mr-1" />
            {addedCount} added
          </Badge>
          <Badge variant="outline" className="text-red-600 border-red-300">
            <Minus className="w-3 h-3 mr-1" />
            {removedCount} removed
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium">Previous:</span>
          <span>{previousVersion.description}</span>
          <span className="text-xs">
            ({new Date(previousVersion.timestamp).toLocaleTimeString()})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Current:</span>
          <span>{currentVersion.description}</span>
          <span className="text-xs">
            ({new Date(currentVersion.timestamp).toLocaleTimeString()})
          </span>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 font-mono text-sm">
          {diffLines.map((line, index) => (
            <div
              key={index}
              className={`px-3 py-0.5 ${
                line.type === "added"
                  ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200"
                  : line.type === "removed"
                  ? "bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-200"
                  : ""
              }`}
            >
              <span className="inline-block w-6 text-muted-foreground select-none">
                {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
              </span>
              {line.content || " "}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
