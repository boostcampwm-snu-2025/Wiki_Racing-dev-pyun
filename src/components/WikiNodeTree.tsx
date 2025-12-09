import { useMemo } from 'react';
import type { VisualNode } from '../types/wikirace';
import { Skeleton } from './ui/skeleton';

interface WikiNodeTreeProps {
  nodes: VisualNode[];
  onNodeClick: (nodeId: string) => void;
  isLoading?: boolean;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function WikiNodeTree({ nodes, onNodeClick, isLoading = false }: WikiNodeTreeProps) {
  // 중앙 노드는 표시하지 않음 (헤더에 이미 표시됨)
  const childNodes = nodes.filter(n => !n.isCurrent);

  // 노드 위치를 계산 - 겹치지 않도록 배치
  const nodePositions = useMemo(() => {
    const positions: NodePosition[] = [];
    const nodeWidth = 140; // 노드 너비 (px 단위로 생각)
    const nodeHeight = 45; // 노드 높이
    const minGap = 30; // 노드 간 최소 간격

    // 안정적인 랜덤 시드 사용 (노드 ID 기반)
    const getStableRandom = (nodeId: string, seed: number) => {
      let hash = 0;
      for (let i = 0; i < nodeId.length; i++) {
        hash = ((hash << 5) - hash) + nodeId.charCodeAt(i) + seed;
        hash |= 0;
      }
      return Math.abs(Math.sin(hash)) * 0.7 + 0.15; // 15-85% 범위
    };

    childNodes.forEach((node, index) => {
      let attempts = 0;
      let position: NodePosition | null = null;

      // 겹치지 않는 위치를 찾을 때까지 시도
      while (attempts < 200 && !position) {
        const x = getStableRandom(node.id, attempts * 2) * 100;
        const y = getStableRandom(node.id, attempts * 2 + 1) * 100;

        // 다른 노드들과 겹치는지 확인 (사각형 충돌 검사)
        const overlaps = positions.some(p => {
          // 화면 크기를 1000px로 가정
          const thisLeft = (x / 100) * 1000 - nodeWidth / 2;
          const thisRight = (x / 100) * 1000 + nodeWidth / 2;
          const thisTop = (y / 100) * 1000 - nodeHeight / 2;
          const thisBottom = (y / 100) * 1000 + nodeHeight / 2;

          const otherLeft = (p.x / 100) * 1000 - p.width / 2;
          const otherRight = (p.x / 100) * 1000 + p.width / 2;
          const otherTop = (p.y / 100) * 1000 - p.height / 2;
          const otherBottom = (p.y / 100) * 1000 + p.height / 2;

          // 간격을 고려한 충돌 검사
          return !(
            thisRight + minGap < otherLeft ||
            thisLeft - minGap > otherRight ||
            thisBottom + minGap < otherTop ||
            thisTop - minGap > otherBottom
          );
        });

        if (!overlaps) {
          position = { id: node.id, x, y, width: nodeWidth, height: nodeHeight };
        }

        attempts++;
      }

      // 적절한 위치를 찾지 못했다면 그리드 배치
      if (!position) {
        const cols = Math.ceil(Math.sqrt(childNodes.length));
        const row = Math.floor(index / cols);
        const col = index % cols;
        const x = 20 + (col * 60 / cols);
        const y = 20 + (row * 60 / Math.ceil(childNodes.length / cols));
        position = { id: node.id, x, y, width: nodeWidth, height: nodeHeight };
      }

      positions.push(position);
    });

    return positions;
  }, [childNodes.map(n => n.id).join(',')]);


  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm">
      {/* 노드들을 자유롭게 배치 */}
      {childNodes.map((node, index) => {
        const position = nodePositions.find(p => p.id === node.id);
        if (!position) return null;

        const isVisited = node.isInPath && !node.isGoal;

        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {isLoading ? (
              // 로딩 중일 때 Skeleton 표시
              <Skeleton className="h-10 w-32 rounded-lg" />
            ) : (
              // 로딩 완료 후 실제 노드 표시
              <div
                className={`px-4 py-2 rounded-lg cursor-pointer transition-all shadow-sm border whitespace-nowrap ${
                  node.isGoal
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    : isVisited
                    ? 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100'
                    : 'bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200'
                } hover:shadow-md hover:-translate-y-0.5`}
                onClick={() => onNodeClick(node.id)}
              >
                <div
                  className={`text-sm font-semibold tracking-tight ${
                    node.isGoal
                      ? 'text-emerald-700'
                      : isVisited
                      ? 'text-orange-700'
                      : 'text-slate-900'
                  }`}
                >
                  {node.title}
                  {isVisited && !node.isGoal && (
                    <span className="ml-2 text-[10px] font-semibold uppercase text-orange-600">Visited</span>
                  )}
                  {node.isGoal && (
                    <span className="ml-2 text-[10px] font-semibold uppercase text-emerald-600">Goal</span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
