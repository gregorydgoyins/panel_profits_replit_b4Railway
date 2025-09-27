import React from 'react';
import { IdeaRelationship, IdeaNode, RelationshipType, RelationshipStrength } from '../../types';

interface IdeaRelationshipRendererProps {
  relationship: IdeaRelationship;
  sourceNode: IdeaNode;
  targetNode: IdeaNode;
  onClick: (relationshipId: string, event: React.MouseEvent) => void;
  getRelationshipStyle: (relationship: IdeaRelationship) => { color: string; strokeDasharray?: string };
  getStrokeWidth: (strength: RelationshipStrength) => number;
}

export function IdeaRelationshipRenderer({
  relationship,
  sourceNode,
  targetNode,
  onClick,
  getRelationshipStyle,
  getStrokeWidth
}: IdeaRelationshipRendererProps) {
  if (!sourceNode.position || !targetNode.position) {
    return null;
  }
  
  const style = getRelationshipStyle(relationship);
  const strokeWidth = getStrokeWidth(relationship.strength);
  
  // Calculate label position with offset to avoid overlapping with line
  const midX = (sourceNode.position.x + targetNode.position.x) / 2;
  const midY = (sourceNode.position.y + targetNode.position.y) / 2;
  const labelOffset = 15; // Offset label from line
  
  return (
    <g key={relationship.id}>
      <line
        x1={sourceNode.position.x}
        y1={sourceNode.position.y}
        x2={targetNode.position.x}
        y2={targetNode.position.y}
        stroke={style.color}
        strokeWidth={strokeWidth}
        strokeDasharray={style.strokeDasharray}
        className="cursor-pointer hover:opacity-80 transition-all duration-200"
        onClick={(e) => onClick(relationship.id, e)}
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
        }}
      />
      
      {/* Arrow for unidirectional relationships */}
      {relationship.direction === 'unidirectional' && (
        (() => {
          const angle = Math.atan2(targetNode.position.y - sourceNode.position.y, targetNode.position.x - sourceNode.position.x);
          const arrowLength = 8;
          const arrowAngle = Math.PI / 6;
          
          // Position arrow near the target node
          const arrowX = targetNode.position.x - Math.cos(angle) * 30;
          const arrowY = targetNode.position.y - Math.sin(angle) * 30;
          
          const arrowX1 = arrowX - arrowLength * Math.cos(angle - arrowAngle);
          const arrowY1 = arrowY - arrowLength * Math.sin(angle - arrowAngle);
          const arrowX2 = arrowX - arrowLength * Math.cos(angle + arrowAngle);
          const arrowY2 = arrowY - arrowLength * Math.sin(angle + arrowAngle);
          
          return (
            <polygon
              points={`${arrowX},${arrowY} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
              fill={style.color}
            />
          );
        })()
      )}
      
      {/* Relationship label */}
      <text
        x={midX}
        y={midY - labelOffset}
        fill="#9CA3AF"
        fontSize="10"
        textAnchor="middle"
        className="pointer-events-none select-none"
        style={{
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'
        }}
      >
        {relationship.type.replace('-', ' ')}
      </text>
      {relationship.weight !== undefined && (
        <text
          x={midX}
          y={midY - labelOffset + 12}
          fill="#FCD34D"
          fontSize="8"
          textAnchor="middle"
          className="pointer-events-none select-none"
          style={{
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'
          }}
        >
          Weight: {relationship.weight.toFixed(1)}
        </text>
      )}
    </g>
  );
}

export default IdeaRelationshipRenderer;