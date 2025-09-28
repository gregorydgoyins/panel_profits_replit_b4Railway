import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HouseEmblem } from '@/components/ui/house-emblem';
import { HouseBadge } from '@/components/ui/house-badge';
import { useHouseTheme } from '@/hooks/useHouseTheme';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';

interface HouseSelectorProps {
  onHouseSelect?: (house: MythologicalHouse) => void;
  variant?: 'compact' | 'detailed' | 'grid';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function HouseSelector({ 
  onHouseSelect,
  variant = 'compact',
  size = 'default',
  className 
}: HouseSelectorProps) {
  const { currentHouse, houseTheme, allHouses, setCurrentHouse } = useHouseTheme();
  const [open, setOpen] = useState(false);

  const handleHouseSelect = (house: MythologicalHouse) => {
    setCurrentHouse(house);
    onHouseSelect?.(house);
    setOpen(false);
  };

  if (variant === 'grid') {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3", className)}>
        {allHouses.map((house) => (
          <Card
            key={house.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover-elevate",
              currentHouse === house.id && "ring-2 ring-primary ring-offset-2"
            )}
            onClick={() => handleHouseSelect(house.id)}
            data-testid={`house-selector-${house.id}`}
          >
            <CardContent className="p-4 text-center space-y-2">
              <HouseEmblem 
                house={house.id}
                size="lg"
                variant="soft"
                className="mx-auto"
              />
              <div>
                <div className="font-medium text-sm">{house.name}</div>
                <div className="text-xs text-muted-foreground">{house.mythology}</div>
                <div className="text-xs text-muted-foreground mt-1">{house.description}</div>
              </div>
              {currentHouse === house.id && (
                <Check className="h-4 w-4 text-primary mx-auto" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between min-w-[200px]", className)}
            data-testid="house-selector-trigger"
          >
            <div className="flex items-center gap-2">
              <HouseEmblem house={currentHouse} size="sm" variant="soft" />
              <div className="text-left">
                <div className="font-medium">{houseTheme.name}</div>
                <div className="text-xs text-muted-foreground">{houseTheme.mythology}</div>
              </div>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-2" data-testid="house-selector-content">
          <div className="space-y-1">
            {allHouses.map((house) => (
              <Button
                key={house.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-auto p-3",
                  currentHouse === house.id && "bg-accent"
                )}
                onClick={() => handleHouseSelect(house.id)}
                data-testid={`house-option-${house.id}`}
              >
                <HouseEmblem house={house.id} size="sm" variant="soft" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{house.name}</div>
                  <div className="text-xs text-muted-foreground">{house.mythology}</div>
                  <div className="text-xs text-muted-foreground">{house.description}</div>
                </div>
                {currentHouse === house.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Compact variant (default)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={cn("justify-between", className)}
          data-testid="house-selector-compact"
        >
          <HouseBadge house={currentHouse} size="sm" variant="ghost" showIcon />
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" data-testid="house-selector-compact-content">
        <div className="space-y-1">
          {allHouses.map((house) => (
            <Button
              key={house.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                currentHouse === house.id && "bg-accent"
              )}
              onClick={() => handleHouseSelect(house.id)}
              data-testid={`house-option-compact-${house.id}`}
            >
              <HouseEmblem house={house.id} size="sm" variant="ghost" />
              {house.name}
              {currentHouse === house.id && (
                <Check className="ml-auto h-4 w-4 text-primary" />
              )}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}