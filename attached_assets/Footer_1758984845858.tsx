import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, TrendingUp, Briefcase, BarChart2, Users, Award, 
  Building2, Zap, Shield, BookOpen, Brain, Newspaper, 
  FileText, GraduationCap, Star, Settings, User, LogIn, TrendingDown,
  Target, Calculator, Crown
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Platform Core */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center space-x-2">
              <Home className="h-5 w-5 text-indigo-400" />
              <span>Platform</span>
            </h3>
            <nav className="space-y-2">
              <Link to="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link to="/trading" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <TrendingUp className="h-4 w-4" />
                <span>Trading Center</span>
              </Link>
              <Link to="/portfolio" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Briefcase className="h-4 w-4" />
                <span>Portfolio</span>
              </Link>
              <Link to="/markets" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <BarChart2 className="h-4 w-4" />
                <span>Markets</span>
              </Link>
            </nav>
          </div>

          {/* Assets */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-400" />
              <span>Assets</span>
            </h3>
            <nav className="space-y-2">
              <Link to="/characters" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Users className="h-4 w-4" />
                <span>Characters</span>
              </Link>
              <Link to="/creators" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Award className="h-4 w-4" />
                <span>Creators</span>
              </Link>
              <Link to="/locations" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Building2 className="h-4 w-4" />
                <span>Locations</span>
              </Link>
              <Link to="/gadgets" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Zap className="h-4 w-4" />
                <span>Gadgets</span>
              </Link>
              <Link to="/bonds" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Shield className="h-4 w-4" />
                <span>Bonds</span>
              </Link>
              <Link to="/funds" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Briefcase className="h-4 w-4" />
                <span>Funds</span>
              </Link>
              <Link to="/key-comics" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <BookOpen className="h-4 w-4" />
                <span>Key Comics</span>
              </Link>
            </nav>
          </div>

          {/* Trading */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span>Trading</span>
            </h3>
            <nav className="space-y-2">
              <Link to="/trading/buy" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <TrendingUp className="h-4 w-4" />
                <span>Buy Assets</span>
              </Link>
              <Link to="/trading/sell" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <TrendingDown className="h-4 w-4" />
                <span>Sell Assets</span>
              </Link>
              <Link to="/trading/etfs" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <BarChart2 className="h-4 w-4" />
                <span>ETFs</span>
              </Link>
              <Link to="/trading/options/calls" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <TrendingUp className="h-4 w-4" />
                <span>Call Options</span>
              </Link>
              <Link to="/trading/options/puts" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <TrendingDown className="h-4 w-4" />
                <span>Put Options</span>
              </Link>
              <Link to="/trading/specialty/straddles" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Target className="h-4 w-4" />
                <span>Straddles</span>
              </Link>
              <Link to="/trading/derivatives-futures" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <BarChart2 className="h-4 w-4" />
                <span>Derivatives</span>
              </Link>
            </nav>
          </div>

          {/* Intelligence & Analysis */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center space-x-2">
              <Brain className="h-5 w-5 text-orange-300" />
              <span>Intelligence</span>
            </h3>
            <nav className="space-y-2">
              <Link to="/ideas" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Brain className="h-4 w-4" />
                <span>AI Analysis</span>
              </Link>
              <Link to="/ideas/mapping" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Target className="h-4 w-4" />
                <span>Market Mapping</span>
              </Link>
              <Link to="/technical-analysis" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <BarChart2 className="h-4 w-4" />
                <span>Technical Analysis</span>
              </Link>
              <Link to="/simulation" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Brain className="h-4 w-4" />
                <span>AI Simulation</span>
              </Link>
              <Link to="/news" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Newspaper className="h-4 w-4" />
                <span>News</span>
              </Link>
              <Link to="/research" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <FileText className="h-4 w-4" />
                <span>Research</span>
              </Link>
              <Link to="/markets/calendar" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <BarChart2 className="h-4 w-4" />
                <span>Market Calendar</span>
              </Link>
            </nav>
          </div>

          {/* Learning & Tools */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-indigo-400" />
              <span>Learning</span>
            </h3>
            <nav className="space-y-2">
              <Link to="/learn" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <GraduationCap className="h-4 w-4" />
                <span>Learning Center</span>
              </Link>
              <Link to="/learn/comic-fundamentals" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <BookOpen className="h-4 w-4" />
                <span>Comic Fundamentals</span>
              </Link>
              <Link to="/learn/advanced-options" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Target className="h-4 w-4" />
                <span>Advanced Options</span>
              </Link>
              <Link to="/portfolio/watchlist" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Star className="h-4 w-4" />
                <span>Watchlist</span>
              </Link>
              <Link to="/portfolio/tools" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="h-4 w-4" />
                <span>Trading Tools</span>
              </Link>
              <Link to="/portfolio/formulas" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Calculator className="h-4 w-4" />
                <span>Formulas</span>
              </Link>
            </nav>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-400" />
              <span>Account</span>
            </h3>
            <nav className="space-y-2">
              <Link to="/login" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <User className="h-4 w-4" />
                <span>Register</span>
              </Link>
              <Link to="/profile" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Link to="/portfolio/journal" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <BookOpen className="h-4 w-4" />
                <span>Trading Journal</span>
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Quick Access Links */}
        <div className="border-t border-slate-700 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <Link to="/characters/heroes" className="bg-slate-700/50 hover:bg-slate-700 p-3 rounded-lg transition-colors text-center group">
              <Users className="h-6 w-6 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-300 group-hover:text-white">Heroes</span>
            </Link>
            <Link to="/characters/villains" className="bg-slate-700/50 hover:bg-slate-700 p-3 rounded-lg transition-colors text-center group">
              <Users className="h-6 w-6 text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-300 group-hover:text-white">Villains</span>
            </Link>
            <Link to="/bonds/creator" className="bg-slate-700/50 hover:bg-slate-700 p-3 rounded-lg transition-colors text-center group">
              <Award className="h-6 w-6 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-300 group-hover:text-white">Creator Bonds</span>
            </Link>
            <Link to="/funds/themed" className="bg-slate-700/50 hover:bg-slate-700 p-3 rounded-lg transition-colors text-center group">
              <Star className="h-6 w-6 text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-300 group-hover:text-white">Themed Funds</span>
            </Link>
            <Link to="/trading/options/calls" className="bg-slate-700/50 hover:bg-slate-700 p-3 rounded-lg transition-colors text-center group">
              <TrendingUp className="h-6 w-6 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-300 group-hover:text-white">Call Options</span>
            </Link>
            <Link to="/learn/comic-fundamentals" className="bg-slate-700/50 hover:bg-slate-700 p-3 rounded-lg transition-colors text-center group">
              <GraduationCap className="h-6 w-6 text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-300 group-hover:text-white">Learn Trading</span>
            </Link>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-slate-700 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Crown className="h-8 w-8 text-indigo-400" />
              <div>
                <h4 className="text-white font-bold text-xl">Panel Profits</h4>
                <p className="text-gray-400 text-sm">AI-Powered Comic Trading Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-white font-medium">500+</p>
                <p className="text-gray-400 text-xs">Tradeable Assets</p>
              </div>
              <div className="text-center">
                <p className="text-white font-medium">95%</p>
                <p className="text-gray-400 text-xs">AI Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-white font-medium">24/7</p>
                <p className="text-gray-400 text-xs">Market Data</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm">
              &copy; 2025 Panel Profits - AI-Powered Comic Trading Platform. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Virtual trading platform for educational and entertainment purposes. Not actual investment advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}