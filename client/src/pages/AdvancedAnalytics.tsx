import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuantumMomentumWidget from "@/components/dashboard/QuantumMomentumWidget";
import WhaleTrackerWidget from "@/components/dashboard/WhaleTrackerWidget";
import ArbitrageScannerWidget from "@/components/dashboard/ArbitrageScannerWidget";
import AnomalyDetectorWidget from "@/components/dashboard/AnomalyDetectorWidget";
import FractalPatternWidget from "@/components/dashboard/FractalPatternWidget";
import MarketMicrostructureWidget from "@/components/dashboard/MarketMicrostructureWidget";
import SentimentVelocityWidget from "@/components/dashboard/SentimentVelocityWidget";
import { Activity } from "lucide-react";

export default function AdvancedAnalytics() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-black via-gray-900 to-indigo-950">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl  text-white">Advanced Analytics</h1>
            <p className="text-gray-400">Bloomberg Terminal-grade market intelligence</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-black/40 border border-indigo-900/30 mb-6">
            <TabsTrigger value="all" data-testid="tab-all">All Analytics</TabsTrigger>
            <TabsTrigger value="momentum" data-testid="tab-momentum">Momentum</TabsTrigger>
            <TabsTrigger value="intelligence" data-testid="tab-intelligence">Intelligence</TabsTrigger>
            <TabsTrigger value="microstructure" data-testid="tab-microstructure">Microstructure</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QuantumMomentumWidget />
              <WhaleTrackerWidget />
              <ArbitrageScannerWidget />
              <AnomalyDetectorWidget />
              <FractalPatternWidget />
              <MarketMicrostructureWidget />
              <SentimentVelocityWidget />
            </div>
          </TabsContent>

          <TabsContent value="momentum" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QuantumMomentumWidget />
              <FractalPatternWidget />
              <SentimentVelocityWidget />
            </div>
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WhaleTrackerWidget />
              <ArbitrageScannerWidget />
              <AnomalyDetectorWidget />
            </div>
          </TabsContent>

          <TabsContent value="microstructure" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MarketMicrostructureWidget />
              <ArbitrageScannerWidget />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
