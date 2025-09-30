import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { NoirJournal } from "@/components/NoirJournal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Download, RefreshCw, Search, BookOpen, Brain, Skull } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  userId: string;
  entryType: 'trade' | 'daily' | 'milestone' | 'victim' | 'shadow' | 'psychological';
  content: string;
  mood?: string;
  corruptionAtTime: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

interface PsychologicalProfile {
  id: string;
  userId: string;
  pattern: string;
  analysis: string;
  updatedAt: string;
}

interface MoralStanding {
  corruptionLevel: string;
  victimCount: string;
  totalBloodMoney: string;
}

export default function Journal() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [entryTypeFilter, setEntryTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [corruptionFilter, setCorruptionFilter] = useState<string>("all");

  // Fetch journal entries
  const { data: entries = [], isLoading: entriesLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal/entries"],
  });

  // Fetch psychological analysis
  const { data: psychAnalysis } = useQuery<PsychologicalProfile>({
    queryKey: ["/api/journal/analysis"],
  });

  // Fetch moral standing
  const { data: moralStanding } = useQuery<MoralStanding>({
    queryKey: ["/api/moral/standing"],
  });

  // Generate new entry mutation
  const generateEntry = useMutation({
    mutationFn: async (type: string) => {
      const endpoint = type === 'milestone' ? '/api/journal/milestone' : '/api/journal/generate';
      return apiRequest(endpoint, { method: "POST" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
      toast({
        title: "Entry Generated",
        description: "A new journal entry has been written in the darkness.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate journal entry",
        variant: "destructive",
      });
    },
  });

  // Filter entries based on search and filters
  const filteredEntries = entries.filter((entry) => {
    if (searchQuery && !entry.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (entryTypeFilter !== "all" && entry.entryType !== entryTypeFilter) {
      return false;
    }
    if (dateFilter) {
      const entryDate = new Date(entry.createdAt);
      const filterDate = new Date(dateFilter);
      if (entryDate.toDateString() !== filterDate.toDateString()) {
        return false;
      }
    }
    if (corruptionFilter !== "all") {
      const corruption = parseFloat(entry.corruptionAtTime);
      switch (corruptionFilter) {
        case "low":
          if (corruption > 33) return false;
          break;
        case "medium":
          if (corruption <= 33 || corruption > 66) return false;
          break;
        case "high":
          if (corruption <= 66) return false;
          break;
      }
    }
    return true;
  });

  // Export journal to text file
  const exportJournal = useCallback(() => {
    const content = filteredEntries
      .map((entry) => {
        const date = new Date(entry.createdAt).toLocaleString();
        const separator = "=".repeat(60);
        return `${separator}\n${date} | ${entry.entryType.toUpperCase()} | Corruption: ${entry.corruptionAtTime}%\n${separator}\n\n${entry.content}\n\n`;
      })
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `noir_journal_${format(new Date(), "yyyy-MM-dd")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Journal Exported",
      description: "Your dark confessions have been preserved.",
    });
  }, [filteredEntries, toast]);

  const currentCorruption = moralStanding ? parseFloat(moralStanding.corruptionLevel) : 0;

  return (
    <div className="min-h-screen bg-background" 
         style={{
           background: `
             linear-gradient(180deg, 
               rgb(0, 0, 0) 0%,
               rgb(10, 10, 10) 50%,
               rgb(20, 0, 0) 100%
             )`,
         }}>
      {/* Terminal header */}
      <div className="border-b border-border/20 bg-card/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-mono font-bold text-foreground">
                NOIR JOURNAL
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  CORRUPTION: {currentCorruption.toFixed(1)}%
                </Badge>
                {moralStanding && (
                  <Badge variant="destructive" className="font-mono">
                    VICTIMS: {moralStanding.victimCount}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateEntry.mutate('daily')}
                disabled={generateEntry.isPending}
                data-testid="button-generate-entry"
              >
                {generateEntry.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Generate Entry
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportJournal}
                data-testid="button-export-journal"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="entries" className="space-y-4">
          <TabsList className="bg-card/20 backdrop-blur-sm">
            <TabsTrigger value="entries" className="font-mono">
              <BookOpen className="h-4 w-4 mr-2" />
              Journal Entries
            </TabsTrigger>
            <TabsTrigger value="analysis" className="font-mono">
              <Brain className="h-4 w-4 mr-2" />
              Psychological Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entries" className="space-y-4">
            {/* Filters */}
            <Card className="bg-card/10 backdrop-blur-sm border-border/30">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search entries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 font-mono bg-background/50"
                      data-testid="input-search-entries"
                    />
                  </div>

                  <Select value={entryTypeFilter} onValueChange={setEntryTypeFilter}>
                    <SelectTrigger className="font-mono bg-background/50" data-testid="select-entry-type">
                      <SelectValue placeholder="Entry Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="trade">Trade</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="milestone">Milestone</SelectItem>
                      <SelectItem value="victim">Victim</SelectItem>
                      <SelectItem value="shadow">Shadow</SelectItem>
                      <SelectItem value="psychological">Psychological</SelectItem>
                    </SelectContent>
                  </Select>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-mono bg-background/50"
                        data-testid="button-date-filter"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFilter}
                        onSelect={setDateFilter}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Select value={corruptionFilter} onValueChange={setCorruptionFilter}>
                    <SelectTrigger className="font-mono bg-background/50" data-testid="select-corruption">
                      <SelectValue placeholder="Corruption Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="low">Low (0-33%)</SelectItem>
                      <SelectItem value="medium">Medium (34-66%)</SelectItem>
                      <SelectItem value="high">High (67-100%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Journal entries */}
            <Card className="bg-card/10 backdrop-blur-sm border-border/30">
              <CardContent className="p-6">
                <NoirJournal
                  entries={filteredEntries}
                  isLoading={entriesLoading}
                  currentCorruption={currentCorruption}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card className="bg-card/10 backdrop-blur-sm border-border/30">
              <CardHeader>
                <CardTitle className="font-mono flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Psychological Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                {psychAnalysis ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-background/50 rounded-md border border-border/50">
                      <h3 className="font-mono text-sm text-muted-foreground mb-2">
                        PATTERN ANALYSIS
                      </h3>
                      <p className="font-mono text-foreground/90 leading-relaxed">
                        {psychAnalysis.pattern}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-background/50 rounded-md border border-border/50">
                      <h3 className="font-mono text-sm text-muted-foreground mb-2">
                        PSYCHOLOGICAL ASSESSMENT
                      </h3>
                      <p className="font-mono text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {psychAnalysis.analysis}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs font-mono text-muted-foreground">
                        Last updated: {new Date(psychAnalysis.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Skull className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="font-mono text-muted-foreground">
                      No psychological profile available yet.<br />
                      The mind remains uncharted territory.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Terminal footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/5 backdrop-blur-sm border-t border-border/20">
        <div className="container mx-auto">
          <p className="font-mono text-xs text-muted-foreground text-center">
            &gt; TERMINAL SESSION ACTIVE | CORRUPTION TRACKING ENABLED | MORAL DECAY IN PROGRESS...
            <span className="animate-pulse ml-2">_</span>
          </p>
        </div>
      </div>
    </div>
  );
}