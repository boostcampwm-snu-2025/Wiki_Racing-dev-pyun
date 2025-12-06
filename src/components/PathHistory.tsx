import { useMemo } from 'react';
import type { GameState, NavigationStep } from '../types/wikirace';
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
  viaBacktrack: boolean;
}

export function PathHistory({ gameState, onNodeClick, onToggle }: PathHistoryProps) {
  const historySteps: NavigationStep[] = useMemo(() => {
    if (gameState.historyLog?.length) return gameState.historyLog;
    return (gameState.path || []).map((docId) => ({ docId, viaBacktrack: false }));
  }, [gameState.historyLog, gameState.path]);

  const { entries, maxDepth } = useMemo(() => {
    if (historySteps.length === 0) {
      return { entries: [] as HistoryEntry[], maxDepth: 0 };
    }

    const depthByDoc = new Map<string, number>();
    let currentDepth = 0;
    let previousDepth = 0;
    let maxDepthLocal = 0;
    let branchBaseDepth = 0;
    let pendingBranch = false;

    const mapped: HistoryEntry[] = historySteps.map(({ docId, viaBacktrack }, index) => {
      const seenDepth = depthByDoc.get(docId);

      if (index === 0) {
        currentDepth = 0;
        branchBaseDepth = 0;
        pendingBranch = false;
      } else if (viaBacktrack) {
        // 과거 노드로 돌아온 경우: 기존 깊이에 정렬하고 이후 이동에서만 새 브랜치 생성
        currentDepth = seenDepth ?? currentDepth;
        branchBaseDepth = currentDepth;
        pendingBranch = true;
      } else if (pendingBranch) {
        currentDepth = branchBaseDepth + 1;
        pendingBranch = false;
      } else if (seenDepth !== undefined) {
        currentDepth = seenDepth;
      }

      const entry: HistoryEntry = {
        docId,
        depth: currentDepth,
        previousDepth,
        index,
        isLast: index === historySteps.length - 1,
        viaBacktrack,
      };

      depthByDoc.set(docId, currentDepth);
      previousDepth = currentDepth;
      maxDepthLocal = Math.max(maxDepthLocal, currentDepth);

      return entry;
    });

    return { entries: mapped, maxDepth: maxDepthLocal };
  }, [historySteps]);

  const graphWidth = (maxDepth + 1) * COLUMN_WIDTH + 24;
  const graphHeight = entries.length * ROW_HEIGHT;
  const contentWidth = graphWidth + 320;
  const branchColors = ['#fbbf24', '#22d3ee', '#c084fc', '#f472b6', '#34d399', '#60a5fa'];

  return (
    <div className="w-full sm:max-w-md xl:w-96 bg-white border-l flex flex-col max-h-screen h-full overflow-hidden">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <h3 className="text-sm font-semibold text-gray-900">방문 기록</h3>
        <div className="text-xs text-gray-500 mt-1">
          총 {historySteps.length}개 문서 방문 · {gameState.allowBacktracking ? '역링크 허용' : '역링크 비허용'}
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4" style={{ minWidth: `${contentWidth}px` }}>
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
                const branchColor = branchColors[prev.depth % branchColors.length];

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
                    stroke={branchColor}
                    strokeWidth={3}
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                  />
                );
              })}

              {entries.map((entry) => {
                const x = entry.depth * COLUMN_WIDTH + 12;
                const y = entry.index * ROW_HEIGHT + ROW_HEIGHT / 2;
                const isStart = entry.docId === gameState.startDocId;
                const isGoal = entry.docId === gameState.goalDocId;
                const isCurrent = entry.docId === gameState.currentDocId && entry.isLast;
                const branchColor = branchColors[entry.depth % branchColors.length];

                return (
                  <g key={`node-${entry.docId}-${entry.index}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r={9}
                      fill={isGoal ? '#10b981' : isStart ? '#1f2937' : branchColor}
                      stroke={isCurrent ? '#f59e0b' : '#0f172a'}
                      strokeWidth={isCurrent ? 3 : 2}
                    />
                    {isCurrent && (
                      <circle cx={x} cy={y} r={14} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" />
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

                const branchInfo = entry.viaBacktrack
                  ? '과거로 이동'
                  : entry.depth !== entry.previousDepth
                    ? '새 브랜치 진입'
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
