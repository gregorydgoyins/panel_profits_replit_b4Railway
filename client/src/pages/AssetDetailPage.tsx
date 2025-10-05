import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, TrendingUp, TrendingDown, BookOpen, 
  User, Building2, Calendar, Tag, DollarSign, BarChart3 
} from 'lucide-react';

interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: string;
  type: string;
  publisher?: string;
  creators?: string[];
  firstAppearance?: string;
  publishDate?: string;
  description: string;
  keyIssues?: string[];
  coverUrl?: string;
  currentPrice?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  marketCap?: number;
  high52Week?: number;
  low52Week?: number;
  // Comprehensive Bio Fields
  biography?: string;
  keyWorks?: string[];
  relatedAssetIds?: string[];
  franchiseTags?: string[];
  teamTags?: string[];
  publisherTags?: string[];
  notableAppearances?: string[];
}

export default function AssetDetailPage() {
  const [match, params] = useRoute('/asset/:symbol');
  const symbol = params?.symbol;

  // Fetch asset data
  const { data: asset, isLoading } = useQuery<Asset>({
    queryKey: ['/api/assets/symbol', symbol],
    enabled: !!symbol,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary rounded-full animate-spin border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading asset details...</p>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-4">Asset Not Found</h1>
        <p className="text-gray-400 mb-6">The asset you're looking for doesn't exist or has been delisted.</p>
        <Button asChild>
          <Link href="/trading">
            <a>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trading
            </a>
          </Link>
        </Button>
      </div>
    );
  }

  const priceChange = (asset.change ?? 0) >= 0;

  return (
    <div className="max-w-7xl mx-auto">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/trading">
          <a data-testid="button-back-to-trading">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Trading
          </a>
        </Link>
      </Button>

      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left: Comic Cover & Basic Info */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            {asset.coverUrl ? (
              <div className="aspect-[2/3] rounded-lg overflow-hidden mb-4 bg-gray-900">
                <img 
                  src={asset.coverUrl} 
                  alt={asset.name}
                  className="w-full h-full object-cover"
                  data-testid="img-asset-cover"
                />
              </div>
            ) : (
              <div className="aspect-[2/3] rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <span className="text-6xl font-bold text-gray-700">{asset.symbol.slice(0, 2)}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Symbol</p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  {asset.symbol}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <Badge variant="secondary" data-testid="badge-category">{asset.category}</Badge>
              </div>
              {asset.publisher && (
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    Publisher
                  </p>
                  <p className="text-sm text-white" data-testid="text-publisher">{asset.publisher}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right: Price & Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-3xl" data-testid="text-asset-name">{asset.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Price Display */}
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Current Price</p>
                  <p className="text-5xl font-bold text-white" data-testid="text-current-price">
                    ${asset.currentPrice?.toFixed(2) ?? '0.00'}
                  </p>
                </div>
                <div className={`flex items-center gap-2 pb-2 ${priceChange ? 'text-green-500' : 'text-red-500'}`}>
                  {priceChange ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                  <span className="text-2xl font-bold" data-testid="text-price-change">
                    {priceChange ? '+' : ''}{asset.change?.toFixed(2) ?? '0.00'} 
                    ({priceChange ? '+' : ''}{asset.changePercent?.toFixed(2) ?? '0.00'}%)
                  </span>
                </div>
              </div>

              {/* Market Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    Volume
                  </p>
                  <p className="text-lg font-semibold text-white" data-testid="text-volume">
                    {asset.volume?.toLocaleString() ?? 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Market Cap
                  </p>
                  <p className="text-lg font-semibold text-white" data-testid="text-market-cap">
                    ${(asset.marketCap ? (asset.marketCap / 1000000).toFixed(1) : '0')}M
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">52W High</p>
                  <p className="text-lg font-semibold text-green-500" data-testid="text-52w-high">
                    ${asset.high52Week?.toFixed(2) ?? 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">52W Low</p>
                  <p className="text-lg font-semibold text-red-500" data-testid="text-52w-low">
                    ${asset.low52Week?.toFixed(2) ?? 'N/A'}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button className="flex-1" data-testid="button-buy">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Buy
                </Button>
                <Button variant="outline" className="flex-1" data-testid="button-sell">
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Sell
                </Button>
                <Button variant="outline" data-testid="button-add-watchlist">
                  <BookOpen className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bio & Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p 
              className="text-gray-300 leading-relaxed"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              data-testid="text-description"
            >
              {asset.description}
            </p>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {asset.creators && asset.creators.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Creators
                </p>
                <div className="flex flex-wrap gap-2">
                  {asset.creators.map((creator, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline"
                      className="hover-elevate cursor-pointer transition-all duration-200"
                      style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300, fontSize: '13pt' }}
                      data-testid={`badge-creator-${idx}`}
                    >
                      {creator}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {asset.firstAppearance && (
              <div>
                <p className="text-xs text-gray-500 mb-1">First Appearance</p>
                <p className="text-sm text-white">{asset.firstAppearance}</p>
              </div>
            )}

            {asset.publishDate && (
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Publication Date
                </p>
                <p className="text-sm text-white">{asset.publishDate}</p>
              </div>
            )}

            {asset.keyIssues && asset.keyIssues.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Key Issues</p>
                <ul className="space-y-1">
                  {asset.keyIssues.map((issue, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Extended Bio Section */}
      {asset.biography && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Biography
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p 
              className="text-gray-300 leading-relaxed whitespace-pre-wrap"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              data-testid="text-biography"
            >
              {asset.biography}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Key Works & Notable Appearances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {asset.keyWorks && asset.keyWorks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                Key Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {asset.keyWorks.map((work, idx) => (
                  <li 
                    key={idx} 
                    className="text-sm text-gray-300 flex items-start gap-2"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    data-testid={`item-key-work-${idx}`}
                  >
                    <span className="text-primary mt-1">•</span>
                    <span>{work}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {asset.notableAppearances && asset.notableAppearances.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                Notable Appearances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {asset.notableAppearances.map((appearance, idx) => (
                  <li 
                    key={idx} 
                    className="text-sm text-gray-300 flex items-start gap-2"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                    data-testid={`item-notable-appearance-${idx}`}
                  >
                    <span className="text-primary mt-1">•</span>
                    <span>{appearance}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tags: Franchises, Teams, Publishers */}
      {((asset.franchiseTags && asset.franchiseTags.length > 0) || 
        (asset.teamTags && asset.teamTags.length > 0) || 
        (asset.publisherTags && asset.publisherTags.length > 0)) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Associations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {asset.franchiseTags && asset.franchiseTags.length > 0 && (
              <div>
                <p 
                  className="text-xs text-gray-500 mb-2"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Franchises
                </p>
                <div className="flex flex-wrap gap-2">
                  {asset.franchiseTags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" data-testid={`badge-franchise-${idx}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {asset.teamTags && asset.teamTags.length > 0 && (
              <div>
                <p 
                  className="text-xs text-gray-500 mb-2"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Teams
                </p>
                <div className="flex flex-wrap gap-2">
                  {asset.teamTags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" data-testid={`badge-team-${idx}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {asset.publisherTags && asset.publisherTags.length > 0 && (
              <div>
                <p 
                  className="text-xs text-gray-500 mb-2"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Publishers
                </p>
                <div className="flex flex-wrap gap-2">
                  {asset.publisherTags.map((tag, idx) => (
                    <Badge key={idx} variant="default" data-testid={`badge-publisher-${idx}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Related Assets */}
      {asset.relatedAssetIds && asset.relatedAssetIds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Related Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {asset.relatedAssetIds.map((relatedId, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  asChild
                  data-testid={`button-related-asset-${idx}`}
                >
                  <Link href={`/asset/${relatedId}`}>
                    <a style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      {relatedId}
                    </a>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
