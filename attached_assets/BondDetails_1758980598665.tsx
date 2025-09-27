import React, { useState } from 'react';
import { 
  Building2, TrendingUp, TrendingDown, Calendar, 
  BarChart2, Activity, ArrowLeft, Info, 
  DollarSign, Clock, Shield, Briefcase
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { allBonds } from '../../data/bondData';
import { OrderEntry } from '../OrderEntry';

export function BondDetails() {
  const { symbol } = useParams<{ symbol: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'trading'>('overview');
  const [orderSymbol, setOrderSymbol] = useState(symbol);
  
  // Find the bond by symbol
  const bond = allBonds.find(b => b.symbol === symbol);

  if (!bond) {
    return (
      <div className="space-y-6">
        <Breadcrumbs />
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Bond not found</h3>
          <p className="text-gray-400 mb-4">The bond you're looking for doesn't exist.</p>
          <Link to="/bonds" className="text-indigo-400 hover:text-indigo-300">
            ← Back to Bonds
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'performance', label: 'Performance', icon: BarChart2 },
    { id: 'trading', label: 'Trading', icon: Activity }
  ];

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'AAA':
      case 'AA':
        return 'bg-green-900/50 text-green-200 border-green-700/50';
      case 'A':
        return 'bg-emerald-900/50 text-emerald-200 border-emerald-700/50';
      case 'BBB':
      case 'BB':
        return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
      case 'B':
      case 'CCC':
      case 'CC':
      case 'C':
      case 'D':
        return 'bg-red-900/50 text-red-200 border-red-700/50';
      default:
        return 'bg-gray-900/50 text-gray-200 border-gray-700/50';
    }
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-green-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'High':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  // Calculate years to maturity
  const calculateYearsToMaturity = () => {
    const maturityDate = new Date(bond.maturity);
    const today = new Date();
    const diffTime = maturityDate.getTime() - today.getTime();
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return diffYears.toFixed(1);
  };

  // Calculate current yield
  const calculateCurrentYield = () => {
    return ((bond.couponRate * bond.faceValue) / bond.price) * 100;
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[
        { name: 'Bonds', path: '/bonds' },
        { name: bond.name }
      ]} />

      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-3xl font-bold text-white">{bond.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRatingColor(bond.creditRating)}`}>
                {bond.creditRating}
              </span>
            </div>
            <p className="text-gray-400 mb-2">{bond.symbol} • {bond.type.charAt(0).toUpperCase() + bond.type.slice(1)} Bond</p>
            <p className="text-gray-300 mb-4">{bond.description}</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-300">Yield: <span className="text-green-400 font-medium">{bond.yield}%</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-indigo-400" />
                <span className="text-sm text-gray-300">Maturity: {new Date(bond.maturity).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-yellow-400" />
                <span className="text-sm text-gray-300">Issuer: {bond.issuer}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Current Price</p>
            <p className="text-2xl font-bold text-white">CC {bond.price.toLocaleString()}</p>
            <div className="flex items-center justify-end space-x-1 mt-1">
              {bond.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className={`font-semibold ${
                bond.change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {bond.change > 0 ? '+' : ''}{bond.percentageChange}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl shadow-xl">
        <div className="flex space-x-1 p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors flex-1 justify-center touch-target ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Face Value</p>
                <p className="text-xl font-bold text-white">CC {bond.faceValue.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Coupon Rate</p>
                <p className="text-xl font-bold text-white">{bond.couponRate}%</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Current Yield</p>
                <p className="text-xl font-bold text-green-400">{calculateCurrentYield().toFixed(2)}%</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Years to Maturity</p>
                <p className="text-xl font-bold text-white">{calculateYearsToMaturity()}</p>
              </div>
            </div>

            {/* Bond Details */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Bond Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <h4 className="font-medium text-white mb-3">Payment Schedule</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Interest Frequency</span>
                      <span className="text-white">{bond.interestFrequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Next Payment</span>
                      <span className="text-white">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment Amount</span>
                      <span className="text-white">CC {((bond.couponRate / 100) * bond.faceValue / (bond.interestFrequency === 'Annual' ? 1 : bond.interestFrequency === 'Semi-Annual' ? 2 : bond.interestFrequency === 'Quarterly' ? 4 : 12)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <h4 className="font-medium text-white mb-3">Risk Assessment</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Credit Rating</span>
                      <span className={`font-medium ${getRatingColor(bond.creditRating).split(' ')[1]}`}>{bond.creditRating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Risk Level</span>
                      <span className={`font-medium ${getRiskLevelColor(bond.riskLevel)}`}>{bond.riskLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Default Probability</span>
                      <span className="text-white">{bond.creditRating === 'AAA' ? '< 0.1%' : bond.creditRating === 'AA' ? '0.1%' : bond.creditRating === 'A' ? '0.5%' : bond.creditRating === 'BBB' ? '2.0%' : '> 5.0%'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issuer Information */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="font-semibold text-white mb-3">Issuer Information</h3>
              <p className="text-gray-300 mb-3">
                {bond.issuer} is a {bond.type === 'publisher' ? 'major comic book publisher' : bond.type === 'creator' ? 'bond issuer specializing in creator financing' : 'specialized financial entity'} with a strong track record in the comics industry.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Issuer Rating</p>
                  <p className={`font-medium ${getRatingColor(bond.creditRating).split(' ')[1]}`}>{bond.creditRating}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Bond Type</p>
                  <p className="text-white capitalize">{bond.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Volume</p>
                  <p className="text-white">{bond.volume.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Price Chart Placeholder */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 h-80 flex items-center justify-center">
              <p className="text-gray-400">Bond price performance chart would appear here</p>
            </div>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">YTD Return</p>
                <p className="text-xl font-bold text-green-400">+3.8%</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">1Y Return</p>
                <p className="text-xl font-bold text-green-400">+5.2%</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <p className="text-sm text-gray-400">Volatility</p>
                <p className="text-xl font-bold text-white">Low</p>
              </div>
            </div>
            
            {/* Yield Comparison */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="font-semibold text-white mb-3">Yield Comparison</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">This Bond</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-600 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(bond.yield / 8) * 100}%` }}></div>
                    </div>
                    <span className="text-white">{bond.yield}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Similar Bonds Avg.</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-600 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${((bond.yield - 0.3) / 8) * 100}%` }}></div>
                    </div>
                    <span className="text-white">{(bond.yield - 0.3).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Market Average</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-600 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${((bond.yield - 0.8) / 8) * 100}%` }}></div>
                    </div>
                    <span className="text-white">{(bond.yield - 0.8).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trading' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Quick Trade</h3>
                <OrderEntry
                  symbol={orderSymbol}
                  onSymbolChange={setOrderSymbol}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Bond Data</h3>
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Price</span>
                    <span className="text-white">CC {bond.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Face Value</span>
                    <span className="text-white">CC {bond.faceValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Yield</span>
                    <span className="text-green-400">{bond.yield}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Coupon Rate</span>
                    <span className="text-white">{bond.couponRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Maturity</span>
                    <span className="text-white">{new Date(bond.maturity).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Credit Rating</span>
                    <span className={`font-medium ${getRatingColor(bond.creditRating).split(' ')[1]}`}>{bond.creditRating}</span>
                  </div>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <h4 className="font-medium text-white mb-3">Trading Insights</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-indigo-400" />
                      <span className="text-sm text-gray-300">Bond trades at {bond.price > bond.faceValue ? 'premium' : bond.price < bond.faceValue ? 'discount' : 'par'} to face value</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-indigo-400" />
                      <span className="text-sm text-gray-300">
                        {bond.price > bond.faceValue 
                          ? 'Premium indicates strong demand and low perceived risk' 
                          : bond.price < bond.faceValue 
                          ? 'Discount may indicate higher risk or rising interest rate environment'
                          : 'Trading at par indicates market views bond as fairly priced'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">
                        {calculateYearsToMaturity()} years to maturity
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="flex justify-start">
        <Link
          to="/bonds"
          className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors touch-target"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Bonds</span>
        </Link>
      </div>
    </div>
  );
}

export default BondDetails;