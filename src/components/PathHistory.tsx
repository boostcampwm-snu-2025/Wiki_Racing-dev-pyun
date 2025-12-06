import { useMemo } from 'react';
import type { GameState, NavigationStep } from '../types/wikirace';
import { mockWikiDocuments } from '../data/mockWikiData';
import { ScrollArea } from './ui/scroll-area';

const COLUMN_WIDTH = 64;
const ROW_HEIGHT = 72;

interface PathHistoryProps {
  gameState: GameState;
  onNodeClick?: (branchId: string, nodeIndex: number, docId: string) => void;
  onToggle?: () => void;
}

interface HistoryEntry {
  docId: string;
  depth: number;
  previousDepth: number;
  index: number;
  isLast: boolean;
  viaBacktrack: boolean;
}

export function PathHistory({ gameState, onNodeClick, onToggle }: PathHistoryProps) {
  const branchCount = gameState.branches.length || 1;
  const nodeHeight = 96;
  const columnWidth = 220;

  const nodePositions: {
    key: string;
    branchId: string;
    nodeIndex: number;
    docId: string;
    row: number;
    x: number;
    y: number;
  }[] = [];

  gameState.branches.forEach((branch, branchIdx) => {
    const baseRow = branch.parentIndex;
    branch.nodes.forEach((docId, nodeIndex) => {
      const row = baseRow + nodeIndex;
      const x = branchIdx * columnWidth + columnWidth / 2;
      const y = row * nodeHeight + nodeHeight / 2;
      nodePositions.push({
        key: `${branch.id}-${nodeIndex}`,
        branchId: branch.id,
        nodeIndex,
        docId,
        row,
        x,
        y,
      });
    });
  });

  const positionMap = Object.fromEntries(nodePositions.map(pos => [pos.key, pos]));
  const maxRow = Math.max(0, ...nodePositions.map(pos => pos.row));
  const activePathKeys = new Set(
    gameState.pathRefs.map(ref => `${ref.branchId}-${ref.index}`)
  );
  const currentKey = gameState.pathRefs[gameState.pathRefs.length - 1]
    ? `${gameState.pathRefs[gameState.pathRefs.length - 1].branchId}-${
        gameState.pathRefs[gameState.pathRefs.length - 1].index
      }`
    : null;

  const hasBranchData = nodePositions.length > 0;

  return (
    <div className="w-80 bg-white border-l flex flex-col max-h-screen">
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gray-900">방문 기록</h3>
        <div className="text-xs text-gray-500 mt-1">
          총 {historySteps.length}개 문서 방문 · {gameState.allowBacktracking ? '역링크 허용' : '역링크 비허용'}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-4">
            {hasBranchData ? (
              <div
                className="relative"
                style={{
                  minWidth: `${branchCount * columnWidth + 40}px`,
                  height: `${(maxRow + 1) * nodeHeight + 40}px`,
                }}
              >
                <svg
                  className="absolute inset-0"
                  width={branchCount * columnWidth + 40}
                  height={(maxRow + 1) * nodeHeight + 40}
                >
                  {gameState.branches.map(branch => {
                    return branch.nodes.map((_, idx) => {
                      if (idx === 0) return null;
                      const fromKey = `${branch.id}-${idx - 1}`;
                      const toKey = `${branch.id}-${idx}`;
                      const fromPos = positionMap[fromKey];
                      const toPos = positionMap[toKey];
                      if (!fromPos || !toPos) return null;
                      return (
                        <line
                          key={`${branch.id}-line-${idx}`}
                          x1={fromPos.x + 20}
                          y1={fromPos.y + 20}
                          x2={toPos.x + 20}
                          y2={toPos.y + 20}
                          stroke={branch.color}
                          strokeWidth={2}
                          strokeLinecap="round"
                          opacity={0.9}
                        />
                      );
                    });
                  })}

                  {gameState.branches.map(branch => {
                    if (!branch.parentId) return null;
                    const parentKey = `${branch.parentId}-${branch.parentIndex}`;
                    const childKey = `${branch.id}-0`;
                    const parentPos = positionMap[parentKey];
                    const childPos = positionMap[childKey];
                    if (!parentPos || !childPos) return null;

                    const midY = (parentPos.y + childPos.y) / 2 + 20;
                    return (
                      <path
                        key={`${branch.id}-fork`}
                        d={`M${parentPos.x + 20},${parentPos.y + 20} C ${parentPos.x + 80},${midY} ${childPos.x - 40},${midY} ${childPos.x + 20},${childPos.y + 20}`}
                        fill="none"
                        stroke={branch.color}
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>

                {nodePositions.map(pos => {
                  const doc = mockWikiDocuments[pos.docId];
                  const isStart = pos.docId === gameState.startDocId;
                  const isGoal = pos.docId === gameState.goalDocId;
                  const isCurrent = currentKey === pos.key;
                  const isInPath = activePathKeys.has(pos.key);
                  const badgeLabel = isStart
                    ? '시작'
                    : isGoal
                      ? '목표'
                      : isCurrent
                        ? '현재'
                        : isInPath
                          ? '경로'
                          : '';

                  return (
                    <div
                      key={pos.key}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 w-[180px] rounded-xl border shadow-sm bg-white transition-transform ${
                        onNodeClick && !isCurrent ? 'hover:-translate-y-2 cursor-pointer' : ''
                      } ${isInPath ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200'}`}
                      style={{
                        left: pos.x + 20,
                        top: pos.y + 20,
                      }}
                      onClick={() => {
                        if (!onNodeClick || isCurrent) return;
                        onNodeClick(pos.branchId, pos.nodeIndex, pos.docId);
                      }}
                    >
                      <div className="flex items-start gap-2 p-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
                          style={{ backgroundColor: gameState.branches.find(b => b.id === pos.branchId)?.color }}
                        >
                          {pos.nodeIndex + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm ${isCurrent ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                            {doc?.title || '알 수 없음'}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{pos.docId}</div>
                        </div>
                      </div>
                      {badgeLabel && (
                        <div className="px-3 pb-3 text-[11px] text-indigo-700 font-semibold">{badgeLabel}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {gameState.path.length === 0 ? (
                  <p className="text-sm text-gray-500">아직 방문한 문서가 없습니다.</p>
                ) : (
                  gameState.path.map((docId, idx) => {
                    const doc = mockWikiDocuments[docId];
                    const isStart = docId === gameState.startDocId;
                    const isGoal = docId === gameState.goalDocId;
                    const isCurrent = idx === gameState.path.length - 1;
                    return (
                      <div
                        key={`${docId}-${idx}`}
                        className={`rounded-lg border p-3 ${isCurrent ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 bg-white'}`}
                      >
                        <div className="text-sm font-semibold text-gray-800">{doc?.title || '알 수 없음'}</div>
                        <div className="text-xs text-gray-500">{docId}</div>
                        <div className="mt-1 text-[11px] text-indigo-700 font-semibold">
                          {isStart ? '시작' : isGoal ? '목표' : isCurrent ? '현재' : '경로'}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* 하단 닫기 버튼 */}
        <div className="p-4 border-t bg-gray-50 sticky bottom-0">
          <button
            onClick={onToggle}
            className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
