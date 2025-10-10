import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, User, Building2, BookOpen, Skull, Users, 
  Wrench, Home, TrendingUp, Shield, Zap, Star, Calendar,
  DollarSign, Award, Target
} from 'lucide-react';

interface ComicBioData {
  id: number;
  title: string;
  series: string;
  issueNumber: number;
  coverUrl: string;
  description: string;
  onsaleDate: string | null;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  symbol: string;
  creators: Array<{ name: string; role: string }>;
  publisher: string;
  appearances: string[];
  villains: string[];
  sidekicks: string[];
  gadgets: string[];
  hideouts: string[];
  relatedProducts: Array<{
    type: 'ETF' | 'Bond' | 'Fund';
    symbol: string;
    name: string;
    exposure: number;
  }>;
}

export default function ComicBioPage() {
  const params = useParams();
  const comicId = params.id;

  // Fetch comic data based on the ID from the URL
  const { data, isLoading, error } = useQuery<{ success: boolean; data: any }>({
    queryKey: ['/api/comic-covers/comic', comicId],
    enabled: !!comicId,
  });

  const comic = data?.data;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="h-8 bg-muted rounded-lg animate-pulse w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="h-12 bg-muted rounded-lg animate-pulse" />
            <div className="h-32 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !comic) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Comic not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Transform comic data
  // Use backend-provided ticker symbol (already formatted with standardized nomenclature)
  const symbol = comic.symbol || 'UNKNOWN';
  const currentPrice = comic.estimatedValue || 199.99;
  const priceChange = (Math.random() - 0.5) * 20;
  const priceChangePercent = (priceChange / currentPrice) * 100;

  // Mock data for now - this would come from the API
  const appearances = ['Spider-Man', 'Mary Jane Watson', 'J. Jonah Jameson', 'Aunt May'];
  const villains = ['Green Goblin', 'Doctor Octopus', 'Venom'];
  const sidekicks = ['Mary Jane Watson', 'Harry Osborn'];
  const gadgets = ['Web-Shooters', 'Spider-Tracers', 'Spider-Signal'];
  const hideouts = ['Daily Bugle', 'Queens Apartment', 'Avengers Tower'];
  
  const relatedProducts = [
    { type: 'ETF' as const, symbol: 'SPDR.HERO', name: 'Spider-Man Universe ETF', exposure: 8.5 },
    { type: 'Fund' as const, symbol: 'MRVL.ALL', name: 'Marvel Legacy Fund', exposure: 3.2 },
    { type: 'Bond' as const, symbol: 'SPDR.2028', name: 'Spider-Man 2028 Bonds', exposure: 5.0 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="mb-4" data-testid="button-back-to-dashboard">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Header with Large Hero Image */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Cover Image */}
        <div className="lg:col-span-1">
          <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden border-4 border-primary/20 shadow-2xl">
            {comic.coverUrl ? (
              <img
                src={comic.coverUrl}
                alt={comic.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Cover Available
              </div>
            )}
          </div>

          {/* Quick Trading Actions */}
          <div className="mt-4 space-y-2">
            <Link href={`/order-desk/${comic.id}`}>
              <Button className="w-full" data-testid="button-trade-now">
                <DollarSign className="w-4 h-4 mr-2" />
                Trade Now
              </Button>
            </Link>
            <Button variant="outline" className="w-full" data-testid="button-add-to-watchlist">
              <Star className="w-4 h-4 mr-2" />
              Add to Watchlist
              </Button>
          </div>
        </div>

        {/* Comic Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Price */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-3xl  text-foreground">{comic.title}</h1>
                <p className="text-lg text-muted-foreground">{comic.series} #{comic.issueNumber}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl  text-foreground">${currentPrice.toFixed(2)}</div>
                <div className={`text-sm ${priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{symbol}</Badge>
              {comic.onsaleDate && (
                <Badge variant="outline">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(comic.onsaleDate).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {comic.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  About This Issue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{comic.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Creative Team */}
          {comic.creators && comic.creators.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Creative Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {comic.creators.map((creator: { name: string; role: string }, idx: number) => (
                    <Link key={idx} href={`/creator/${encodeURIComponent(creator.name)}`}>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors">
                        <User className="w-4 h-4 text-purple-500" />
                        <div>
                          <div className=" text-sm">{creator.name}</div>
                          <div className="text-xs text-muted-foreground">{creator.role}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Publisher */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Publisher
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground ">Marvel Comics</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Character Appearances, Villains, Sidekicks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Appearances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Character Appearances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {appearances.map((character, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Shield className="w-3 h-3 text-blue-500" />
                  <span>{character}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Villains */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Skull className="w-5 h-5 text-red-500" />
              Villains
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {villains.map((villain, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Skull className="w-3 h-3 text-red-500" />
                  <span>{villain}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidekicks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              Sidekicks & Allies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sidekicks.map((sidekick, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Users className="w-3 h-3 text-green-500" />
                  <span>{sidekick}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gadgets & Hideouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gadgets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-500" />
              Gadgets & Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gadgets.map((gadget, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>{gadget}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hideouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-indigo-500" />
              Hideouts & Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hideouts.map((hideout, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Home className="w-3 h-3 text-indigo-500" />
                  <span>{hideout}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Financial Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Related Financial Products
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            ETFs, Bonds, and Funds that include this comic asset
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedProducts.map((product, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{product.type}</Badge>
                  <div className="text-xs text-muted-foreground">{product.exposure}% exposure</div>
                </div>
                <div className=" text-sm mb-1">{product.symbol}</div>
                <div className="text-xs text-muted-foreground">{product.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Format</div>
              <div className="">{comic.format || 'Comic'}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Page Count</div>
              <div className="">{comic.pageCount || 'N/A'} pages</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Print Price</div>
              <div className="">${comic.printPrice?.toFixed(2) || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Age</div>
              <div className="">{comic.yearsOld || 'N/A'} years</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
