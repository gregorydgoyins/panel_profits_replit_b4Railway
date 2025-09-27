import React from 'react';
import { Network, Info, Lightbulb, Target, BarChart2 } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { IdeaMappingTool } from '../components/IdeaMappingTool';

export function IdeaMappingPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[
        { name: 'Ideas', path: '/ideas' },
        { name: 'Relationship Mapping' }
      ]} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Network className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Interactive Idea Relationship Mapping</h1>
        </div>
      </div>

      {/* Feature overview */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="flex items-start space-x-4 mb-6">
          <Info className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-gray-300 mb-4">
              Transform your linear brainstorming into strategic network thinking. This interactive tool helps you visualize complex relationships between ideas, identify critical dependencies, and discover hidden connections within your innovation ecosystem.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-yellow-400" />
                  <h3 className="font-medium text-white">Create & Connect</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Add ideas as nodes and define relationships like "depends on," "contradicts," or "enables" to build your knowledge network.
                </p>
              </div>
              
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-green-400" />
                  <h3 className="font-medium text-white">Analyze & Discover</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Identify influential ideas, trace dependency chains, and find critical paths through your innovation landscape.
                </p>
              </div>
              
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart2 className="h-5 w-5 text-purple-400" />
                  <h3 className="font-medium text-white">Visualize & Navigate</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Interactive graph and mind map views with advanced filtering, search, and auto-layout capabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main tool */}
      <IdeaMappingTool />

      {/* Quick start guide */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Quick Start Guide</h2>
            <div className="space-y-2 text-white/90">
              <p className="flex items-center space-x-2">
                <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                <span>Click "Add Factor" to create your first market factor node</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                <span>Select two factors and click "Connect" to define market relationships</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                <span>Use "Auto Layout" to organize your market network visually</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                <span>Toggle "Analysis" to discover market insights and critical opportunities</span>
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <Network className="h-24 w-24 text-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IdeaMappingPage;