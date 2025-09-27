import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { QuickTradeModal } from '../trading/QuickTradeModal';

interface CharacterTradeButtonProps {
  symbol: string;
  name: string;
  price: number;
  className?: string;
}

export function CharacterTradeButton({ symbol, name, price, className = '' }: CharacterTradeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  return (
    <>
      <button
        onClick={openModal}
        className={`flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg active:translate-y-0 ${className}`}
      >
        <TrendingUp className="h-4 w-4" />
        <span>Trade Now</span>
      </button>
      
      <QuickTradeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        symbol={symbol}
        currentPrice={price}
        assetName={name}
        assetType="character"
      />
    </>
  );
}

export default CharacterTradeButton;