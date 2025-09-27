import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopBuyRecommendationCard } from '../recommendations/TopBuyRecommendationCard';
import { DiversificationTipCard } from '../recommendations/DiversificationTipCard';
import { RiskAlertCard } from '../recommendations/RiskAlertCard';
import { QuickTradeModal } from '../trading/QuickTradeModal';

interface RecommendationsCardsProps {
  className?: string;
}

export function RecommendationsCards({ className = '' }: RecommendationsCardsProps) {
  const [isTradeModalOpen, setIsTradeModalOpen] = React.useState(false);
  const [isDiversificationModalOpen, setIsDiversificationModalOpen] = React.useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = React.useState(false);

  // Data for the recommendation cards
  const topBuyData = {
    symbol: 'ASM300',
    name: 'Amazing Spider-Man #300',
    assetType: 'Character',
    currentPrice: 25.00,
    targetPrice: 32.00,
    description: 'Strong buy signal based on upcoming Venom movie announcements and increasing collector interest.',
    marketActivity: 'High volume expected'
  };

  const diversificationData = {
    title: 'Golden Age Comics',
    subtitle: 'Portfolio Allocation',
    description: 'Your portfolio is underweight in Golden Age comics. Consider adding exposure to this stable, historically significant segment.',
    currentAllocation: 5,
    recommendedAllocation: '15-20%'
  };

  const riskAlertData = {
    title: 'Options Exposure',
    subtitle: 'Portfolio Risk',
    description: 'Your options positions represent 25% of your portfolio, exceeding the recommended maximum of 15% for your risk profile.',
    currentExposure: 25,
    recommendedMax: 15,
    severity: 'medium' as const
  };

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
        <TopBuyRecommendationCard
          symbol={topBuyData.symbol}
          name={topBuyData.name}
          assetType={topBuyData.assetType}
          currentPrice={topBuyData.currentPrice}
          targetPrice={topBuyData.targetPrice}
          description={topBuyData.description}
          marketActivity={topBuyData.marketActivity}
          onTradeClick={() => setIsTradeModalOpen(true)}
        />

        <DiversificationTipCard
          recommendation={diversificationData}
          onExploreClick={() => setIsDiversificationModalOpen(true)}
        />

        <RiskAlertCard
          alert={riskAlertData}
          onReviewClick={() => setIsRiskModalOpen(true)}
        />
      </div>

      {/* Trade Modal for Top Buy Recommendation */}
      <QuickTradeModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        symbol={topBuyData.symbol}
        currentPrice={topBuyData.currentPrice * 100} // Convert to CC
        assetName={topBuyData.name}
        assetType="character"
      />

      {/* Diversification Modal */}
      {isDiversificationModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <BarChart2 className="h-6 w-6 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Portfolio Diversification Recommendations</h2>
              </div>
              <button 
                onClick={() => setIsDiversificationModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <h3 className="font-medium text-white mb-3">Current Portfolio Analysis</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Golden Age Allocation</p>
                      <p className="text-lg font-bold text-yellow-400">{diversificationData.currentAllocation}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Recommended Allocation</p>
                      <p className="text-lg font-bold text-white">{diversificationData.recommendedAllocation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Expected Benefit</p>
                      <p className="text-lg font-bold text-white">Lower volatility</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/30">
                  <h3 className="font-medium text-white mb-3">Recommended Golden Age Funds</h3>
                  <div className="space-y-3">
                    <Link
                      to="/fund/GAPF"
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <div>
                        <p className="text-white font-medium">Golden Age Preservation Fund</p>
                        <p className="text-sm text-gray-400">GAPF • Conservative approach</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">CC 45.20</p>
                        <p className="text-green-400 text-sm">+2.03%</p>
                      </div>
                    </Link>
                    
                    <Link
                      to="/bond/GACB"
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <div>
                        <p className="text-white font-medium">Golden Age Comics Index Bond</p>
                        <p className="text-sm text-gray-400">GACB • 5.2% yield</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">CC 1,065.25</p>
                        <p className="text-green-400 text-sm">+1.26%</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-700/50 flex justify-end">
              <button
                onClick={() => setIsDiversificationModalOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors mr-3"
              >
                Close
              </button>
              <Link
                to="/funds/themed"
                className="px-4 py-2 bg-white hover:bg-gray-100 text-slate-900 text-center py-2 rounded-lg transition-colors font-medium"
                onClick={() => setIsDiversificationModalOpen(false)}
              >
                Explore Golden Age Funds
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Risk Alert Modal */}
      {isRiskModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Portfolio Risk Analysis</h2>
              </div>
              <button 
                onClick={() => setIsRiskModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-700/30">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <h3 className="font-medium text-white">High Options Exposure Detected</h3>
                  </div>
                  <p className="text-yellow-200 text-sm mb-3">
                    Your current options positions represent {riskAlertData.currentExposure}% of your total portfolio value, which exceeds the recommended maximum of {riskAlertData.recommendedMax}% for your risk profile.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Current Options Exposure</p>
                      <p className="text-lg font-bold text-yellow-400">{riskAlertData.currentExposure}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Recommended Maximum</p>
                      <p className="text-lg font-bold text-white">{riskAlertData.recommendedMax}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Risk Reduction</p>
                      <p className="text-lg font-bold text-white">Moderate</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <h3 className="font-medium text-white mb-3">Recommended Actions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Close Short-Term Options</p>
                        <p className="text-xs text-gray-400">Reduce exposure by 10%</p>
                      </div>
                      <Link 
                        to="/portfolio"
                        className="text-indigo-400 hover:text-indigo-300 text-sm"
                      >
                        Review
                      </Link>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Add Defensive Assets</p>
                        <p className="text-xs text-gray-400">Consider bonds or stable funds</p>
                      </div>
                      <Link 
                        to="/bonds"
                        className="text-indigo-400 hover:text-indigo-300 text-sm"
                      >
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/30">
                  <h3 className="font-medium text-white mb-2">Risk Management Tips</h3>
                  <ul className="space-y-1 text-indigo-200 text-sm">
                    <li>• Never allocate more than 20% to high-risk instruments</li>
                    <li>• Consider setting stop-losses on options positions</li>
                    <li>• Diversify across different expiration dates</li>
                    <li>• Monitor Greeks daily for options positions</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-700/50 flex justify-end">
              <button
                onClick={() => setIsRiskModalOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors mr-3"
              >
                Close
              </button>
              <Link
                to="/portfolio"
                className="px-4 py-2 bg-white hover:bg-gray-100 text-slate-900 rounded-lg transition-colors"
                onClick={() => setIsRiskModalOpen(false)}
              >
                Manage Portfolio
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RecommendationsCards;