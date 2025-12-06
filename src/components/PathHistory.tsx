import type { GameState } from '../types/wikirace';
import { mockWikiDocuments } from '../data/mockWikiData';
import { ScrollArea } from './ui/scroll-area';

interface PathHistoryProps {
  gameState: GameState;
  onNodeClick?: (nodeId: string) => void;
  onToggle?: () => void;
}

export function PathHistory({ gameState, onNodeClick, onToggle }: PathHistoryProps) {
  return (
    <div className="w-80 bg-white border-l flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gray-900">방문 기록</h3>
        <div className="text-xs text-gray-500 mt-1">
          총 {gameState.path.length}개 문서 방문
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
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
              <div key={`${docId}-${index}`} className="relative flex items-start gap-3">
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
