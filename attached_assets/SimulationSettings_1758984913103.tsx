import React, { useState } from 'react';
import { Settings, Users, Clock, DollarSign, Activity, Info } from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';

interface SimulationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimulationSettings({ isOpen, onClose }: SimulationSettingsProps) {
  const { config, updateConfig, isRunning, isInitialized } = useSimulationStore();
  const [tempConfig, setTempConfig] = useState(config);

  if (!isOpen) return null;

  const handleSave = () => {
    updateConfig(tempConfig);
    console.log('SimulationSettings: Applying new config with', tempConfig.numInvestors, 'investors');
    onClose();
  };

  const presetConfigs = {
    small: {
      numInvestors: 100,
      simulationDuration: 500,
      tickInterval: 100,
      startingCapital: 100000
    },
    medium: {
      numInvestors: 1000,
      simulationDuration: 1000,
      tickInterval: 150,
      startingCapital: 100000
    },
    large: {
      numInvestors: 5000,
      simulationDuration: 2000,
      tickInterval: 200,
      startingCapital: 100000
    },
    massive: {
      numInvestors: 10000,
      simulationDuration: 3000,
      tickInterval: 250,
      startingCapital: 100000
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Simulation Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Performance Notice */}
          {tempConfig.numInvestors > 5000 && (
            <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-white mb-1">Performance Notice</h3>
                  <p className="text-sm text-yellow-200">
                    Large simulations with {tempConfig.numInvestors.toLocaleString()} investors use significant computational resources. 
                    The simulation uses Web Workers to maintain UI responsiveness. Changing investor count will reset the simulation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Presets */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Quick Presets</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(presetConfigs).map(([name, preset]) => (
                <button
                  key={name}
                  onClick={() => setTempConfig(prev => ({ ...prev, ...preset }))}
                  className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg border border-slate-600/50 transition-colors"
                >
                  <div className="text-center">
                    <p className="text-white font-medium capitalize">{name}</p>
                    <p className="text-xs text-gray-400">{preset.numInvestors.toLocaleString()} investors</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-400 mb-2">
                <Users className="h-4 w-4" />
                <span>Number of Investors</span>
              </label>
              <input
                type="number"
                min="10"
                max="50000"
                step="100"
                value={tempConfig.numInvestors}
                onChange={(e) => setTempConfig(prev => ({ ...prev, numInvestors: parseInt(e.target.value) }))}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 100-1000 for testing, 5000+ for realistic simulation
              </p>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-400 mb-2">
                <Activity className="h-4 w-4" />
                <span>Simulation Steps</span>
              </label>
              <input
                type="number"
                min="100"
                max="10000"
                step="100"
                value={tempConfig.simulationDuration}
                onChange={(e) => setTempConfig(prev => ({ ...prev, simulationDuration: parseInt(e.target.value) }))}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Total number of simulation iterations
              </p>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-400 mb-2">
                <Clock className="h-4 w-4" />
                <span>Tick Interval (ms)</span>
              </label>
              <input
                type="number"
                min="50"
                max="1000"
                step="50"
                value={tempConfig.tickInterval}
                onChange={(e) => setTempConfig(prev => ({ ...prev, tickInterval: parseInt(e.target.value) }))}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Time between steps. Increase for better performance with many investors.
              </p>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-400 mb-2">
                <DollarSign className="h-4 w-4" />
                <span>Starting Capital (CC)</span>
              </label>
              <input
                type="number"
                min="10000"
                max="1000000"
                step="10000"
                value={tempConfig.startingCapital}
                onChange={(e) => setTempConfig(prev => ({ ...prev, startingCapital: parseInt(e.target.value) }))}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          {/* Performance Estimate */}
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <h3 className="font-medium text-white mb-3">Performance Estimate</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Complexity</p>
                <p className={`font-medium ${
                  tempConfig.numInvestors <= 1000 ? 'text-green-400' :
                  tempConfig.numInvestors <= 5000 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {tempConfig.numInvestors <= 1000 ? 'Low' :
                   tempConfig.numInvestors <= 5000 ? 'Medium' : 'High'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Memory Usage</p>
                <p className="text-white">{Math.round(tempConfig.numInvestors * 0.05)}MB</p>
              </div>
              <div>
                <p className="text-gray-400">Est. Duration</p>
                <p className="text-white">
                  {Math.round((tempConfig.simulationDuration * tempConfig.tickInterval) / 1000)}s
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t border-slate-700/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isRunning}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default SimulationSettings;