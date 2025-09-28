import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { 
  TrendingUp, Activity, BarChart3, Clock, DollarSign,
  Maximize2, Minimize2, RefreshCw, Settings, Bell
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Terminal components
import { AdvancedTradingChart } from '@/components/terminal/AdvancedTradingChart';
import { OrderBookComponent } from '@/components/terminal/OrderBookComponent';
import { MarketWatchComponent } from '@/components/terminal/MarketWatchComponent';
import { ProfessionalOrderEntry } from '@/components/terminal/ProfessionalOrderEntry';
import { PositionsPanel } from '@/components/terminal/PositionsPanel';
import { TradingFeedComponent } from '@/components/terminal/TradingFeedComponent';
import { TerminalHeader } from '@/components/terminal/TerminalHeader';

export default function TradingTerminalPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState<string>('SPIDER');
  const [fullscreenChart, setFullscreenChart] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Market status check
  const isMarketOpen = () => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 9 && hour < 16; // Market hours: 9 AM - 4 PM
  };

  // Keyboard shortcuts for professional trading
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle shortcuts if not in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'F':
          if (event.ctrlKey) {
            event.preventDefault();
            setFullscreenChart(!fullscreenChart);
          }
          break;
        case 'R':
          if (event.ctrlKey) {
            event.preventDefault();
            setRefreshTrigger(prev => prev + 1);
          }
          break;
        case 'Escape':
          if (fullscreenChart) {
            setFullscreenChart(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [fullscreenChart]);

  if (fullscreenChart) {
    return (
      <div className="h-screen w-screen bg-background" data-testid="terminal-fullscreen-chart">
        <div className="flex items-center justify-between p-2 border-b">
          <h2 className="font-semibold">Chart View - {selectedAsset}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFullscreenChart(false)}
            data-testid="button-exit-fullscreen"
          >
            <Minimize2 className="h-4 w-4 mr-2" />
            Exit Fullscreen
          </Button>
        </div>
        <div className="h-[calc(100vh-60px)]">
          <AdvancedTradingChart 
            symbol={selectedAsset}
            onAssetSelect={setSelectedAsset}
            isFullscreen={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col" data-testid="page-trading-terminal">
      {/* Terminal Header */}
      <TerminalHeader 
        selectedAsset={selectedAsset}
        onAssetSelect={setSelectedAsset}
        isMarketOpen={isMarketOpen()}
        onRefresh={() => setRefreshTrigger(prev => prev + 1)}
      />

      {/* Main Terminal Layout */}
      <div className="flex-1 p-4">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel: Chart */}
          <ResizablePanel defaultSize={45} minSize={30}>
            <Card className="h-full" data-testid="panel-chart">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Price Chart</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={isMarketOpen() ? 'default' : 'secondary'}>
                      <Clock className="h-3 w-3 mr-1" />
                      {isMarketOpen() ? 'Live' : 'Closed'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFullscreenChart(true)}
                      data-testid="button-fullscreen-chart"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px]">
                  <AdvancedTradingChart 
                    symbol={selectedAsset}
                    onAssetSelect={setSelectedAsset}
                    refreshTrigger={refreshTrigger}
                  />
                </div>
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle />

          {/* Middle Panel: Order Book & Order Entry */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="h-full space-y-4">
              {/* Order Book */}
              <Card className="flex-1" data-testid="panel-order-book">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Order Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderBookComponent 
                    symbol={selectedAsset}
                    refreshTrigger={refreshTrigger}
                  />
                </CardContent>
              </Card>

              {/* Order Entry */}
              <Card className="flex-1" data-testid="panel-order-entry">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Order Entry</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfessionalOrderEntry 
                    selectedAsset={selectedAsset}
                    onOrderPlaced={(orderId) => {
                      setRefreshTrigger(prev => prev + 1);
                      toast({
                        title: 'Order Placed',
                        description: `Order ${orderId} submitted successfully`,
                      });
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel: Market Watch & Positions */}
          <ResizablePanel defaultSize={30} minSize={25}>
            <div className="h-full space-y-4">
              {/* Market Watch */}
              <Card className="flex-1" data-testid="panel-market-watch">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Market Watch</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarketWatchComponent 
                    onAssetSelect={setSelectedAsset}
                    refreshTrigger={refreshTrigger}
                  />
                </CardContent>
              </Card>

              {/* Positions & Trading Feed Tabs */}
              <Card className="flex-1" data-testid="panel-positions-feed">
                <CardContent className="p-0">
                  <Tabs defaultValue="positions" className="h-full">
                    <div className="px-4 pt-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="positions" data-testid="tab-positions">
                          Positions
                        </TabsTrigger>
                        <TabsTrigger value="feed" data-testid="tab-trading-feed">
                          Trading Feed
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="positions" className="px-4 pb-4">
                      <PositionsPanel refreshTrigger={refreshTrigger} />
                    </TabsContent>
                    
                    <TabsContent value="feed" className="px-4 pb-4">
                      <TradingFeedComponent refreshTrigger={refreshTrigger} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}