import React from 'react';
import { IdeaNode } from '../../types';

interface IdeaNodeRendererProps {
  node: IdeaNode;
  isSelected: boolean;
  onClick: (nodeId: string, event: React.MouseEvent) => void;
  onDoubleClick: (node: IdeaNode) => void;
  getCategoryColor: (category: string) => string;
}

export function IdeaNodeRenderer({ 
  node, 
  isSelected, 
  onClick, 
  onDoubleClick, 
  getCategoryColor 
}: IdeaNodeRendererProps) {
  if (!node.position) return null;
  
  const categoryColor = getCategoryColor(node.category);
  
  return (
    <g key={node.id}>
      <circle
        cx={node.position.x}
        cy={node.position.y}
        r="25"
        fill={categoryColor}
        stroke={isSelected ? '#6366F1' : '#374151'}
        strokeWidth={isSelected ? 4 : 1}
        className="cursor-pointer hover:opacity-80"
        style={{
          filter: isSelected ? 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.8))' : 'none'
        }}
        onClick={(e) => onClick(node.id, e)}
        onDoubleClick={() => onDoubleClick(node)}
      />
      <text
        x={node.position.x}
        y={node.position.y}
        fill="white"
        fontSize="9"
        textAnchor="middle"
        className="pointer-events-none font-medium select-none"
        style={{
          textShadow: isSelected ? '0 0 4px rgba(99, 102, 241, 0.8)' : '0 1px 2px rgba(0, 0, 0, 0.5)'
        }}
      >
        {node.label.length > 12 ? node.label.substring(0, 12) + '...' : node.label}
      </text>
      {node.value !== undefined && (
        <text
          x={node.position.x}
          y={node.position.y + 12}
          fill="#FCD34D"
          fontSize="8"
          textAnchor="middle"
          className="pointer-events-none font-medium select-none"
          style={{
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
          }}
        >
          CC {node.value.toLocaleString()}
        </text>
      )}
    </g>
  );
}

export default IdeaNodeRenderer;