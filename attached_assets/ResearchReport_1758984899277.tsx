import React from 'react';
import { FileText, TrendingUp, AlertTriangle, Calendar, BarChart2, Info } from 'lucide-react';


// Mock data for the research report
const marketImpactData = [
  { date: '2023-01', positive: 2.5, negative: -1.8, neutral: 0.3 },
  { date: '2023-02', positive: 3.1, negative: -2.2, neutral: 0.4 },
  { date: '2023-03', positive: 2.8, negative: -1.5, neutral: 0.2 },
  { date: '2023-04', positive: 3.5, negative: -1.9, neutral: 0.5 },
  { date: '2023-05', positive: 4.2, negative: -2.1, neutral: 0.3 },
  { date: '2023-06', positive: 3.8, negative: -1.7, neutral: 0.4 },
  { date: '2023-07', positive: 3.2, negative: -1.6, neutral: 0.2 },
  { date: '2023-08', positive: 2.9, negative: -1.4, neutral: 0.3 },
  { date: '2023-09', positive: 3.3, negative: -1.8, neutral: 0.4 },
  { date: '2023-10', positive: 3.7, negative: -2.0, neutral: 0.3 },
  { date: '2023-11', positive: 4.0, negative: -2.3, neutral: 0.5 },
  { date: '2023-12', positive: 3.6, negative: -1.9, neutral: 0.4 }
];

const sectorCorrelation = [
  { sector: 'Golden Age', correlation: 0.85 },
  { sector: 'Silver Age', correlation: 0.78 },
  { sector: 'Bronze Age', correlation: 0.72 },
  { sector: 'Modern Age', correlation: 0.65 },
];

const tradingSignals = [
  { type: 'Buy', accuracy: 78, volume: 1250 },
  { type: 'Sell', accuracy: 72, volume: 980 },
  { type: 'Hold', accuracy: 65, volume: 1500 },
];

export function ResearchReport() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-8 w-8 text-white" />
          <h1 className="text-3xl font-bold text-white">Market Research Report</h1>
        </div>
        <p className="text-white/90 text-lg">
          News Media Impact on Comic Book Market Movements (2023)
        </p>
        <div className="flex items-center space-x-4 mt-4 text-white/80">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>January 2023 - December 2023</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>95% Confidence Level</span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-4">Executive Summary</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            This research report analyzes the relationship between news media coverage and comic book market movements throughout 2023. Our findings indicate a strong correlation between media sentiment and price action, with significant variations across different market segments and time periods.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">Correlation Coefficient</p>
              <p className="text-2xl font-bold text-white">0.78</p>
              <p className="text-sm text-indigo-400">Strong Positive</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">Price Impact</p>
              <p className="text-2xl font-bold text-white">2.5%</p>
              <p className="text-sm text-indigo-400">Average Movement</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">Signal Accuracy</p>
              <p className="text-2xl font-bold text-white">75%</p>
              <p className="text-sm text-indigo-400">Trading Signals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Impact Analysis */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart2 className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Market Impact Analysis</h2>
        </div>
        <div className="h-80 text-center flex items-center justify-center">
          <Info className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Market Impact Analysis Chart</p>
        </div>
      </div>

      {/* Sector Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart2 className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Sector Analysis</h2>
          </div>
          <div className="h-64 text-center flex items-center justify-center">
            <Info className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Sector Correlation Chart</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart2 className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Trading Signals</h2>
          </div>
          <div className="h-64 text-center flex items-center justify-center">
            <Info className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Trading Signals Chart</p>
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Key Findings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Market Impact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Positive news events drive 2.5% average price increase</li>
              <li>• Negative news impact is asymmetric (-1.8% average)</li>
              <li>• Impact duration averages 3-5 trading days</li>
              <li>• Higher correlation during high-volume periods</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Trading Implications</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Early news reaction provides alpha opportunity</li>
              <li>• Cross-asset effects create arbitrage potential</li>
              <li>• Sentiment indicators lead price movements</li>
              <li>• Volume surge precedes major price moves</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Trading Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/30">
            <h3 className="text-lg font-semibold text-white mb-2">Buy Signals</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Positive news with high social engagement</li>
              <li>• Cross-market confirmation</li>
              <li>• Volume surge with positive sentiment</li>
            </ul>
          </div>
          <div className="bg-red-900/30 p-4 rounded-lg border border-red-700/30">
            <h3 className="text-lg font-semibold text-white mb-2">Sell Signals</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Negative news cluster formation</li>
              <li>• Deteriorating market breadth</li>
              <li>• Sentiment divergence from price</li>
            </ul>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <h3 className="text-lg font-semibold text-white mb-2">Risk Management</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Position sizing based on impact score</li>
              <li>• Stop-loss at 2x average impact</li>
              <li>• Correlation-based hedging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default { ResearchReport };