import type { VisualNode } from '../types/wikirace';
import { Target, Flag } from 'lucide-react';

interface WikiNodeTreeProps {
  nodes: VisualNode[];
  onNodeClick: (nodeId: string) => void;
}

export function WikiNodeTree({ nodes, onNodeClick }: WikiNodeTreeProps) {
  const centerNode = nodes.find(n => n.isCurrent);
  const childNodes = nodes.filter(n => !n.isCurrent);

  const renderConnections = () => {
    if (!centerNode) return null;
    
    return childNodes.map(child => (
      <line
        key={`line-${child.id}`}
        x1={centerNode.x}
        y1={centerNode.y}
        x2={child.x}
        y2={child.y}
        stroke={child.isGoal ? '#10B981' : child.isInPath ? '#EF4444' : '#94A3B8'}
        strokeWidth={child.isGoal ? 3 : 2}
        strokeDasharray={child.isInPath ? '5,5' : 'none'}
        opacity={child.isGoal ? 0.8 : 0.4}
        className="transition-all duration-300"
      />
    ));
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Grid background */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Nodes and connections */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <g transform={`translate(${window.innerWidth * 0.4}, ${window.innerHeight * 0.5})`}>
          {renderConnections()}
        </g>
      </svg>

      <div 
        className="absolute inset-0"
        style={{ 
          transform: `translate(${window.innerWidth * 0.4}px, ${window.innerHeight * 0.5}px)`,
          zIndex: 2
        }}
      >
        {nodes.map(node => (
          <WikiNode
            key={node.id}
            node={node}
            onClick={() => !node.isCurrent && onNodeClick(node.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface WikiNodeProps {
  node: VisualNode;
  onClick: () => void;
}

function WikiNode({ node, onClick }: WikiNodeProps) {
  const getNodeColor = () => {
    if (node.isGoal) return '#10B981'; // Green for goal
    if (node.isStart) return '#8B5CF6'; // Purple for start
    if (node.isCurrent) return '#3B82F6'; // Blue for current
    if (node.isInPath) return '#F59E0B'; // Orange for visited
    return '#64748B'; // Gray for unvisited
  };

  const getNodeSize = () => {
    if (node.isCurrent) return 'scale-110';
    if (node.isGoal) return 'scale-105';
    return 'scale-100';
  };

  return (
    <div
      className={`absolute transition-all duration-300 ${!node.isCurrent ? 'cursor-pointer hover:scale-110' : ''}`}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: node.isCurrent ? 10 : node.isGoal ? 9 : 1
      }}
      onClick={onClick}
    >
      <div
        className={`relative px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 min-w-[160px] ${getNodeSize()}`}
        style={{
          backgroundColor: getNodeColor(),
          boxShadow: node.isCurrent 
            ? `0 0 0 4px white, 0 0 0 6px ${getNodeColor()}, 0 20px 25px -5px rgba(0, 0, 0, 0.1)` 
            : node.isGoal
            ? `0 0 20px ${getNodeColor()}`
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex items-center gap-2 justify-center">
          {node.isStart && <Flag className="w-4 h-4 text-white" />}
          {node.isGoal && <Target className="w-5 h-5 text-white animate-pulse" />}
          <div className="text-white select-none text-center">
            {node.title}
          </div>
        </div>
        
        {node.isGoal && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <Target className="w-4 h-4 text-white" />
          </div>
        )}
        
        {node.isCurrent && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full mt-2">
            <div className="bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
              현재 위치
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
