import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Users, Zap, Award, Target } from 'lucide-react';
import { Link } from 'wouter';

interface IssueDetail {
  comicId: number;
  title: string;
  series: string;
  issueNumber: number;
  coverUrl: string;
  description: string;
  onsaleDate: string | null;
  format: string;
  pageCount: number;
  storyTitle: string;
  plotSummary: string;
  characterAnalysis: string;
  artStyle: string;
  writingQuality: string;
  themesAndMotifs: string;
  notableQuotes: string[];
  collectorsNotes: string;
  estimatedValue: number;
  creators: Array<{ name: string; role: string }>;
}

export default function IssueDetailPage() {
  const params = useParams();
  const comicId = params.id;

  const { data, isLoading, error } = useQuery<{ success: boolean; data: IssueDetail }>({
    queryKey: ['/api/comic-covers/issue-detail', comicId],
    enabled: !!comicId,
  });

  const comic = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen !bg-[#1A1F2E] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-muted rounded animate-pulse w-48 mb-8" />
          <Card>
            <CardHeader>
              <div className="h-10 bg-muted rounded animate-pulse w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-40 bg-muted rounded animate-pulse" />
              <div className="h-40 bg-muted rounded animate-pulse" />
              <div className="h-40 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !comic) {
    return (
      <div className="min-h-screen !bg-[#1A1F2E] p-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/" data-testid="link-back-home">
            <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Issue details not found. Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen !bg-[#1A1F2E] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <Link href="/" data-testid="link-back-home">
          <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Cover and Metadata */}
          <div className="lg:col-span-1">
            <Card className="!bg-[#1A1F2E] sticky top-8">
              <CardContent className="pt-6">
                {/* Cover Image */}
                {comic.coverUrl && (
                  <img
                    src={comic.coverUrl}
                    alt={comic.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg border-2 border-border mb-4"
                    data-testid="img-issue-detail-cover"
                  />
                )}

                {/* Issue Metadata */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Series</p>
                    <p className="text-lg  text-foreground">{comic.series}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Number</p>
                    <p className="text-lg  text-foreground">#{comic.issueNumber}</p>
                  </div>
                  {comic.format && (
                    <div>
                      <p className="text-sm text-muted-foreground">Format</p>
                      <p className="text-base text-foreground">{comic.format}</p>
                    </div>
                  )}
                  {comic.pageCount > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Page Count</p>
                      <p className="text-base text-foreground">{comic.pageCount} pages</p>
                    </div>
                  )}
                  {comic.onsaleDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Release Date</p>
                      <p className="text-base text-foreground">
                        {new Date(comic.onsaleDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <p className="text-2xl  text-green-500">
                      ${comic.estimatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Creative Team */}
                {comic.creators && comic.creators.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className=" text-foreground mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Creative Team
                    </h3>
                    <div className="space-y-2">
                      {comic.creators.map((creator, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{creator.role}</span>
                          <span className="text-foreground ">{creator.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Description */}
            <Card className="!bg-[#1A1F2E]">
              <CardHeader>
                <CardTitle className="text-3xl ">{comic.title}</CardTitle>
                {comic.storyTitle && (
                  <p className="text-lg text-primary mt-2">"{comic.storyTitle}"</p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed text-lg">
                  {comic.description}
                </p>
              </CardContent>
            </Card>

            {/* Plot Summary */}
            {comic.plotSummary && (
              <Card className="!bg-[#1A1F2E]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    Plot Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-line">
                    {comic.plotSummary}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Character Analysis */}
            {comic.characterAnalysis && (
              <Card className="!bg-[#1A1F2E]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-indigo-400" />
                    Character Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-line">
                    {comic.characterAnalysis}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Art and Writing Quality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comic.artStyle && (
                <Card className="!bg-[#1A1F2E]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Award className="w-5 h-5 text-yellow-500" />
                      Art Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 leading-relaxed">
                      {comic.artStyle}
                    </p>
                  </CardContent>
                </Card>
              )}

              {comic.writingQuality && (
                <Card className="!bg-[#1A1F2E]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="w-5 h-5 text-purple-500" />
                      Writing Quality
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 leading-relaxed">
                      {comic.writingQuality}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Themes and Motifs */}
            {comic.themesAndMotifs && (
              <Card className="!bg-[#1A1F2E] bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    Themes & Motifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-line">
                    {comic.themesAndMotifs}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Notable Quotes */}
            {comic.notableQuotes && comic.notableQuotes.length > 0 && (
              <Card className="!bg-[#1A1F2E]">
                <CardHeader>
                  <CardTitle>Memorable Quotes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comic.notableQuotes.map((quote, idx) => (
                      <blockquote key={idx} className="border-l-4 border-primary pl-4 italic text-foreground/80 text-lg">
                        "{quote}"
                      </blockquote>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Collector's Notes */}
            {comic.collectorsNotes && (
              <Card className="!bg-[#1A1F2E] bg-green-500/5 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-500">Collector's Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-line">
                    {comic.collectorsNotes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
