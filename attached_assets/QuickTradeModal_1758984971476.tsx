import React, { useState, useEffect } from 'react';
import { X, Info, DollarSign } from 'lucide-react';
import { OrderEntry } from '../OrderEntry';
import { useMarketStore } from '../../store/marketStore';

interface QuickTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  currentPrice?: number;
  assetName?: string;
  assetType?: 'character' | 'creator' | 'bond' | 'fund' | 'location' | 'gadget';
}

export function QuickTradeModal({ 
  isOpen, 
  onClose, 
  symbol, 
  currentPrice,
  assetName,
  assetType = 'character'
}: QuickTradeModalProps) {
  const [orderSymbol, setOrderSymbol] = useState(symbol);
  const { userBalance } = useMarketStore();
  
  // Reset symbol when modal opens with new symbol
  useEffect(() => {
    setOrderSymbol(symbol);
  }, [symbol, isOpen]);
  
  if (!isOpen) return null;
  
  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800/95 rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Quick Trade: {assetName || symbol}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700/50"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Asset Type:</span>
                  <span className="text-white capitalize">{assetType}</span>
                </div>
                {currentPrice && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Current Price:</span>
                    <span className="text-white">CC {currentPrice.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Your Balance:</span>
                  <span className="text-white">CC {userBalance.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/30 flex items-start space-x-3">
                <Info className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-indigo-200">
                    Use market orders for immediate execution at the current price, or limit orders to specify your desired price.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <OrderEntry
                symbol={orderSymbol}
                onSymbolChange={setOrderSymbol}
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors mr-3"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuickTradeModal;