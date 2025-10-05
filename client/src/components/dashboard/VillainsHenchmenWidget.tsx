import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skull } from 'lucide-react';

interface Entity {
  id: string;
  canonicalName: string;
  subtype: string;
  universe: string;
  primaryImageUrl: string | null;
  alternateImageUrls: string[] | null;
  biography: string | null;
  teams: string[] | null;
  enemies: string[] | null;
  firstAppearance: string | null;
  creators: string[] | null;
  assetImageUrl: string | null;
  assetCoverImageUrl: string | null;
  assetId: string | null;
  assetSymbol: string | null;
  assetPrice: string | null;
  assetPriceChange: string | null;
}

interface VillainHenchmanPair {
  villain: Entity;
  henchman: Entity;
  relationship: {
    firstAppearance: string;
    keyIssues: string[];
    creators: string[];
    franchise: string;
    summary: string;
    priceImpact: string;
  };
}

export function VillainsHenchmenWidget() {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: VillainHenchmanPair[] }>({
    queryKey: ['/api/narrative/villain-henchman-pairs'],
    refetchInterval: 30000, // 30 seconds
  });

  const pairs = data?.data || [];

  // Get image URL with fallbacks
  const getImageUrl = (entity: Entity): string => {
    return entity.primaryImageUrl || 
           entity.assetImageUrl || 
           entity.assetCoverImageUrl || 
           '';
  };

  if (isLoading) {
    return (
      <Card className="h-full !bg-[#1A1F2E] villain-rimlight-hover" data-testid="widget-villains-henchmen">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-center gap-2">
            <Skull className="w-12 h-12 text-[#8b0000]/60 villain-icon-glow" data-testid="icon-skull" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
              Villains & Henchmen
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2].map((i) => (
              <div key={i} className="bg-[#252B3C] p-4 rounded-lg shrink-0 w-[900px] h-[400px] animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.success) {
    return (
      <Card className="h-full !bg-[#1A1F2E] villain-rimlight-hover" data-testid="widget-villains-henchmen">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-center gap-2">
            <Skull className="w-12 h-12 text-[#8b0000]/60 villain-icon-glow" data-testid="icon-skull" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
              Villains & Henchmen
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Failed to load villain-henchman pairs. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full !bg-[#1A1F2E] villain-rimlight-hover" data-testid="widget-villains-henchmen">
      <CardHeader className="pb-3 space-y-0">
        <div className="flex items-center gap-2">
          <Skull className="w-12 h-12 text-[#8b0000]/60 villain-icon-glow" data-testid="icon-skull" />
          <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
            Villains & Henchmen
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#8b0000]/30 scrollbar-track-transparent">
          {pairs.map((pair, index) => (
            <div key={index} className="bg-[#252B3C] p-4 rounded-lg shrink-0 w-[900px]" data-testid={`pair-villain-henchman-${index}`}>
              <div className="flex gap-6">
                {/* Villain Image */}
                <Link href={`/villain/${pair.villain.id}`} data-testid={`link-villain-${pair.villain.id}`}>
                  <div className="relative w-[280px] h-[380px] rounded-lg overflow-hidden shrink-0 cursor-pointer group">
                    {/* Background placeholder */}
                    <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
                      <Skull className="w-24 h-24 text-muted-foreground/30" />
                    </div>
                    
                    {/* Actual image */}
                    {getImageUrl(pair.villain) && (
                      <img
                        src={getImageUrl(pair.villain)}
                        alt={pair.villain.canonicalName}
                        className="absolute inset-0 w-full h-full object-contain z-10"
                        data-testid={`img-villain-${pair.villain.id}`}
                      />
                    )}
                    
                    {/* Rimlight on hover only */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                         style={{
                           boxShadow: '0 0 2px 2px #8b0000, 0 0 12px 12px rgba(139, 0, 0, 0.8), 0 0 24px 24px rgba(139, 0, 0, 0.4)',
                           borderRadius: '0.5rem'
                         }} />
                    
                    {/* Franchise Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded bg-black/70 backdrop-blur-sm border border-white/20 z-30">
                      <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '10pt', color: '#ffffff' }}>
                        {pair.villain.universe?.toUpperCase()}
                      </span>
                    </div>
                    
                    {/* VILLAIN label with rimlight on hover */}
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded bg-black/70 backdrop-blur-sm z-30 group-hover:shadow-[0_0_8px_2px_rgba(139,0,0,0.6)] transition-shadow duration-300">
                      <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt', color: '#8b0000' }}>
                        VILLAIN
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Henchman Image */}
                <Link href={`/henchman/${pair.henchman.id}`} data-testid={`link-henchman-${pair.henchman.id}`}>
                  <div className="relative w-[280px] h-[380px] rounded-lg overflow-hidden shrink-0 cursor-pointer group">
                    {/* Background placeholder */}
                    <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
                      <Skull className="w-24 h-24 text-muted-foreground/30" />
                    </div>
                    
                    {/* Actual image */}
                    {getImageUrl(pair.henchman) && (
                      <img
                        src={getImageUrl(pair.henchman)}
                        alt={pair.henchman.canonicalName}
                        className="absolute inset-0 w-full h-full object-contain z-10"
                        data-testid={`img-henchman-${pair.henchman.id}`}
                      />
                    )}
                    
                    {/* Rimlight on hover only */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                         style={{
                           boxShadow: '0 0 2px 2px #8b0000, 0 0 12px 12px rgba(139, 0, 0, 0.8), 0 0 24px 24px rgba(139, 0, 0, 0.4)',
                           borderRadius: '0.5rem'
                         }} />
                    
                    {/* Franchise Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded bg-black/70 backdrop-blur-sm border border-white/20 z-30">
                      <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '10pt', color: '#ffffff' }}>
                        {pair.henchman.universe?.toUpperCase()}
                      </span>
                    </div>
                    
                    {/* HENCHMAN label */}
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded bg-black/70 backdrop-blur-sm z-30">
                      <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt', color: '#8b0000' }}>
                        HENCHMAN
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Relationship Narrative */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt', color: '#ffffff' }}>
                      {pair.villain.canonicalName} & {pair.henchman.canonicalName}
                    </h3>
                    <Link 
                      href={`/franchise/${encodeURIComponent(pair.relationship.franchise)}`}
                      data-testid={`link-franchise-${pair.relationship.franchise}`}
                    >
                      <span 
                        className="inline-block mt-1 px-2 py-1 rounded cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_8px_2px_rgba(255,255,255,0.6)]"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt', color: '#89CFF0' }}
                      >
                        {pair.relationship.franchise}
                      </span>
                    </Link>
                  </div>

                  <p style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt', color: '#ffffff', lineHeight: '1.6' }}>
                    {pair.relationship.summary}
                  </p>

                  <div className="space-y-2">
                    <div>
                      <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt', color: '#8b0000' }}>
                        First Appearance:
                      </span>
                      <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt', color: '#ffffff', marginLeft: '8px' }}>
                        {pair.relationship.firstAppearance}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt', color: '#8b0000' }}>
                        Key Issues:
                      </span>
                      <ul className="list-disc list-inside mt-1">
                        {pair.relationship.keyIssues.map((issue, idx) => (
                          <li key={idx} style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt', color: '#ffffff' }}>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {pair.relationship.creators.length > 0 && (
                      <div>
                        <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt', color: '#8b0000' }}>
                          Creators:
                        </span>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {pair.relationship.creators.map((creator, idx) => (
                            <Link 
                              key={idx}
                              href={`/creator/${encodeURIComponent(creator)}`}
                              data-testid={`link-creator-${creator}`}
                            >
                              <span 
                                className="px-2 py-1 rounded bg-black/50 cursor-pointer hover:bg-black/70 transition-colors"
                                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt', color: '#89CFF0' }}
                              >
                                {creator}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt', color: '#8b0000' }}>
                        Price Impact:
                      </span>
                      <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt', color: '#50C878', marginLeft: '8px' }}>
                        {pair.relationship.priceImpact}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
