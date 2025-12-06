import { useMemo } from 'react';
import type { GameState } from '../types/wikirace';
import { mockWikiDocuments } from '../data/mockWikiData';
import { ScrollArea } from './ui/scroll-area';

const COLUMN_WIDTH = 64;
const ROW_HEIGHT = 72;

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
  const history = gameState.historyLog?.length ? gameState.historyLog : gameState.path;

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
          // 이미 방문한 노드로 되돌아왔을 때는 해당 지점 이후를 잘라내고 새 브랜치를 준비
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

  const graphWidth = (maxDepth + 1) * COLUMN_WIDTH + 24;
  const graphHeight = entries.length * ROW_HEIGHT;

  return (
    <div className="w-96 bg-white border-l flex flex-col max-h-screen h-full overflow-hidden">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <h3 className="text-sm font-semibold text-gray-900">방문 기록</h3>
        <div className="text-xs text-gray-500 mt-1">
          총 {history.length}개 문서 방문 · {gameState.allowBacktracking ? '역링크 허용' : '역링크 비허용'}
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4">
          <div className="relative" style={{ height: `${graphHeight}px` }}>
            {/* 브랜치 커넥터 (SVG) */}
            <svg
              className="absolute left-0 top-0 pointer-events-none"
              width={graphWidth}
              height={graphHeight}
            >
              {/* 가이드 라인: 동일 depth는 수평으로 맞춰서 보이도록 */}
              {Array.from({ length: maxDepth + 1 }).map((_, depth) => (
                <line
                  key={`guide-${depth}`}
                  x1={depth * COLUMN_WIDTH + 12}
                  x2={depth * COLUMN_WIDTH + 12}
                  y1={0}
                  y2={graphHeight}
                  stroke="#e5e7eb"
                  strokeDasharray="4 6"
                />
              ))}

              {entries.map((entry, idx) => {
                if (idx === 0) return null;

                const prev = entries[idx - 1];
                const prevX = prev.depth * COLUMN_WIDTH + 12;
                const prevY = (idx - 1) * ROW_HEIGHT + ROW_HEIGHT / 2;
                const currX = entry.depth * COLUMN_WIDTH + 12;
                const currY = idx * ROW_HEIGHT + ROW_HEIGHT / 2;

                const midY = prevY + ROW_HEIGHT / 2;

                const isBranchChange = prev.depth !== entry.depth;

                const pathD = `M ${prevX} ${prevY} ${
                  isBranchChange
                    ? `L ${prevX} ${midY} L ${currX} ${midY} L ${currX} ${currY}`
                    : `L ${currX} ${currY}`
                }`;

                return (
                  <path
                    key={`connector-${entry.docId}-${idx}`}
                    d={pathD}
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                );
              })}

              {entries.map((entry) => {
                const x = entry.depth * COLUMN_WIDTH + 12;
                const y = entry.index * ROW_HEIGHT + ROW_HEIGHT / 2;
                const isStart = entry.docId === gameState.startDocId;
                const isGoal = entry.docId === gameState.goalDocId;
                const isCurrent = entry.docId === gameState.currentDocId && entry.isLast;

                let fill = '#f9a8d4';
                if (isCurrent) fill = '#facc15';
                if (isGoal) fill = '#34d399';
                if (isStart) fill = '#9ca3af';

                return (
                  <g key={`node-${entry.docId}-${entry.index}`}>
                    <circle cx={x} cy={y} r={8} fill={fill} stroke="#fff" strokeWidth={2} />
                    {isCurrent && (
                      <circle cx={x} cy={y} r={13} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* 텍스트 카드 */}
            <div className="flex flex-col" style={{ paddingLeft: graphWidth + 12 }}>
              {entries.map((entry) => {
                const doc = mockWikiDocuments[entry.docId];
                const isStart = entry.docId === gameState.startDocId;
                const isGoal = entry.docId === gameState.goalDocId;
                const isCurrent = entry.docId === gameState.currentDocId && entry.isLast;

                const label = isStart ? '시작' : isGoal ? '목표' : `단계 ${entry.index + 1}`;

                const branchInfo = entry.depth !== entry.previousDepth
                  ? entry.depth > entry.previousDepth
                    ? '새 브랜치 진입'
                    : '이전 브랜치로 복귀'
                  : null;

                return (
                  <div
                    key={`${entry.docId}-${entry.index}-card`}
                    style={{ height: ROW_HEIGHT }}
                    className={`flex flex-col justify-center border border-gray-200 rounded-lg px-3 mb-3 bg-white shadow-sm ${
                      onNodeClick && gameState.allowBacktracking ? 'cursor-pointer hover:border-gray-300 hover:shadow' : ''
                    } ${isCurrent ? 'ring-2 ring-yellow-300' : ''}`}
                    onClick={() => {
                      if (!gameState.allowBacktracking) return;
                      onNodeClick?.(entry.docId);
                    }}
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <span className="font-semibold">{doc?.title || '알 수 없음'}</span>
                      {isCurrent && <span className="text-xs text-red-500">NOW</span>}
                      {isGoal && <span className="text-[11px] text-green-600 px-2 py-0.5 bg-green-50 rounded-full">GOAL</span>}
                      {isStart && <span className="text-[11px] text-gray-600 px-2 py-0.5 bg-gray-100 rounded-full">START</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                      <span>{label}</span>
                      {branchInfo && <span className="text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{branchInfo}</span>}
                      {!gameState.allowBacktracking && <span className="text-[11px] text-amber-600">역링크 비활성화</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-gray-50 sticky bottom-0 mt-auto">
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
