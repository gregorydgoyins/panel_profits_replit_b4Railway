import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface JournalEntry {
  id: string;
  entryType: 'trade' | 'daily' | 'milestone' | 'victim' | 'shadow' | 'psychological';
  content: string;
  mood?: string;
  corruptionAtTime: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

interface NoirJournalProps {
  entries: JournalEntry[];
  isLoading?: boolean;
  currentCorruption?: number;
  className?: string;
}

// Typewriter effect hook
function useTypewriter(text: string, speed: number = 30) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let index = 0;
    setIsTyping(true);
    setDisplayedText("");

    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayedText, isTyping };
}

// Single journal entry component
function JournalEntryItem({ 
  entry, 
  isNew = false 
}: { 
  entry: JournalEntry; 
  isNew?: boolean;
}) {
  const { displayedText, isTyping } = useTypewriter(
    isNew ? entry.content : "", 
    isNew ? 25 : 0
  );
  
  const corruption = parseFloat(entry.corruptionAtTime);
  
  // Style based on corruption level
  const getEntryStyle = () => {
    if (corruption > 80) {
      return "font-mono text-red-900 dark:text-red-100 opacity-90";
    } else if (corruption > 60) {
      return "font-mono text-red-800 dark:text-red-200 opacity-85";
    } else if (corruption > 40) {
      return "font-mono text-foreground/90";
    } else if (corruption > 20) {
      return "font-mono text-foreground/80";
    }
    return "font-mono text-foreground/70";
  };

  const getTypeIcon = () => {
    switch (entry.entryType) {
      case 'trade': return '💰';
      case 'victim': return '🩸';
      case 'milestone': return '🔥';
      case 'shadow': return '🌑';
      case 'psychological': return '🧠';
      case 'daily': return '📝';
      default: return '📜';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mb-6"
      data-testid={`journal-entry-${entry.id}`}
    >
      {/* Blood splatter effect for high corruption */}
      {corruption > 70 && (
        <div className="absolute -inset-2 opacity-10">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-600 rounded-full filter blur-xl" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-red-700 rounded-full filter blur-2xl" />
        </div>
      )}
      
      <div className="relative p-4 bg-card/50 backdrop-blur-sm rounded-md border border-border/50">
        <div className="flex items-start gap-3">
          <span className="text-2xl opacity-60">{getTypeIcon()}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                {entry.entryType} ENTRY
              </span>
              <time className="text-xs font-mono text-muted-foreground">
                {new Date(entry.createdAt).toLocaleString()}
              </time>
            </div>
            
            <div className={getEntryStyle()}>
              {isNew && isTyping ? (
                <>
                  {displayedText}
                  <span className="animate-pulse">|</span>
                </>
              ) : (
                <div className="whitespace-pre-wrap leading-relaxed">
                  {entry.content}
                </div>
              )}
            </div>

            {entry.mood && (
              <div className="mt-2 text-xs font-mono text-muted-foreground">
                MOOD: {entry.mood.toUpperCase()}
              </div>
            )}
            
            <div className="mt-2 text-xs font-mono text-muted-foreground opacity-60">
              CORRUPTION: {corruption.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Ink bleed effect */}
      {corruption > 50 && (
        <div 
          className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-b from-foreground/10 to-transparent"
          style={{ filter: 'blur(4px)' }}
        />
      )}
    </motion.div>
  );
}

export function NoirJournal({ 
  entries, 
  isLoading = false,
  currentCorruption = 0,
  className = ""
}: NoirJournalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [newEntryId, setNewEntryId] = useState<string | null>(null);

  // Track new entries for typewriter effect
  useEffect(() => {
    if (entries.length > 0) {
      const latestEntry = entries[0];
      const isRecent = Date.now() - new Date(latestEntry.createdAt).getTime() < 5000;
      if (isRecent) {
        setNewEntryId(latestEntry.id);
        setTimeout(() => setNewEntryId(null), 10000);
      }
    }
  }, [entries]);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className={`bg-background/50 backdrop-blur ${className}`}>
        <CardContent className="flex items-center justify-center h-64">
          <p className="font-mono text-muted-foreground text-center">
            No journal entries yet.<br />
            The pages remain blank...<br />
            For now.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div 
      className={`relative ${className}`}
      style={{
        background: `
          radial-gradient(ellipse at top, transparent, rgba(0,0,0,0.1)),
          linear-gradient(to bottom, transparent, rgba(0,0,0,0.05))
        `,
      }}
    >
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Corruption overlay */}
      {currentCorruption > 60 && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, 
              transparent, 
              rgba(139, 0, 0, ${currentCorruption / 1000})
            )`,
          }}
        />
      )}

      <ScrollArea className="h-[600px] pr-4" ref={scrollRef}>
        <AnimatePresence>
          {entries.map((entry) => (
            <JournalEntryItem
              key={entry.id}
              entry={entry}
              isNew={entry.id === newEntryId}
            />
          ))}
        </AnimatePresence>
      </ScrollArea>

      {/* Terminal cursor */}
      <div className="mt-4 font-mono text-sm text-muted-foreground">
        <span className="opacity-60">&gt;</span>
        <span className="animate-pulse ml-1">_</span>
      </div>
    </div>
  );
}