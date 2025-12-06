import { useState } from 'react';
import type { MindMapNode as MindMapNodeType, MindMapData } from '../types/mindmap';
import { MindMapNode } from './MindMapNode';
import { ColorPicker } from './ColorPicker';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';

const initialData: MindMapData = {
  nodes: {
    'root': {
      id: 'root',
      text: '중심 아이디어',
      color: '#8B5CF6',
      x: 0,
      y: 0,
      parentId: null,
      children: []
    }
  },
  rootId: 'root'
};

export function MindMap() {
  const [data, setData] = useState<MindMapData>(initialData);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const addChildNode = (parentId: string) => {
    const newId = `node-${Date.now()}`;
    const parent = data.nodes[parentId];
    
    // Calculate position for new node
    const childCount = parent.children.length;
    const angle = (Math.PI * 2 * childCount) / Math.max(parent.children.length + 1, 4);
    const distance = 200;
    const x = parent.x + Math.cos(angle) * distance;
    const y = parent.y + Math.sin(angle) * distance;

    const newNode: MindMapNodeType = {
      id: newId,
      text: '새 노드',
      color: '#3B82F6',
      x,
      y,
      parentId,
      children: []
    };

    setData({
      ...data,
      nodes: {
        ...data.nodes,
        [newId]: newNode,
        [parentId]: {
          ...parent,
          children: [...parent.children, newId]
        }
      }
    });
  };

  const deleteNode = (nodeId: string) => {
    if (nodeId === data.rootId) return; // Can't delete root

    const node = data.nodes[nodeId];
    const newNodes = { ...data.nodes };

    // Remove from parent's children
    if (node.parentId) {
      const parent = newNodes[node.parentId];
      newNodes[node.parentId] = {
        ...parent,
        children: parent.children.filter(id => id !== nodeId)
      };
    }

    // Delete node and all its children recursively
    const deleteRecursive = (id: string) => {
      const n = newNodes[id];
      if (n) {
        n.children.forEach(deleteRecursive);
        delete newNodes[id];
      }
    };

    deleteRecursive(nodeId);

    setData({ ...data, nodes: newNodes });
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  const updateNodeText = (nodeId: string, text: string) => {
    setData({
      ...data,
      nodes: {
        ...data.nodes,
        [nodeId]: {
          ...data.nodes[nodeId],
          text
        }
      }
    });
  };

  const updateNodeColor = (nodeId: string, color: string) => {
    setData({
      ...data,
      nodes: {
        ...data.nodes,
        [nodeId]: {
          ...data.nodes[nodeId],
          color
        }
      }
    });
  };

  const updateNodePosition = (nodeId: string, x: number, y: number) => {
    setData({
      ...data,
      nodes: {
        ...data.nodes,
        [nodeId]: {
          ...data.nodes[nodeId],
          x,
          y
        }
      }
    });
  };

  const renderConnections = () => {
    const lines: React.ReactElement[] = [];
    Object.values(data.nodes).forEach(node => {
      if (node.parentId) {
        const parent = data.nodes[node.parentId];
        lines.push(
          <line
            key={`line-${node.id}`}
            x1={parent.x}
            y1={parent.y}
            x2={node.x}
            y2={node.y}
            stroke={node.color}
            strokeWidth="2"
            opacity="0.6"
          />
        );
      }
    });
    return lines;
  };

  const selectedNode = selectedNodeId ? data.nodes[selectedNodeId] : null;

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b p-4 flex items-center gap-4 shadow-sm">
        <h1 className="text-gray-900">마인드맵</h1>
        {selectedNode && selectedNodeId && (
          <>
            <div className="h-6 w-px bg-gray-300" />
            <Button
              onClick={() => addChildNode(selectedNodeId)}
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              브랜치 추가
            </Button>
            <ColorPicker
              color={selectedNode.color}
              onChange={(color) => updateNodeColor(selectedNodeId, color)}
            />
            {selectedNodeId !== data.rootId && (
              <Button
                onClick={() => deleteNode(selectedNodeId)}
                size="sm"
                variant="destructive"
              >
                삭제
              </Button>
            )}
          </>
        )}
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          <g transform={`translate(${window.innerWidth / 2}, ${window.innerHeight / 2})`}>
            {renderConnections()}
          </g>
        </svg>

        <div 
          className="absolute inset-0"
          style={{ 
            transform: `translate(${window.innerWidth / 2}px, ${window.innerHeight / 2}px)` 
          }}
        >
          {Object.values(data.nodes).map(node => (
            <MindMapNode
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              isEditing={editingNodeId === node.id}
              onSelect={() => setSelectedNodeId(node.id)}
              onEdit={() => setEditingNodeId(node.id)}
              onEditComplete={() => setEditingNodeId(null)}
              onTextChange={(text) => updateNodeText(node.id, text)}
              onPositionChange={(x, y) => updateNodePosition(node.id, x, y)}
              onAddChild={() => addChildNode(node.id)}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white border-t p-3 text-gray-600 text-center">
        노드를 클릭하여 선택하고, 드래그하여 이동하세요. 더블클릭으로 텍스트를 편집할 수 있습니다.
      </div>
    </div>
  );
}
