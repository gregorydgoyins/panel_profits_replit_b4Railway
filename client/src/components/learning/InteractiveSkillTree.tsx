import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, BookOpen, Crown, Zap, Flame, Clock, Users, Star,
  Lock, CheckCircle, Eye, ArrowRight, ArrowUp, ArrowDown,
  Gem, Trophy, Target, Brain, Heart, Sparkles,
  Sword, Feather, Mountain, Waves, Sun, Moon, Compass
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useHouseTheme } from '@/hooks/useHouseTheme';
import { HouseEmblem } from '@/components/ui/house-emblem';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';

interface SkillNode {
  id: string;
  name: string;
  description: string;
  sacredName: string;
  houseId: string;
  skillCategory: string;
  skillType: 'passive' | 'active' | 'toggle' | 'upgrade';
  tier: number;
  rarityLevel: 'common' | 'rare' | 'epic' | 'legendary';
  tradingBonuses: {
    feeReduction?: number;
    profitMultiplier?: number;
    riskReduction?: number;
    speedBonus?: number;
    accessLevel?: string;
    specialFeatures?: string[];
  };
  prerequisites: {
    skills?: string[];
    lessons?: string[];
    karma?: number;
    houseLevel?: number;
  };
  position: {
    x: number;
    y: number;
    tier: number;
  };
  connections: string[];
  mysticalAura: string;
  unlockRitual: string;
  masteryCriteria: {
    usage: number;
    accuracy: number;
    timeRequired: number;
  };
  isUnlocked: boolean;
  masteryLevel: number;
  canUnlock: boolean;
}

interface SkillTreeData {
  houseId: string;
  houseName: string;
  specialization: string;
  tiers: Array<{
    tier: number;
    name: string;
    description: string;
    requiredKarma: number;
    skills: SkillNode[];
  }>;
  connections: Array<{
    from: string;
    to: string;
    type: 'prerequisite' | 'synergy' | 'upgrade';
  }>;
  progression: {
    totalSkills: number;
    unlockedSkills: number;
    masterSkills: number;
    overallMastery: number;
  };
}

interface InteractiveSkillTreeProps {
  houseId?: MythologicalHouse;
  onSkillSelect?: (skill: SkillNode) => void;
  compact?: boolean;
}

const SKILL_TIER_NAMES = {
  1: 'Initiate Abilities',
  2: 'Adept Powers',
  3: 'Master Arts',
  4: 'Grandmaster Mastery',
  5: 'Legendary Transcendence'
};

const SKILL_CATEGORIES = {
  trading: { name: 'Trading Mastery', icon: Target, color: 'text-green-400' },
  analysis: { name: 'Market Analysis', icon: Brain, color: 'text-blue-400' },
  risk: { name: 'Risk Management', icon: Shield, color: 'text-red-400' },
  social: { name: 'Social Trading', icon: Users, color: 'text-purple-400' },
  mystical: { name: 'Mystical Arts', icon: Sparkles, color: 'text-yellow-400' },
  temporal: { name: 'Time Magic', icon: Clock, color: 'text-slate-400' },
  elemental: { name: 'Elemental Control', icon: Flame, color: 'text-orange-400' }
};

export function InteractiveSkillTree({ houseId, onSkillSelect, compact = false }: InteractiveSkillTreeProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'grid' | 'categories'>('tree');
  const [filterTier, setFilterTier] = useState<number | 'all'>('all');
  const [mysticalEnergy, setMysticalEnergy] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { currentHouse, getHouseTheme, allHouses } = useHouseTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  
  const targetHouse = houseId || currentHouse;
  const house = getHouseTheme(targetHouse);

  // Mystical energy animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMysticalEnergy(prev => (prev + 1) % 360);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Fetch skill tree data
  const { data: skillTree, isLoading } = useQuery<SkillTreeData>({
    queryKey: ['/api/learning/skills/tree', targetHouse],
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch user skill unlocks
  const { data: userSkills, isLoading: userSkillsLoading } = useQuery({
    queryKey: ['/api/learning/progress/skills'],
    enabled: !!user,
    staleTime: 1 * 60 * 1000,
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 text-gray-400 bg-gray-500/10';
      case 'rare': return 'border-blue-500 text-blue-400 bg-blue-500/10';
      case 'epic': return 'border-purple-500 text-purple-400 bg-purple-500/10';
      case 'legendary': return 'border-yellow-500 text-yellow-400 bg-yellow-500/10';
      default: return 'border-gray-500 text-gray-400 bg-gray-500/10';
    }
  };

  const getSkillIcon = (category: string) => {
    return SKILL_CATEGORIES[category as keyof typeof SKILL_CATEGORIES]?.icon || Gem;
  };

  const renderSkillNode = (skill: SkillNode, size: 'sm' | 'md' | 'lg' = 'md') => {
    const IconComponent = getSkillIcon(skill.skillCategory);
    const rarityStyle = getRarityColor(skill.rarityLevel);
    const isSelected = selectedSkill?.id === skill.id;
    const isHovered = hoveredSkill === skill.id;
    
    const nodeSize = size === 'sm' ? 'w-12 h-12' : size === 'lg' ? 'w-20 h-20' : 'w-16 h-16';
    const iconSize = size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-10 w-10' : 'h-8 w-8';

    return (
      <div
        key={skill.id}
        className={`relative ${nodeSize} cursor-pointer transition-all duration-300 ${
          isSelected ? 'scale-110 z-10' : isHovered ? 'scale-105' : ''
        }`}
        onMouseEnter={() => setHoveredSkill(skill.id)}
        onMouseLeave={() => setHoveredSkill(null)}
        onClick={() => {
          setSelectedSkill(skill);
          onSkillSelect?.(skill);
        }}
        data-testid={`skill-node-${skill.id}`}
      >
        {/* Skill Node */}
        <div
          className={`w-full h-full rounded-xl border-2 ${rarityStyle} flex items-center justify-center relative overflow-hidden ${
            skill.isUnlocked ? 'opacity-100' : 'opacity-50'
          } ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
        >
          {/* Background glow effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              transform: `rotate(${mysticalEnergy * 0.5}deg)`,
              opacity: isHovered ? 0.3 : 0
            }}
          />
          
          {/* Skill Icon */}
          <IconComponent className={`${iconSize} relative z-10`} />
          
          {/* Status Indicators */}
          <div className="absolute top-1 right-1">
            {skill.isUnlocked ? (
              skill.masteryLevel >= 100 ? (
                <Crown className="h-3 w-3 text-yellow-400" />
              ) : (
                <CheckCircle className="h-3 w-3 text-green-400" />
              )
            ) : skill.canUnlock ? (
              <Sparkles className="h-3 w-3 text-blue-400 animate-pulse" />
            ) : (
              <Lock className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          
          {/* Mastery Progress */}
          {skill.isUnlocked && (
            <div className="absolute bottom-1 left-1 right-1">
              <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                  style={{ width: `${skill.masteryLevel}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Skill Name (for larger sizes) */}
        {size !== 'sm' && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-xs font-medium text-foreground truncate max-w-20">
              {skill.sacredName || skill.name}
            </div>
            <div className="text-xs text-muted-foreground">
              Tier {skill.tier}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSkillConnections = () => {
    if (!skillTree || viewMode !== 'tree') return null;

    return (
      <svg
        ref={svgRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {skillTree.connections.map((connection, index) => {
          const fromSkill = skillTree.tiers.flatMap(t => t.skills).find(s => s.id === connection.from);
          const toSkill = skillTree.tiers.flatMap(t => t.skills).find(s => s.id === connection.to);
          
          if (!fromSkill || !toSkill) return null;

          const isActive = fromSkill.isUnlocked && toSkill.canUnlock;
          const strokeColor = isActive ? 'stroke-primary' : 'stroke-muted-foreground';
          const strokeOpacity = isActive ? '0.8' : '0.3';

          return (
            <line
              key={index}
              x1={fromSkill.position.x}
              y1={fromSkill.position.y}
              x2={toSkill.position.x}
              y2={toSkill.position.y}
              className={`${strokeColor} stroke-2`}
              strokeOpacity={strokeOpacity}
              strokeDasharray={connection.type === 'synergy' ? '5,5' : '0'}
            />
          );
        })}
      </svg>
    );
  };

  if (isLoading || !skillTree) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {!compact && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <HouseEmblem house={targetHouse} size="lg" />
            <div>
              <h2 className="text-2xl font-bold">{skillTree.houseName} Skill Tree</h2>
              <p className="text-muted-foreground">{skillTree.specialization}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {skillTree.progression.unlockedSkills}/{skillTree.progression.totalSkills}
            </div>
            <div className="text-sm text-muted-foreground">Skills Unlocked</div>
            <div className="text-sm text-accent">
              {Math.round(skillTree.progression.overallMastery)}% Mastery
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">View:</span>
          <Button
            variant={viewMode === 'tree' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('tree')}
            data-testid="view-tree"
          >
            Tree
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            data-testid="view-grid"
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'categories' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('categories')}
            data-testid="view-categories"
          >
            Categories
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tier:</span>
          <Button
            variant={filterTier === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterTier('all')}
          >
            All
          </Button>
          {[1, 2, 3, 4, 5].map(tier => (
            <Button
              key={tier}
              variant={filterTier === tier ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterTier(tier)}
            >
              {tier}
            </Button>
          ))}
        </div>
      </div>

      {/* Progress Overview */}
      {!compact && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{skillTree.progression.unlockedSkills}</div>
                <div className="text-sm text-muted-foreground">Unlocked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{skillTree.progression.masterSkills}</div>
                <div className="text-sm text-muted-foreground">Mastered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{skillTree.progression.totalSkills - skillTree.progression.unlockedSkills}</div>
                <div className="text-sm text-muted-foreground">Locked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{Math.round(skillTree.progression.overallMastery)}%</div>
                <div className="text-sm text-muted-foreground">Overall Mastery</div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={skillTree.progression.overallMastery} className="h-3" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skill Tree Display */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Skill Tree */}
        <div className="lg:col-span-3">
          {viewMode === 'tree' && (
            <Card className="relative min-h-96 overflow-hidden">
              <CardContent className="p-6 relative">
                {renderSkillConnections()}
                
                {skillTree.tiers
                  .filter(tier => filterTier === 'all' || tier.tier === filterTier)
                  .map((tier, tierIndex) => (
                    <div key={tier.tier} className="mb-12 last:mb-0">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-primary">
                          {SKILL_TIER_NAMES[tier.tier as keyof typeof SKILL_TIER_NAMES] || `Tier ${tier.tier}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">{tier.description}</p>
                        <Badge variant="outline" className="mt-2">
                          {tier.requiredKarma} Experience Required
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap justify-center gap-8">
                        {tier.skills.map((skill) => (
                          <div key={skill.id} className="mb-8">
                            {renderSkillNode(skill, 'lg')}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}

          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {skillTree.tiers
                .filter(tier => filterTier === 'all' || tier.tier === filterTier)
                .flatMap(tier => tier.skills)
                .map((skill) => (
                  <Card key={skill.id} className="hover-elevate cursor-pointer">
                    <CardContent className="p-3 text-center">
                      {renderSkillNode(skill, 'sm')}
                      <div className="mt-2">
                        <h4 className="font-medium text-xs truncate">
                          {skill.sacredName || skill.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Tier {skill.tier}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}

          {viewMode === 'categories' && (
            <div className="space-y-6">
              {Object.entries(SKILL_CATEGORIES).map(([categoryId, category]) => {
                const categorySkills = skillTree.tiers
                  .flatMap(tier => tier.skills)
                  .filter(skill => skill.skillCategory === categoryId);

                if (categorySkills.length === 0) return null;

                return (
                  <Card key={categoryId}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <category.icon className={`h-6 w-6 ${category.color}`} />
                        <h3 className="text-xl font-semibold">{category.name}</h3>
                        <Badge variant="outline">
                          {categorySkills.filter(s => s.isUnlocked).length}/{categorySkills.length}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {categorySkills.map((skill) => (
                          <div key={skill.id} className="text-center">
                            {renderSkillNode(skill, 'md')}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Skill Detail Panel */}
        <div className="lg:col-span-1">
          {selectedSkill ? (
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  {renderSkillNode(selectedSkill, 'lg')}
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{selectedSkill.sacredName || selectedSkill.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{selectedSkill.description}</p>
                    <Badge className={getRarityColor(selectedSkill.rarityLevel)} variant="outline">
                      {selectedSkill.rarityLevel}
                    </Badge>
                  </div>

                  {selectedSkill.mysticalAura && (
                    <div className="text-center">
                      <p className="text-sm italic text-accent">"{selectedSkill.mysticalAura}"</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Trading Bonuses:</h4>
                    <div className="text-sm space-y-1">
                      {selectedSkill.tradingBonuses.feeReduction && (
                        <div>Fee Reduction: {selectedSkill.tradingBonuses.feeReduction}%</div>
                      )}
                      {selectedSkill.tradingBonuses.profitMultiplier && (
                        <div>Profit Multiplier: {selectedSkill.tradingBonuses.profitMultiplier}x</div>
                      )}
                      {selectedSkill.tradingBonuses.riskReduction && (
                        <div>Risk Reduction: {selectedSkill.tradingBonuses.riskReduction}%</div>
                      )}
                      {selectedSkill.tradingBonuses.specialFeatures && (
                        <div>
                          <div className="font-medium mt-2">Special Features:</div>
                          {selectedSkill.tradingBonuses.specialFeatures.map((feature, index) => (
                            <div key={index} className="text-xs text-muted-foreground">• {feature}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedSkill.prerequisites && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Prerequisites:</h4>
                      <div className="text-sm space-y-1">
                        {selectedSkill.prerequisites.karma && (
                          <div>Experience: {selectedSkill.prerequisites.karma}</div>
                        )}
                        {selectedSkill.prerequisites.houseLevel && (
                          <div>House Level: {selectedSkill.prerequisites.houseLevel}</div>
                        )}
                        {selectedSkill.prerequisites.skills && selectedSkill.prerequisites.skills.length > 0 && (
                          <div>Required Skills: {selectedSkill.prerequisites.skills.length}</div>
                        )}
                        {selectedSkill.prerequisites.lessons && selectedSkill.prerequisites.lessons.length > 0 && (
                          <div>Required Lessons: {selectedSkill.prerequisites.lessons.length}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedSkill.isUnlocked && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Mastery Progress:</h4>
                      <Progress value={selectedSkill.masteryLevel} className="h-2" />
                      <div className="text-xs text-muted-foreground text-center">
                        {selectedSkill.masteryLevel}% Complete
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    {selectedSkill.canUnlock && !selectedSkill.isUnlocked ? (
                      <Button className="w-full" data-testid="unlock-skill-button">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Unlock Skill
                      </Button>
                    ) : selectedSkill.isUnlocked ? (
                      <Button variant="outline" className="w-full" data-testid="view-skill-details-button">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    ) : (
                      <Button variant="ghost" className="w-full" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        Prerequisites Required
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-6">
              <CardContent className="p-6 text-center">
                <Gem className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Select a Skill</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any skill node to view its details and unlock requirements.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}