import { useMemo } from 'react';
import type { GameState } from '../types/wikirace';
import { mockWikiDocuments } from '../data/mockWikiData';
import { ScrollArea } from './ui/scroll-area';

const COLUMN_WIDTH = 18;

interface PathHistoryProps {
  gameState: GameState;
  onNodeClick?: (nodeId: string) => void;
  onToggle?: () => void;
}

interface HistoryEntry {
  docId: string;
  depth: number;
  previousDepth: number;
  index: number;
  isLast: boolean;
}

export function PathHistory({ gameState, onNodeClick, onToggle }: PathHistoryProps) {
  const history = gameState.historyLog ?? gameState.path;

  const { entries, maxDepth } = useMemo(() => {
    if (history.length === 0) {
      return { entries: [] as HistoryEntry[], maxDepth: 0 };
    }

    const stack: string[] = [history[0]];
    let previousDepth = 0;
    let maxDepthLocal = 0;

    const mapped: HistoryEntry[] = history.map((docId, index) => {
      if (index > 0) {
        const existingIndex = stack.lastIndexOf(docId);
        if (existingIndex !== -1) {
          // 이전에 방문했던 노드로 돌아온 경우, 해당 지점 이후 스택을 잘라냄
          stack.splice(existingIndex + 1);
        } else {
          stack.push(docId);
        }
      }

      const depth = stack.length - 1;
      maxDepthLocal = Math.max(maxDepthLocal, depth);

      const entry: HistoryEntry = {
        docId,
        depth,
        previousDepth,
        index,
        isLast: index === history.length - 1,
      };

      previousDepth = depth;
      return entry;
    });

    return { entries: mapped, maxDepth: maxDepthLocal };
  }, [history]);

  return (
    <div className="w-80 bg-white border-l flex flex-col max-h-screen h-full overflow-hidden">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <h3 className="text-sm font-semibold text-gray-900">방문 기록</h3>
        <div className="text-xs text-gray-500 mt-1">총 {history.length}개 문서 방문</div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {entries.map((entry) => {
            const doc = mockWikiDocuments[entry.docId];
            const isStart = entry.docId === gameState.startDocId;
            const isGoal = entry.docId === gameState.goalDocId;
            const isCurrent = entry.index === history.length - 1 && entry.docId === gameState.currentDocId;

            let dotColor = 'bg-pink-400';
            if (isCurrent) dotColor = 'bg-yellow-400';
            if (isGoal) dotColor = 'bg-green-500';

            const dotLeft = entry.depth * COLUMN_WIDTH;
            const prevLeft = entry.previousDepth * COLUMN_WIDTH;
            const horizontalWidth = Math.abs(dotLeft - prevLeft);
            const horizontalStart = Math.min(dotLeft, prevLeft) + 8;
            const graphWidth = (maxDepth + 1) * COLUMN_WIDTH + 12;

            return (
              <div key={`${entry.docId}-${entry.index}`} className="relative flex items-start gap-3">
                <div className="relative" style={{ width: graphWidth }}>
                  {!entry.isLast && (
                    <div
                      className="absolute top-6 bottom-0 w-px bg-gray-300"
                      style={{ left: dotLeft + 8 }}
                    />
                  )}

                  {entry.index > 0 && entry.depth !== entry.previousDepth && (
                    <div
                      className="absolute top-3 h-px bg-gray-300"
                      style={{ left: horizontalStart, width: horizontalWidth + 8 }}
                    />
                  )}

                  <div
                    className={`relative z-10 w-4 h-4 rounded-full ${dotColor} flex-shrink-0 mt-1 border-2 border-white shadow-sm`}
                    style={{ transform: `translateX(${dotLeft}px)` }}
                  />
                </div>

                <div
                  className={`flex-1 pb-4 ${onNodeClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onNodeClick?.(entry.docId)}
                >
                  <div className={`text-sm ${isCurrent ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                    {doc?.title || '알 수 없음'}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {isStart && '시작 문서'}
                    {isGoal && '목표 문서'}
                    {isCurrent && !isGoal && '현재 위치'}
                    {!isStart && !isGoal && !isCurrent && `단계 ${entry.index + 1}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-gray-50">
        <button
          onClick={onToggle}
          className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
