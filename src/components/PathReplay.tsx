import type { LeaderboardEntry } from '../types/wikirace';
import { mockWikiDocuments } from '../data/mockWikiData';
import { Flag, Target, ChevronRight } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface PathReplayProps {
  entry: LeaderboardEntry;
}

export function PathReplay({ entry }: PathReplayProps) {
  return (
    <ScrollArea className="h-[600px]">
      <div className="p-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-gray-600 mb-1">이동 횟수</div>
            <div className="text-blue-900">{entry.moves}회</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-gray-600 mb-1">소요 시간</div>
            <div className="text-purple-900">
              {Math.floor(entry.time / 60)}:{(entry.time % 60).toString().padStart(2, '0')}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-gray-600 mb-1">난이도</div>
            <div className="text-green-900">{entry.difficulty}</div>
          </div>
        </div>

        {/* Path Visualization as Mindmap */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-8 mb-6">
          <h3 className="text-gray-800 mb-6 text-center">경로 마인드맵</h3>
          
          <div className="space-y-4">
            {entry.path.map((docId, index) => {
              const doc = mockWikiDocuments[docId];
              const isStart = index === 0;
              const isGoal = index === entry.path.length - 1;

              return (
                <div key={`${docId}-${index}`} className="flex items-center">
                  {/* Step indicator */}
                  <div className="flex-shrink-0 w-24 text-right pr-4">
                    <span className="text-gray-500">Step {index + 1}</span>
                  </div>

                  {/* Node */}
                  <div className="flex-1">
                    <div
                      className={`
                        p-4 rounded-lg shadow-md transition-all
                        ${isStart 
                          ? 'bg-purple-500 text-white' 
                          : isGoal 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white text-gray-900'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {isStart && <Flag className="w-5 h-5" />}
                        {isGoal && <Target className="w-5 h-5" />}
                        <div>
                          <div className={`${isStart || isGoal ? 'text-white' : 'text-gray-900'}`}>
                            {doc?.title || '알 수 없는 문서'}
                          </div>
                          {doc?.content && (
                            <div className={`text-sm mt-1 ${isStart || isGoal ? 'text-white/80' : 'text-gray-600'}`}>
                              {doc.content}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  {index < entry.path.length - 1 && (
                    <div className="flex-shrink-0 ml-4">
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Alternative: Tree Visualization */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-gray-800 mb-4">경로 상세 분석</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Flag className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-gray-700">시작 문서</div>
                <div className="text-gray-900">{entry.startDoc}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-gray-700">목표 문서</div>
                <div className="text-gray-900">{entry.goalDoc}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-gray-700">경유한 문서</div>
                <div className="text-gray-900">
                  {entry.path.length - 2}개의 중간 문서를 거쳐 도달
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-gray-700 mb-2">💡 전략 분석</div>
            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• 최소 이동: {entry.moves}회</li>
              <li>• 평균 문서당 시간: {Math.round(entry.time / entry.moves)}초</li>
              <li>• 효율성: {entry.score >= 700 ? '매우 높음' : entry.score >= 500 ? '높음' : '보통'}</li>
            </ul>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
