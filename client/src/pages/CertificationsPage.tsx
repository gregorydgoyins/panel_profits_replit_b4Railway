import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLocation } from 'wouter';
import { Award, Lock, CheckCircle2, TrendingUp, Building2, LineChart, Users } from 'lucide-react';

interface CareerPathway {
  id: string;
  pathway: string;
  level: string;
  name: string;
  description: string;
  displayOrder: number;
  baseSalaryMax: string;
  tradingFeatureUnlocks: {
    features: string[];
    permissions: Record<string, boolean>;
  };
}

interface UserProgress {
  pathway: string;
  coursesPassed: number;
  isCertified: boolean;
  isMasterCertified: boolean;
  currentSalaryMax: string;
}

const pathwayIcons = {
  family_office: Building2,
  hedge_fund: LineChart,
  agency: Users,
};

const pathwayColors = {
  family_office: 'text-blue-500',
  hedge_fund: 'text-purple-500',
  agency: 'text-green-500',
};

export default function CertificationsPage() {
  const [, setLocation] = useLocation();

  const { data: pathways, isLoading: loadingPathways } = useQuery<CareerPathway[]>({
    queryKey: ['/api/certifications/pathways'],
  });

  const { data: userProgress } = useQuery<UserProgress[]>({
    queryKey: ['/api/certifications/progress'],
  });

  const getPathwayProgress = (pathway: string) => {
    return userProgress?.find(p => p.pathway === pathway);
  };

  const PathwayCard = ({ pathway }: { pathway: CareerPathway }) => {
    const progress = getPathwayProgress(pathway.pathway);
    const Icon = pathwayIcons[pathway.pathway as keyof typeof pathwayIcons] || Award;
    const colorClass = pathwayColors[pathway.pathway as keyof typeof pathwayColors];
    
    const isLocked = pathway.displayOrder > 0 && !progress;
    const passedCourses = progress?.coursesPassed || 0;
    const progressPercent = (passedCourses / 5) * 100;

    return (
      <Card key={pathway.id} className="hover-elevate" data-testid={`card-pathway-${pathway.pathway}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`${colorClass}`}>
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-lg" data-testid={`text-pathway-name-${pathway.pathway}`}>
                  {pathway.name}
                </CardTitle>
                <CardDescription>{pathway.description}</CardDescription>
              </div>
            </div>
            {isLocked && <Lock className="h-5 w-5 text-muted-foreground" data-testid={`icon-locked-${pathway.pathway}`} />}
            {progress?.isCertified && <CheckCircle2 className="h-5 w-5 text-green-500" data-testid={`icon-certified-${pathway.pathway}`} />}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          {progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span data-testid={`text-courses-passed-${pathway.pathway}`}>{passedCourses}/5 courses passed</span>
                <span>{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} data-testid={`progress-pathway-${pathway.pathway}`} />
            </div>
          )}

          {/* Certification Status */}
          <div className="flex gap-2">
            {progress?.isCertified && (
              <Badge variant="default" data-testid={`badge-certified-${pathway.pathway}`}>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Certified (100% Bonus)
              </Badge>
            )}
            {progress?.isMasterCertified && (
              <Badge variant="default" className="bg-yellow-600" data-testid={`badge-master-${pathway.pathway}`}>
                <Award className="h-3 w-3 mr-1" />
                Master (150% Bonus)
              </Badge>
            )}
          </div>

          {/* Salary & Unlocks */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span data-testid={`text-salary-max-${pathway.pathway}`}>
                Max Salary: ${parseFloat(pathway.baseSalaryMax).toLocaleString()}
              </span>
            </div>
            {pathway.tradingFeatureUnlocks?.features && (
              <div className="flex flex-wrap gap-1">
                {pathway.tradingFeatureUnlocks.features.slice(0, 3).map(feature => (
                  <Badge key={feature} variant="outline" className="text-xs" data-testid={`badge-feature-${feature}`}>
                    {feature.replace(/_/g, ' ')}
                  </Badge>
                ))}
                {pathway.tradingFeatureUnlocks.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{pathway.tradingFeatureUnlocks.features.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            className="w-full"
            onClick={() => setLocation(`/certifications/${pathway.pathway}`)}
            disabled={isLocked}
            data-testid={`button-view-pathway-${pathway.pathway}`}
          >
            {isLocked ? 'Locked' : progress ? 'Continue' : 'Start'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (loadingPathways) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary rounded-full animate-spin border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading certifications...</p>
        </div>
      </div>
    );
  }

  const associatePathway = pathways?.find(p => p.pathway === 'associate');
  const careerPathways = pathways?.filter(p => p.pathway !== 'associate') || [];

  return (
    <div className="space-y-6" data-testid="page-certifications">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Career Certifications</h1>
        <p className="text-muted-foreground">
          Advance your trading career through professional certification pathways. Pass 3/5 courses for certification (100% salary bonus), 
          or master all 5/5 courses for elite status (150% salary bonus).
        </p>
      </div>

      {/* Associate Foundation (Universal) */}
      {associatePathway && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold" data-testid="text-section-associate">Associate Foundation (Required)</h2>
          <PathwayCard pathway={associatePathway} />
        </div>
      )}

      {/* Career Pathways */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" data-testid="text-section-pathways">Career Pathways</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {careerPathways.map(pathway => (
            <PathwayCard key={pathway.id} pathway={pathway} />
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certification Benefits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• <strong>3 Free Attempts:</strong> Take each exam up to 3 times without penalty</p>
          <p>• <strong>4th Attempt Fee:</strong> Subsequent retries deducted from subscription balance</p>
          <p>• <strong>Hidden Bonuses:</strong> Salary bonuses revealed only after passing certification</p>
          <p>• <strong>Trading Unlocks:</strong> Gain access to advanced features (options, bonds, derivatives)</p>
          <p>• <strong>Career Progression:</strong> Climb from Associate to pathway mastery (Family Office Owner, Hedge Fund Owner, Agency Owner)</p>
        </CardContent>
      </Card>
    </div>
  );
}
