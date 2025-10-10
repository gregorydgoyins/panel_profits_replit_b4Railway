import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Link } from 'wouter';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  publishedAt: string;
  author: string;
  tags: string[];
}

export default function NewsPage() {
  const [match, params] = useRoute('/news/:id');
  const articleId = params?.id;

  // Mock data - in production this would fetch from API
  const articles: Record<string, NewsArticle> = {
    'marvel-phase-6': {
      id: 'marvel-phase-6',
      title: 'BREAKING: Marvel announces Phase 6 slate - collector interest surging',
      content: `Marvel Studios has officially unveiled its Phase 6 slate, sending shockwaves through the collector community. The announcement includes several highly anticipated titles that are expected to drive significant demand for related comic assets.

Industry analysts predict a 40% surge in trading volume for key Marvel properties, with particular focus on characters set to appear in upcoming films. Early trading data shows Spider-Man and Avengers assets already experiencing double-digit gains.

"This is the kind of event that reshapes the entire market," says noted collector Marcus Chen. "We're seeing institutional investors positioning themselves ahead of the release cycle."

The announcement has also sparked renewed interest in vintage issues featuring these characters, with some Golden Age books seeing their first major price movements in years.`,
      category: 'Breaking News',
      publishedAt: new Date().toISOString(),
      author: 'Sarah Martinez',
      tags: ['Marvel', 'Phase 6', 'Market Impact', 'Investing']
    },
    'superman-ath': {
      id: 'superman-ath',
      title: 'ALERT: Golden Age Superman #1 reaches new all-time high',
      content: `In a historic moment for comic book trading, Golden Age Superman #1 has reached an unprecedented all-time high, breaking through previous resistance levels that had held for over two decades.

The milestone came during heavy trading volume, with the asset gaining 15.3% in a single session. Market observers attribute the surge to a combination of factors including increased institutional interest and growing recognition of Golden Age books as alternative investments.

"This is a watershed moment," explains veteran trader Janet Reynolds. "When Superman breaks records, the entire market tends to follow. We're seeing ripple effects across DC properties and even competitive Marvel assets."

The rally has sparked debates about market sustainability, with some analysts warning of potential corrections while bulls argue this represents a fundamental revaluation of comic assets in the modern investment landscape.`,
      category: 'Market Alert',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      author: 'David Chen',
      tags: ['Superman', 'Golden Age', 'Record High', 'DC Comics']
    },
    'dc-restructuring': {
      id: 'dc-restructuring',
      title: 'UPDATE: DC Restructuring complete - institutional investors bullish',
      content: `DC Comics has completed its major corporate restructuring, and institutional investors are responding with enthusiasm. The reorganization promises streamlined operations and renewed focus on core franchises.

Major hedge funds specializing in comic assets have increased their positions in DC properties by an average of 23% over the past week. The move signals strong confidence in the publisher's new direction.

"The restructuring addresses many of the operational inefficiencies that had been weighing on asset values," notes investment analyst Robert Kim. "We're particularly optimistic about the Batman and Wonder Woman franchises moving forward."

Trading volumes for DC assets have tripled compared to the monthly average, with particular strength in Silver Age and Bronze Age issues. Market makers report tight spreads and strong liquidity across the board.`,
      category: 'Market Update',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      author: 'Emily Thompson',
      tags: ['DC Comics', 'Corporate News', 'Institutional', 'Market Sentiment']
    },
    'amazing-fantasy-variant': {
      id: 'amazing-fantasy-variant',
      title: 'EXCLUSIVE: Rare Amazing Fantasy #15 variant discovered - market impact expected',
      content: `A previously unknown variant of Amazing Fantasy #15, the first appearance of Spider-Man, has been discovered in a private collection. Authentication is underway, but early indications suggest this could be one of the most significant comic discoveries in decades.

"If confirmed, this changes everything we know about Amazing Fantasy print runs," explains comic historian Dr. Patricia Williams. "The rarity factor alone could push valuations into unprecedented territory."

The discovery has already impacted markets, with related Spider-Man assets gaining 8-12% on speculation. Options traders are particularly active, with call volume on Spider-Man derivatives up 200%.

Collectors and investors are closely monitoring the authentication process, scheduled to conclude within two weeks. Market analysts predict significant volatility in Spider-Man assets regardless of the outcome.`,
      category: 'Exclusive',
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      author: 'Michael Torres',
      tags: ['Spider-Man', 'Discovery', 'Rare Find', 'Market Impact']
    },
    'alex-ross-auction': {
      id: 'alex-ross-auction',
      title: 'RECORD: Alex Ross original art auction breaks records',
      content: `Legendary artist Alex Ross's original painting for "Kingdom Come" #1 has shattered auction records, selling for an unprecedented sum that has sent shockwaves through the creator art market.

The sale establishes new benchmarks for comic art valuations and has sparked immediate price discovery across Ross's entire body of work. Secondary market trading of Ross-related assets surged 45% in the hours following the announcement.

"This validates what we've been saying for years - creator art is fundamentally undervalued," says art market specialist Linda Park. "We expect this to trigger a broad revaluation across the entire segment."

The auction house reports multiple bidders pushed the price well beyond presale estimates, suggesting deep institutional interest in creator-focused assets. Analysts predict similar strength for works by other legendary artists.`,
      category: 'Market Record',
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      author: 'Jennifer Adams',
      tags: ['Alex Ross', 'Original Art', 'Auction', 'Record Sale']
    },
    'comic-con-attendance': {
      id: 'comic-con-attendance',
      title: 'DATA: Comic-Con attendance up 300% - signaling strong market demand',
      content: `San Diego Comic-Con has reported record attendance figures, with turnout up 300% compared to pre-pandemic levels. The surge is being interpreted by market analysts as a strong bullish signal for the entire comic asset class.

"Consumer engagement drives valuations," explains market strategist Thomas Wright. "When we see this level of grassroots enthusiasm, it typically precedes significant market movements."

Trading data confirms the correlation, with broad market indices for comic assets up 18% since the attendance figures were released. Volume has been particularly strong in modern issues and variant covers.

The convention also saw unprecedented participation from institutional investors, with dedicated panels addressing comic assets as alternative investments. Several major funds announced new comic-focused portfolios during the event.`,
      category: 'Market Data',
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      author: 'Rachel Green',
      tags: ['Comic-Con', 'Market Data', 'Attendance', 'Bullish Signal']
    }
  };

  // If no article ID, show news index
  if (!match || !articleId) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 
            className="text-4xl  text-white mb-2"
            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
          >
            Comic Market News
          </h1>
          <p 
            className="text-gray-400"
            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
          >
            Latest breaking news, market analysis, and industry updates
          </p>
        </div>

        <div className="grid gap-4">
          {Object.values(articles).map((article) => (
            <Card key={article.id} className="hover-elevate" data-testid={`news-card-${article.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.publishedAt).toLocaleString()}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-2">
                      <Link href={`/news/${article.id}`}>
                        <a className="hover:text-primary transition-colors" data-testid={`link-news-${article.id}`}>
                          {article.title}
                        </a>
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {article.content.substring(0, 200)}...
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/news/${article.id}`}>
                      <a data-testid={`button-read-${article.id}`}>Read More</a>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Individual article view
  const article = articles[articleId];

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl  text-white mb-4">Article Not Found</h1>
        <Button asChild>
          <Link href="/news">
            <a>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </a>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/news">
          <a data-testid="button-back-to-news">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </a>
        </Link>
      </Button>

      <article>
        <div className="mb-6">
          <Badge variant="secondary" className="mb-4">{article.category}</Badge>
          <h1 
            className="text-4xl  text-white mb-4"
            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            data-testid="text-article-title"
          >
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>By {article.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(article.publishedAt).toLocaleString()}
            </span>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div 
              className="prose prose-invert max-w-none"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              data-testid="text-article-content"
            >
              {article.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-gray-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500 mr-2">Tags:</span>
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
