import type { GameState } from '../types/wikirace';
import { mockWikiDocuments } from '../data/mockWikiData';
import { ChevronRight, Flag, Target } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface PathHistoryProps {
  gameState: GameState;
  onNodeClick?: (nodeId: string) => void;
}

export function PathHistory({ gameState, onNodeClick }: PathHistoryProps) {
  return (
    <div className="w-80 bg-white border-l flex flex-col shadow-lg">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-gray-900 mb-2">경로 히스토리</h3>
        <div className="text-gray-600">
          이동 횟수: {gameState.moves}회
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {gameState.path.map((docId, index) => {
            const doc = mockWikiDocuments[docId];
            const isStart = docId === gameState.startDocId;
            const isGoal = docId === gameState.goalDocId;
            const isCurrent = index === gameState.path.length - 1;

            return (
              <div key={`${docId}-${index}`} className="space-y-2">
                <div
                  className={`
                    p-3 rounded-lg transition-all duration-200
                    ${isCurrent 
                      ? 'bg-blue-100 border-2 border-blue-500 shadow-md' 
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }
                    ${onNodeClick ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => onNodeClick && onNodeClick(docId)}
                >
                  <div className="flex items-start gap-2">
                    <div className={`
                      flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white
                      ${isCurrent ? 'bg-blue-500' : 'bg-gray-400'}
                    `}>
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {isStart && (
                          <Flag className="w-3 h-3 text-purple-500 flex-shrink-0" />
                        )}
                        {isGoal && (
                          <Target className="w-3 h-3 text-green-500 flex-shrink-0" />
                        )}
                        <div className={`
                          truncate
                          ${isCurrent ? 'text-blue-900' : 'text-gray-700'}
                        `}>
                          {doc?.title || '알 수 없는 문서'}
                        </div>
                      </div>
                      
                      {isCurrent && (
                        <div className="text-blue-600 text-xs">
                          현재 위치
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {index < gameState.path.length - 1 && (
                  <div className="flex justify-center">
                    <ChevronRight className="w-4 h-4 text-gray-400 transform rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-gray-50">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-purple-500" />
            <span className="text-gray-600">시작 문서</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">목표 문서</span>
          </div>
        </div>
      </div>
    </div>
  );
}
