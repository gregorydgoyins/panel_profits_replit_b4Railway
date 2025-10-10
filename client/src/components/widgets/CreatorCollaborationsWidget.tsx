import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

interface CreatorCollaboration {
  id: string;
  teamName: string;
  creator1: {
    name: string;
    role: string;
    imageUrl: string;
  };
  creator2: {
    name: string;
    role: string;
    imageUrl: string;
  };
  notableWorks: Array<{
    title: string;
    publisher: string;
    year: string;
    coverUrl: string;
  }>;
  runsCount: number;
  issuesCount: number;
  legacy: string;
  impact: string;
}

export function CreatorCollaborationsWidget() {
  const { data: collaborations, isLoading } = useQuery<CreatorCollaboration[]>({
    queryKey: ['/api/creators/collaborations'],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card className="p-6 bg-[#1A1F2E] border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg text-indigo-100">Creator Collaborations</h3>
        </div>
        <div className="text-zinc-500 text-sm">Loading legendary partnerships...</div>
      </Card>
    );
  }

  if (!collaborations || collaborations.length === 0) {
    return (
      <Card className="p-6 bg-[#1A1F2E] border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg text-indigo-100">Creator Collaborations</h3>
        </div>
        <div className="text-zinc-500 text-sm">No creator collaborations available</div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-[#1A1F2E] border-zinc-800 relative overflow-hidden">
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]" />

      <div className="flex items-center gap-3 mb-6 relative">
        <Users className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg text-indigo-100">Creator Collaborations</h3>
        <div className="ml-auto text-xs text-zinc-500">Legendary Partnerships</div>
      </div>

      <div className="space-y-6 relative">
        {collaborations.map((collab) => (
          <div
            key={collab.id}
            className="border border-zinc-800 bg-black/30 p-4 hover-elevate transition-all duration-300"
            data-testid={`collaboration-${collab.id}`}
          >
            {/* Team Header */}
            <div className="flex items-start gap-4 mb-4">
              {/* Creator 1 */}
              <div className="flex items-center gap-3 flex-1">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/30">
                  <img
                    src={collab.creator1.imageUrl}
                    alt={collab.creator1.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-sm text-indigo-100" data-testid={`creator1-name-${collab.id}`}>
                    {collab.creator1.name}
                  </div>
                  <div className="text-xs text-zinc-500">{collab.creator1.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-indigo-400">
                <div className="w-8 h-px bg-indigo-500/30" />
                <Users className="w-4 h-4" />
                <div className="w-8 h-px bg-indigo-500/30" />
              </div>

              {/* Creator 2 */}
              <div className="flex items-center gap-3 flex-1 flex-row-reverse">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/30">
                  <img
                    src={collab.creator2.imageUrl}
                    alt={collab.creator2.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="text-right">
                  <div className="text-sm text-indigo-100" data-testid={`creator2-name-${collab.id}`}>
                    {collab.creator2.name}
                  </div>
                  <div className="text-xs text-zinc-500">{collab.creator2.role}</div>
                </div>
              </div>
            </div>

            {/* Team Name */}
            <div className="text-center mb-4">
              <h4 className="text-base text-white mb-1" data-testid={`team-name-${collab.id}`}>
                {collab.teamName}
              </h4>
              <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{collab.runsCount} runs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>{collab.issuesCount} issues</span>
                </div>
              </div>
            </div>

            {/* Notable Works */}
            <div className="mb-4">
              <div className="text-xs text-zinc-400 mb-2">Notable Works</div>
              <div className="grid grid-cols-3 gap-2">
                {collab.notableWorks.map((work, idx) => (
                  <div
                    key={idx}
                    className="relative group"
                    data-testid={`notable-work-${collab.id}-${idx}`}
                  >
                    <div className="aspect-[2/3] overflow-hidden border border-zinc-700">
                      <img
                        src={work.coverUrl}
                        alt={work.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-1">
                      <div className="text-xs text-zinc-300 line-clamp-1">{work.title}</div>
                      <div className="text-xs text-zinc-600">{work.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legacy & Impact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Award className="w-3 h-3 text-yellow-500" />
                  <div className="text-xs text-zinc-400">Legacy</div>
                </div>
                <div className="text-xs text-zinc-300" data-testid={`legacy-${collab.id}`}>
                  {collab.legacy}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <div className="text-xs text-zinc-400">Market Impact</div>
                </div>
                <div className="text-xs text-zinc-300" data-testid={`impact-${collab.id}`}>
                  {collab.impact}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
