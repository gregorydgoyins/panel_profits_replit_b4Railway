import React from 'react';

export function Navbar() {
  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-white">
            Panel Profits
          </div>
        </div>
      </div>
    </nav>
  );
}