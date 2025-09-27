import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Info } from 'lucide-react';
import { useMarketStore } from '../store/marketStore';
import { mockApi } from '../data/mockApi';

interface OrderEntryProps {
  symbol: string | undefined;
  onSymbolChange: (symbol: string | undefined) => void;
  className?: string;
}

export function OrderEntry({ symbol, onSymbolChange, className = '' }: OrderEntryProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const { userBalance } = useMarketStore();

  // Fetch current price when symbol changes
  React.useEffect(() => {
    const fetchPrice = async () => {
      if (!symbol) {
        setCurrentPrice(0);
        return;
      }
      
      try {
        const asset = await mockApi.fetchAssetBySymbol(symbol);
        setCurrentPrice(asset ? asset.price : 1000);
      } catch (error) {
        console.error('Failed to fetch asset price:', error);
        setCurrentPrice(1000); // Fallback price
      }
    };
    
    fetchPrice();
  }, [symbol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!symbol) {
        throw new Error('Symbol is required');
      }
      
      const result = await mockApi.executeTrade(symbol, side, parseFloat(quantity));
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Reset form
      setQuantity('');
      if (orderType === 'limit') {
        setPrice('');
      }
      
      // Show success message
      alert(`${result.message}\nTotal Cost: CC ${result.totalCost.toFixed(2)}\nFees: CC ${result.fees.toFixed(2)}`);
      
    } catch (error) {
      console.error('Order failed:', error);
      alert(`Order failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    const orderPrice = orderType === 'market' ? currentPrice : parseFloat(price) || 0;
    return qty * orderPrice;
  };

  const calculateFees = () => {
    return calculateTotal() * 0.001; // 0.1% fee
  };

  const canAfford = () => {
    if (side === 'sell') return true; // Can always sell what you own
    const total = calculateTotal() + calculateFees();
    return total <= userBalance;
  };

  return (
    <div className={`bg-slate-700/50 rounded-lg p-6 border border-slate-600/50 ${className}`}>
      <div className="space-y-4">
        {/* Symbol Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Symbol
          </label>
          <input
            type="text"
            value={symbol || ''}
            onChange={(e) => onSymbolChange(e.target.value.toUpperCase() || undefined)}
            placeholder="Enter symbol (e.g., ASM300)"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {symbol && (
            <p className="text-xs text-gray-400 mt-1">
              Current Price: CC {currentPrice.toLocaleString()}
            </p>
          )}
        </div>

        {/* Side Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Order Side
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setSide('buy')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                side === 'buy'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-green-600/20 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>Buy</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setSide('sell')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                side === 'sell'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-red-600/20 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center space-x-1">
                <TrendingDown className="h-4 w-4" />
                <span>Sell</span>
              </div>
            </button>
          </div>
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Order Type
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setOrderType('market')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                orderType === 'market'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-indigo-600/20 hover:text-white'
              }`}
            >
              Market
            </button>
            <button
              type="button"
              onClick={() => setOrderType('limit')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                orderType === 'limit'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-indigo-600/20 hover:text-white'
              }`}
            >
              Limit
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            min="0"
            step="0.01"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Price (for limit orders) */}
        {orderType === 'limit' && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Limit Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter limit price"
              min="0"
              step="0.01"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Order Summary */}
        {quantity && symbol && (
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50">
            <h4 className="font-medium text-white mb-3">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Symbol:</span>
                <span className="text-white">{symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Side:</span>
                <span className={side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                  {side.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Quantity:</span>
                <span className="text-white">{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Price:</span>
                <span className="text-white">
                  CC {orderType === 'market' ? currentPrice.toLocaleString() : (parseFloat(price) || 0).toLocaleString()}
                  {orderType === 'market' && <span className="text-xs text-gray-500 ml-1">(market)</span>}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-600/50 pt-2">
                <span className="text-gray-400">Subtotal:</span>
                <span className="text-white">CC {calculateTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fees (0.1%):</span>
                <span className="text-white">CC {calculateFees().toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-600/50 pt-2 font-semibold">
                <span className="text-gray-400">Total:</span>
                <span className="text-white">CC {(calculateTotal() + calculateFees()).toLocaleString()}</span>
              </div>
            </div>
            
            {side === 'buy' && !canAfford() && (
              <div className="mt-3 bg-red-900/30 p-3 rounded-lg border border-red-700/30 flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-200 text-sm">Insufficient funds</p>
                  <p className="text-red-300 text-xs">Available: CC {userBalance.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={!symbol || !quantity || isSubmitting || (side === 'buy' && !canAfford()) || (orderType === 'limit' && !price)}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
              side === 'buy'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <DollarSign className="h-4 w-4" />
                <span>
                  {side === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Trading Tips */}
        <div className="bg-indigo-900/20 rounded-lg p-4 border border-indigo-700/30">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-indigo-200 text-sm font-medium mb-1">Trading Tips</p>
              <ul className="text-indigo-300 text-xs space-y-1">
                <li>• Market orders execute immediately at the current price</li>
                <li>• Limit orders only execute at your specified price or better</li>
                <li>• All trades incur a 0.1% transaction fee</li>
                {side === 'buy' && <li>• Ensure you have sufficient funds before placing orders</li>}
                {side === 'sell' && <li>• You can only sell assets you currently own</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderEntry;