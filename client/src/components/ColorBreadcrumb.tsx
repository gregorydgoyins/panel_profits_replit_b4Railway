import { ChevronRight, LayoutDashboard, TrendingUp, PieChart, Newspaper, FlaskConical, GraduationCap, BarChart3, Briefcase } from "lucide-react";
import { Link } from "wouter";

interface BreadcrumbSegment {
  label: string;
  href: string;
  category: "dashboard" | "trading" | "portfolio" | "markets" | "news" | "research" | "learn" | "analytics";
}

interface ColorBreadcrumbProps {
  segments: BreadcrumbSegment[];
  currentPage: string;
}

const categoryConfig = {
  dashboard: {
    color: "text-purple-400",
    borderColor: "border-purple-500/60",
    hoverBg: "hover:bg-purple-500/10",
    icon: LayoutDashboard,
  },
  trading: {
    color: "text-blue-400",
    borderColor: "border-blue-500/60",
    hoverBg: "hover:bg-blue-500/10",
    icon: TrendingUp,
  },
  portfolio: {
    color: "text-orange-400",
    borderColor: "border-orange-500/60",
    hoverBg: "hover:bg-orange-500/10",
    icon: Briefcase,
  },
  markets: {
    color: "text-orange-400",
    borderColor: "border-orange-500/60",
    hoverBg: "hover:bg-orange-500/10",
    icon: PieChart,
  },
  news: {
    color: "text-green-400",
    borderColor: "border-green-500/60",
    hoverBg: "hover:bg-green-500/10",
    icon: Newspaper,
  },
  research: {
    color: "text-pink-400",
    borderColor: "border-pink-500/60",
    hoverBg: "hover:bg-pink-500/10",
    icon: FlaskConical,
  },
  learn: {
    color: "text-cyan-400",
    borderColor: "border-cyan-500/60",
    hoverBg: "hover:bg-cyan-500/10",
    icon: GraduationCap,
  },
  analytics: {
    color: "text-green-400",
    borderColor: "border-green-500/60",
    hoverBg: "hover:bg-green-500/10",
    icon: BarChart3,
  },
};

export function ColorBreadcrumb({ segments, currentPage }: ColorBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm font-light" aria-label="Breadcrumb">
      {segments.map((segment, index) => {
        const config = categoryConfig[segment.category];
        const Icon = config.icon;
        
        return (
          <div key={segment.href} className="flex items-center gap-2">
            <Link href={segment.href} data-testid={`breadcrumb-${segment.category}`}>
              <div 
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-md
                  border ${config.borderColor}
                  ${config.color}
                  ${config.hoverBg}
                  transition-all duration-200
                  cursor-pointer
                `}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="uppercase tracking-wider">{segment.label}</span>
              </div>
            </Link>
            
            {index < segments.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 text-indigo-500/40" />
            )}
          </div>
        );
      })}
      
      {/* Current page - no link, slightly dimmed */}
      <ChevronRight className="h-3.5 w-3.5 text-indigo-500/40" />
      <div className="px-3 py-1.5 text-indigo-300/60 uppercase tracking-wider">
        {currentPage}
      </div>
    </nav>
  );
}
