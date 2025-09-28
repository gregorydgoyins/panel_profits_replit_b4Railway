import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { getHouseIcon, HOUSE_COLOR_CLASSES, HOUSE_BACKGROUND_CLASSES } from '@/lib/houseIcons';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';
import { useHouseTheme } from '@/hooks/useHouseTheme';

const houseEmblemVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-all duration-200",
  {
    variants: {
      size: {
        sm: "h-6 w-6",
        default: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        "2xl": "h-20 w-20",
      },
      variant: {
        solid: "text-white shadow-lg",
        outline: "border-2 bg-transparent",
        ghost: "bg-transparent",
        soft: "bg-opacity-20",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "solid",
    },
  }
);

const houseIconVariants = cva("", {
  variants: {
    size: {
      sm: "h-3 w-3",
      default: "h-4 w-4", 
      lg: "h-6 w-6",
      xl: "h-8 w-8",
      "2xl": "h-10 w-10",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface HouseEmblemProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof houseEmblemVariants> {
  house?: MythologicalHouse;
  iconVariant?: 'primary' | 'secondary' | 'tertiary';
  showTooltip?: boolean;
}

export function HouseEmblem({ 
  house,
  size,
  variant = "solid",
  iconVariant = 'primary',
  showTooltip = true,
  className,
  ...props 
}: HouseEmblemProps) {
  const { currentHouse, getHouseTheme } = useHouseTheme();
  const targetHouse = house || currentHouse;
  const houseTheme = getHouseTheme(targetHouse);
  const IconComponent = getHouseIcon(targetHouse, iconVariant);

  const getVariantClasses = () => {
    switch (variant) {
      case 'solid':
        return `${HOUSE_BACKGROUND_CLASSES[targetHouse]} text-white`;
      case 'outline':
        return `border-house-${targetHouse} ${HOUSE_COLOR_CLASSES[targetHouse]}`;
      case 'ghost':
        return HOUSE_COLOR_CLASSES[targetHouse];
      case 'soft':
        return `${HOUSE_BACKGROUND_CLASSES[targetHouse]} bg-opacity-20 ${HOUSE_COLOR_CLASSES[targetHouse]}`;
      default:
        return `${HOUSE_BACKGROUND_CLASSES[targetHouse]} text-white`;
    }
  };

  return (
    <div
      className={cn(
        houseEmblemVariants({ size, variant }),
        getVariantClasses(),
        "group relative",
        className
      )}
      title={showTooltip ? `${houseTheme.name} (${houseTheme.mythology})` : undefined}
      data-testid={`house-emblem-${targetHouse}`}
      {...props}
    >
      <IconComponent 
        className={cn(houseIconVariants({ size }))}
      />
      
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200 bg-white" />
    </div>
  );
}

// Predefined emblem combinations for common use cases
export function EternityEmblem(props: Omit<HouseEmblemProps, 'house'>) {
  return <HouseEmblem house="eternity" {...props} />;
}

export function ConquestEmblem(props: Omit<HouseEmblemProps, 'house'>) {
  return <HouseEmblem house="conquest" {...props} />;
}

export function HeroesEmblem(props: Omit<HouseEmblemProps, 'house'>) {
  return <HouseEmblem house="heroes" {...props} />;
}

export function RagnarokEmblem(props: Omit<HouseEmblemProps, 'house'>) {
  return <HouseEmblem house="ragnarok" {...props} />;
}

export function BalanceEmblem(props: Omit<HouseEmblemProps, 'house'>) {
  return <HouseEmblem house="balance" {...props} />;
}

export function AncestorsEmblem(props: Omit<HouseEmblemProps, 'house'>) {
  return <HouseEmblem house="ancestors" {...props} />;
}

export function KarmaEmblem(props: Omit<HouseEmblemProps, 'house'>) {
  return <HouseEmblem house="karma" {...props} />;
}