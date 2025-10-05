import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, BookOpen, User, Wrench } from 'lucide-react';
import { Link } from 'wouter';

interface GadgetDetail {
  id: string;
  canonicalName: string;
  subtype: string | null;
  description: string | null;
  primaryImageUrl: string | null;
  alternateImageUrls: string[] | null;
  firstAppearance: string | null;
  universe: string;
  asset: {
    imageUrl: string | null;
    coverImageUrl: string | null;
  } | null;
  capabilities: Array<{
    id: string;
    traitName: string;
    description: string;
  }>;
  features: Array<{
    id: string;
    traitName: string;
    description: string;
  }>;
  owner: Array<{
    id: string;
    traitName: string;
    description: string;
  }>;
}

export default function GadgetBioPage() {
  const params = useParams();
  const gadgetId = params.id;

  const { data, isLoading, error } = useQuery<{ success: boolean; data: GadgetDetail }>({
    queryKey: ['/api/narrative/gadget', gadgetId],
    enabled: !!gadgetId,
  });

  const gadget = data?.data;

  const getGadgetImageUrl = () => {
    return gadget?.primaryImageUrl || 
           gadget?.asset?.imageUrl || 
           gadget?.asset?.coverImageUrl || 
           '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen !bg-[#1A1F2E] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-muted rounded animate-pulse w-48 mb-8" />
          <div className="h-[800px] bg-muted rounded-lg animate-pulse mb-8" />
          <div className="h-64 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !gadget) {
    return (
      <div className="min-h-screen !bg-[#1A1F2E] p-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/" data-testid="link-back-home">
            <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card className="!bg-[#1A1F2E]">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Gadget information not found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const gadgetImageUrl = getGadgetImageUrl();

  return (
    <div className="min-h-screen !bg-[#1A1F2E] p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" data-testid="link-back-home">
          <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div 
          className="relative h-[800px] rounded-lg overflow-hidden mb-8 gadget-rimlight-hover"
          style={{
            backgroundImage: gadgetImageUrl ? `url(${gadgetImageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: gadgetImageUrl ? 'transparent' : '#1a1a1a',
          }}
          data-testid="gadget-image-section"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Badge className="mb-4" style={{ backgroundColor: '#DAA520', color: 'white' }}>
              GADGET
            </Badge>
            <h1 
              className="text-white mb-2"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
            >
              {gadget.canonicalName}
            </h1>
            {gadget.subtype && (
              <p 
                className="text-white/80"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}
              >
                {gadget.subtype}
              </p>
            )}
            <p 
              className="text-white/60 mt-2"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}
            >
              {gadget.universe.toUpperCase()} Universe
            </p>
          </div>

          {!gadgetImageUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Wrench className="w-64 h-64 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {gadget.alternateImageUrls && gadget.alternateImageUrls.length > 0 && (
          <div className="mb-8">
            <h2 
              className="mb-4"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
            >
              Gallery
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {gadget.alternateImageUrls.map((imageUrl, index) => (
                <div 
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  data-testid={`gallery-image-${index}`}
                />
              ))}
            </div>
          </div>
        )}

        {gadget.description && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <BookOpen className="w-6 h-6" />
                Description
              </h2>
            </CardHeader>
            <CardContent>
              <p 
                className="text-muted-foreground"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
              >
                {gadget.description}
              </p>
            </CardContent>
          </Card>
        )}

        {gadget.capabilities && gadget.capabilities.length > 0 && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <Zap className="w-6 h-6" style={{ color: '#DAA520' }} />
                Capabilities
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gadget.capabilities.map((capability) => (
                  <div 
                    key={capability.id}
                    className="p-4 rounded-lg border"
                    style={{ borderColor: '#DAA520', backgroundColor: 'rgba(218, 165, 32, 0.1)' }}
                    data-testid={`capability-${capability.id}`}
                  >
                    <h3 
                      className="mb-2"
                      style={{ 
                        fontFamily: 'Hind, sans-serif', 
                        fontWeight: '300', 
                        fontSize: '15pt',
                        color: '#DAA520'
                      }}
                    >
                      {capability.traitName}
                    </h3>
                    {capability.description && (
                      <p 
                        className="text-muted-foreground"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
                      >
                        {capability.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {gadget.features && gadget.features.length > 0 && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <Wrench className="w-6 h-6" />
                Features
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gadget.features.map((feature) => (
                  <div 
                    key={feature.id}
                    className="p-4 rounded-lg border border-muted"
                    data-testid={`feature-${feature.id}`}
                  >
                    <h3 
                      className="mb-2"
                      style={{ 
                        fontFamily: 'Hind, sans-serif', 
                        fontWeight: '300', 
                        fontSize: '15pt'
                      }}
                    >
                      {feature.traitName}
                    </h3>
                    {feature.description && (
                      <p 
                        className="text-muted-foreground"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
                      >
                        {feature.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {gadget.owner && gadget.owner.length > 0 && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <User className="w-6 h-6" />
                Creator / Owner
              </h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {gadget.owner.map((ownerInfo, index) => (
                  <Badge 
                    key={index}
                    style={{ backgroundColor: '#DAA520', color: 'white' }}
                    className="text-base py-1 px-3"
                    data-testid={`owner-${index}`}
                  >
                    {ownerInfo.traitName}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {gadget.firstAppearance && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                First Appearance
              </h2>
            </CardHeader>
            <CardContent>
              <p 
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
              >
                {gadget.firstAppearance}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
