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

    let pathStack: string[] = [];
    let currentDepth = 0;
    let previousDepth = 0;
    let maxDepthLocal = 0;

    const mapped: HistoryEntry[] = historySteps.map(({ docId, viaBacktrack }, index) => {
      if (index === 0) {
        pathStack = [docId];
        currentDepth = 0;
      } else if (viaBacktrack) {
        // 과거 노드로 돌아온 경우: 해당 지점까지 경로를 잘라내고 동일 깊이에서 재시작
        const targetIndex = pathStack.lastIndexOf(docId);
        if (targetIndex !== -1) {
          pathStack = pathStack.slice(0, targetIndex + 1);
          currentDepth = targetIndex;
        } else {
          // 방어 로직: 경로에 없는 노드라면 새 루트로 간주
          pathStack = [docId];
          currentDepth = 0;
        }
      } else {
        pathStack = [...pathStack, docId];
        currentDepth = pathStack.length - 1;
      }

      const entry: HistoryEntry = {
        docId,
        depth: currentDepth,
        previousDepth,
        index,
        isLast: index === historySteps.length - 1,
        viaBacktrack,
      };

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
    <div className="w-80 bg-white border-l flex flex-col max-h-screen">
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gray-900">방문 기록</h3>
        <div className="text-xs text-gray-500 mt-1">
          총 {historySteps.length}개 문서 방문 · {gameState.allowBacktracking ? '역링크 허용' : '역링크 비허용'}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {/* Git Branch 스타일 시각화 - Figma 디자인 */}
            {gameState.path.map((docId, index) => {
              const doc = mockWikiDocuments[docId];
              const isStart = docId === gameState.startDocId;
              const isGoal = docId === gameState.goalDocId;
              const isCurrent = index === gameState.path.length - 1;
              const isLast = index === gameState.path.length - 1;

              // 색상 결정 (Figma: 분홍/노란/초록)
              let dotColor = 'bg-pink-400';
              if (isCurrent) dotColor = 'bg-yellow-400';
              if (isGoal) dotColor = 'bg-green-500';

              return (
                <div
                  key={`${docId}-${index}`}
                  className={`relative flex items-start gap-3 ${
                    onNodeClick && !isCurrent ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => {
                    if (!onNodeClick || isCurrent) return;
                    onNodeClick(docId);
                  }}
                >
                  {/* Git Branch 연결선 */}
                  {!isLast && (
                    <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gray-300" />
                  )}

                  {/* Git 스타일 점 */}
                  <div className={`relative z-10 w-4 h-4 rounded-full ${dotColor} flex-shrink-0 mt-1`} />

                  {/* 문서 정보 */}
                  <div className="flex-1 pb-4">
                    <div className={`text-sm ${isCurrent ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {doc?.title || '알 수 없음'}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {isStart && '시작 문서'}
                      {isGoal && '목표 문서'}
                      {isCurrent && !isGoal && '현재 위치'}
                      {!isStart && !isGoal && !isCurrent && `단계 ${index + 1}`}
                    </div>
                  </div>
                </div>
              );
            })}
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
