import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Award, Book, TrendingUp, Briefcase, Calendar } from 'lucide-react';
import { Link } from 'wouter';

interface CreatorBio {
  name: string;
  role: string;
  biography: string;
  imageUrl: string | null;
  birthDate: string | null;
  nationality: string | null;
  activeYears: string | null;
  notableWorks: string[];
  awards: string[];
  totalIssues: number;
  marketInfluence: number;
  roleInThisIssue: string;
  contributionToComicArt: string;
  legacyStatement: string;
  styleSignature: string;
}

export default function CreatorBioPage() {
  const params = useParams();
  const creatorName = decodeURIComponent(params.name || '');

  const { data, isLoading, error } = useQuery<{ success: boolean; data: CreatorBio }>({
    queryKey: ['/api/creators/bio', creatorName],
    enabled: !!creatorName,
  });

  const creator = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen !bg-[#1A1F2E] p-8">
        <div className="max-w-5xl mx-auto">
          <div className="h-8 bg-muted rounded animate-pulse w-48 mb-8" />
          <Card>
            <CardHeader>
              <div className="h-10 bg-muted rounded animate-pulse w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-40 bg-muted rounded animate-pulse" />
              <div className="h-40 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen !bg-[#1A1F2E] p-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/" data-testid="link-back-home">
            <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Creator information not found. Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen !bg-[#1A1F2E] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with Back Button */}
        <Link href="/" data-testid="link-back-home">
          <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Main Profile Card */}
        <Card className="!bg-[#1A1F2E]">
          <CardHeader>
            <div className="flex items-start gap-6 mb-4">
              {/* Profile Image */}
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-border shrink-0">
                {creator.imageUrl ? (
                  <img
                    src={creator.imageUrl}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                    data-testid="img-creator-photo"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
                    <User className="w-16 h-16 text-primary/50" />
                  </div>
                )}
              </div>

              {/* Name and Role */}
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold mb-3">{creator.name}</CardTitle>
                <Badge className="mb-3 bg-primary text-primary-foreground text-base">
                  {creator.role}
                </Badge>
                
                <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
                  {creator.activeYears && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {creator.activeYears}
                    </div>
                  )}
                  {creator.nationality && (
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {creator.nationality}
                    </div>
                  )}
                  {creator.totalIssues > 0 && (
                    <div className="flex items-center gap-1">
                      <Book className="w-4 h-4" />
                      {creator.totalIssues.toLocaleString()} Issues
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Biography */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                Biography
              </h2>
              <p className="text-foreground/80 leading-relaxed text-lg">
                {creator.biography || `${creator.name} is a renowned ${creator.role} in the comic book industry, known for their distinctive style and significant contributions to the medium.`}
              </p>
            </section>

            {/* Role in This Issue */}
            {creator.roleInThisIssue && (
              <section className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary">Role in This Issue</h2>
                <p className="text-foreground/80 leading-relaxed text-lg">
                  {creator.roleInThisIssue}
                </p>
              </section>
            )}

            {/* Style Signature */}
            {creator.styleSignature && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Artistic Signature</h2>
                <p className="text-foreground/80 leading-relaxed text-lg">
                  {creator.styleSignature}
                </p>
              </section>
            )}

            {/* Contribution to Comic Art */}
            {creator.contributionToComicArt && (
              <section className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-400">Contribution to Comic Art History</h2>
                <p className="text-foreground/80 leading-relaxed text-lg">
                  {creator.contributionToComicArt}
                </p>
              </section>
            )}

            {/* Notable Works */}
            {creator.notableWorks && creator.notableWorks.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Book className="w-6 h-6 text-yellow-500" />
                  Notable Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {creator.notableWorks.map((work, idx) => (
                    <div key={idx} className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                      <Book className="w-4 h-4 text-yellow-500 shrink-0" />
                      <span className="text-foreground/80">{work}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Awards and Recognition */}
            {creator.awards && creator.awards.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-500" />
                  Awards & Recognition
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {creator.awards.map((award, idx) => (
                    <div key={idx} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500 shrink-0" />
                      <span className="text-foreground/80">{award}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Legacy Statement */}
            {creator.legacyStatement && (
              <section className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-green-500">Legacy & Influence</h2>
                <p className="text-foreground/80 leading-relaxed text-lg">
                  {creator.legacyStatement}
                </p>
              </section>
            )}

            {/* Market Influence */}
            {creator.marketInfluence > 0 && (
              <section className="border-t border-border pt-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  Market Influence
                </h2>
                <div className="bg-muted/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Influence Score</span>
                    <span className="text-3xl font-bold text-green-500">{creator.marketInfluence.toFixed(1)}/100</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-yellow-500 h-3 rounded-full transition-all"
                      style={{ width: `${creator.marketInfluence}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    {creator.name}'s work significantly influences market valuations and collector interest.
                  </p>
                </div>
              </section>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
