import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { IdeaNode, RelationshipType, RelationshipStrength, RelationshipDirection } from '../../types';

interface IdeaMappingModalsProps {
  // Create Node Modal
  isCreateNodeModalOpen: boolean;
  setIsCreateNodeModalOpen: (open: boolean) => void;
  newNodeForm: {
    label: string;
    description: string;
    category: string;
    tags: string;
  };
  setNewNodeForm: React.Dispatch<React.SetStateAction<{
    label: string;
    description: string;
    category: string;
    tags: string;
  }>>;
  handleCreateNode: () => void;

  // Create Relationship Modal
  isCreateRelationshipModalOpen: boolean;
  setIsCreateRelationshipModalOpen: (open: boolean) => void;
  newRelationshipForm: {
    sourceId: string;
    targetId: string;
    type: RelationshipType;
    strength: RelationshipStrength;
    direction: RelationshipDirection;
    description: string;
  };
  setNewRelationshipForm: React.Dispatch<React.SetStateAction<{
    sourceId: string;
    targetId: string;
    type: RelationshipType;
    strength: RelationshipStrength;
    direction: RelationshipDirection;
    description: string;
  }>>;
  handleCreateRelationship: () => void;
  nodes: IdeaNode[];

  // Edit Node Modal
  isEditNodeModalOpen: boolean;
  setIsEditNodeModalOpen: (open: boolean) => void;
  editingNode: IdeaNode | null;
  setEditingNode: (node: IdeaNode | null) => void;
  handleUpdateNode: () => void;
  handleDeleteNode: (nodeId: string) => void;
}

export function IdeaMappingModals({
  isCreateNodeModalOpen,
  setIsCreateNodeModalOpen,
  newNodeForm,
  setNewNodeForm,
  handleCreateNode,
  isCreateRelationshipModalOpen,
  setIsCreateRelationshipModalOpen,
  newRelationshipForm,
  setNewRelationshipForm,
  handleCreateRelationship,
  nodes,
  isEditNodeModalOpen,
  setIsEditNodeModalOpen,
  editingNode,
  setEditingNode,
  handleUpdateNode,
  handleDeleteNode
}: IdeaMappingModalsProps) {
  return (
    <>
      {/* Create Node Modal */}
      {isCreateNodeModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h3 className="text-lg font-bold text-white">Create New Idea</h3>
              <button
                onClick={() => setIsCreateNodeModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Label</label>
                <input
                  type="text"
                  value={newNodeForm.label}
                  onChange={(e) => setNewNodeForm(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                  placeholder="Enter idea title..."
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={newNodeForm.description}
                  onChange={(e) => setNewNodeForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white h-24"
                  placeholder="Describe your idea..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select
                  value={newNodeForm.category}
                  onChange={(e) => setNewNodeForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                >
                  <option value="general">General</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="security">Security</option>
                  <option value="marketing">Marketing</option>
                  <option value="analytics">Analytics</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newNodeForm.tags}
                  onChange={(e) => setNewNodeForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                  placeholder="tag1, tag2, tag3..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Market Value (CC)</label>
                <input
                  type="number"
                  value={newNodeForm.value || ''}
                  onChange={(e) => setNewNodeForm(prev => ({ ...prev, value: e.target.value ? parseFloat(e.target.value) : undefined }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                  placeholder="Enter market value..."
                  min="0"
                  step="1000"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-slate-700/50">
              <button
                onClick={() => setIsCreateNodeModalOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNode}
                disabled={!newNodeForm.label.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-500"
              >
                Create Idea
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Relationship Modal */}
      {isCreateRelationshipModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h3 className="text-lg font-bold text-white">Create Relationship</h3>
              <button
                onClick={() => setIsCreateRelationshipModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">From</label>
                  <select
                    value={newRelationshipForm.sourceId}
                    onChange={(e) => setNewRelationshipForm(prev => ({ ...prev, sourceId: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select idea...</option>
                    {nodes.map(node => (
                      <option key={node.id} value={node.id}>{node.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">To</label>
                  <select
                    value={newRelationshipForm.targetId}
                    onChange={(e) => setNewRelationshipForm(prev => ({ ...prev, targetId: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select idea...</option>
                    {nodes.filter(node => node.id !== newRelationshipForm.sourceId).map(node => (
                      <option key={node.id} value={node.id}>{node.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Relationship Type</label>
                <select
                  value={newRelationshipForm.type}
                  onChange={(e) => setNewRelationshipForm(prev => ({ ...prev, type: e.target.value as RelationshipType }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                >
                  <option value="depends-on">Depends On</option>
                  <option value="related-to">Related To</option>
                  <option value="contradicts">Contradicts</option>
                  <option value="sub-idea-of">Sub-idea Of</option>
                  <option value="influences">Influences</option>
                  <option value="blocks">Blocks</option>
                  <option value="enables">Enables</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Strength</label>
                  <select
                    value={newRelationshipForm.strength}
                    onChange={(e) => setNewRelationshipForm(prev => ({ ...prev, strength: e.target.value as RelationshipStrength }))}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="weak">Weak</option>
                    <option value="moderate">Moderate</option>
                    <option value="strong">Strong</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Direction</label>
                  <select
                    value={newRelationshipForm.direction}
                    onChange={(e) => setNewRelationshipForm(prev => ({ ...prev, direction: e.target.value as RelationshipDirection }))}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="unidirectional">One-way</option>
                    <option value="bidirectional">Two-way</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description (optional)</label>
                <textarea
                  value={newRelationshipForm.description}
                  onChange={(e) => setNewRelationshipForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white h-20"
                  placeholder="Describe the relationship..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Weight (0.0 - 1.0)</label>
                <input
                  type="number"
                  value={newRelationshipForm.weight || ''}
                  onChange={(e) => setNewRelationshipForm(prev => ({ ...prev, weight: e.target.value ? parseFloat(e.target.value) : undefined }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                  placeholder="Enter relationship weight..."
                  min="0"
                  max="1"
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-slate-700/50">
              <button
                onClick={() => setIsCreateRelationshipModalOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRelationship}
                disabled={!newRelationshipForm.sourceId || !newRelationshipForm.targetId}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Relationship
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Node Modal */}
      {isEditNodeModalOpen && editingNode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h3 className="text-lg font-bold text-white">Edit Idea</h3>
              <button
                onClick={() => {
                  setIsEditNodeModalOpen(false);
                  setEditingNode(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Label</label>
                <input
                  type="text"
                  value={newNodeForm.label}
                  onChange={(e) => setNewNodeForm(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={newNodeForm.description}
                  onChange={(e) => setNewNodeForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white h-24"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select
                  value={newNodeForm.category}
                  onChange={(e) => setNewNodeForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                >
                  <option value="general">General</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="security">Security</option>
                  <option value="marketing">Marketing</option>
                  <option value="analytics">Analytics</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tags</label>
                <input
                  type="text"
                  value={newNodeForm.tags}
                  onChange={(e) => setNewNodeForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Market Value (CC)</label>
                <input
                  type="number"
                  value={newNodeForm.value || ''}
                  onChange={(e) => setNewNodeForm(prev => ({ ...prev, value: e.target.value ? parseFloat(e.target.value) : undefined }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
                  placeholder="Enter market value..."
                  min="0"
                  step="1000"
                />
              </div>
            </div>
            
            <div className="flex justify-between p-6 border-t border-slate-700/50">
              <button
                onClick={() => handleDeleteNode(editingNode.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsEditNodeModalOpen(false);
                    setEditingNode(null);
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateNode}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default IdeaMappingModals;