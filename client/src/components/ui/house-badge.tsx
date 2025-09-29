import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { HouseEmblem } from '@/components/ui/house-emblem';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';
import { useHouseTheme } from '@/hooks/useHouseTheme';

const houseBadgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-opacity-90 hover:bg-opacity-100",
        outline: "border-2 bg-transparent",
        secondary: "bg-opacity-20",
        ghost: "bg-transparent",
        solid: "text-white shadow-sm",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface HouseBadgeProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof houseBadgeVariants> {
  house?: MythologicalHouse;
  showIcon?: boolean;
  showMythology?: boolean;
  iconVariant?: 'primary' | 'secondary' | 'tertiary';
}

export function HouseBadge({ 
  house,
  variant = "default",
  size = "default",
  showIcon = true,
  showMythology = false,
  iconVariant = 'primary',
  className,
  children,
  ...props 
}: HouseBadgeProps) {
  const { currentHouse, getHouseTheme } = useHouseTheme();
  const targetHouse = house || currentHouse;
  const houseTheme = getHouseTheme(targetHouse);

  const getVariantClasses = () => {
    switch (variant) {
      case 'default':
        return `bg-house-${targetHouse} text-house-${targetHouse}-foreground`;
      case 'outline':
        return `border-house-${targetHouse} text-house-${targetHouse}`;
      case 'secondary':
        return `bg-house-${targetHouse} bg-opacity-20 text-house-${targetHouse}`;
      case 'ghost':
        return `text-house-${targetHouse} hover:bg-house-${targetHouse} hover:bg-opacity-10`;
      case 'solid':
        return `bg-house-${targetHouse} text-white`;
      default:
        return `bg-house-${targetHouse} text-house-${targetHouse}-foreground`;
    }
  };

  const getEmblemSize = () => {
    switch (size) {
      case 'sm':
        return 'sm' as const;
      case 'lg':
        return 'default' as const;
      default:
        return 'sm' as const;
    }
  };

  return (
    <div
      className={cn(
        houseBadgeVariants({ variant, size }),
        getVariantClasses(),
        "hover-elevate",
        className
      )}
      data-testid={`house-badge-${targetHouse}`}
      {...props}
    >
      {showIcon && (
        <HouseEmblem 
          house={targetHouse}
          size={getEmblemSize()}
          variant={variant === 'ghost' || variant === 'outline' ? 'ghost' : 'soft'}
          iconVariant={iconVariant}
          showTooltip={false}
        />
      )}
      <span className="font-medium">
        {children || houseTheme.name}
        {showMythology && (
          <span className="opacity-75 ml-1">({houseTheme.mythology})</span>
        )}
      </span>
    </div>
  );
}

// House token - smaller, more compact version for inline use
export interface HouseTokenProps extends Omit<HouseBadgeProps, 'showMythology' | 'children'> {
  showName?: boolean;
}

export function HouseToken({
  house,
  showIcon = true,
  showName = false,
  size = "sm",
  variant = "solid",
  ...props
}: HouseTokenProps) {
  const { currentHouse, getHouseTheme } = useHouseTheme();
  const targetHouse = house || currentHouse;
  const houseTheme = getHouseTheme(targetHouse);

  return (
    <HouseBadge
      house={targetHouse}
      size={size}
      variant={variant}
      showIcon={showIcon}
      showMythology={false}
      {...props}
    >
      {showName ? houseTheme.name : ''}
    </HouseBadge>
  );
}

// Predefined badge variants for each house
export function HeroesBadge(props: Omit<HouseBadgeProps, 'house'>) {
  return <HouseBadge house="heroes" {...props} />;
}

export function WisdomBadge(props: Omit<HouseBadgeProps, 'house'>) {
  return <HouseBadge house="wisdom" {...props} />;
}

export function PowerBadge(props: Omit<HouseBadgeProps, 'house'>) {
  return <HouseBadge house="power" {...props} />;
}

export function MysteryBadge(props: Omit<HouseBadgeProps, 'house'>) {
  return <HouseBadge house="mystery" {...props} />;
}

export function ElementsBadge(props: Omit<HouseBadgeProps, 'house'>) {
  return <HouseBadge house="elements" {...props} />;
}

export function TimeBadge(props: Omit<HouseBadgeProps, 'house'>) {
  return <HouseBadge house="time" {...props} />;
}

export function SpiritBadge(props: Omit<HouseBadgeProps, 'house'>) {
  return <HouseBadge house="spirit" {...props} />;
}