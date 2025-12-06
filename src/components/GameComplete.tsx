import type { GameState } from '../types/wikirace';
import { mockWikiDocuments } from '../data/mockWikiData';
import { Button } from './ui/button';
import { Trophy, Clock, Footprints, Star, Play } from 'lucide-react';

interface GameCompleteProps {
  gameState: GameState;
  onRestart: () => void;
  onReturnHome: () => void;
  onShowLeaderboard: () => void;
}

export function GameComplete({ gameState, onRestart, onReturnHome, onShowLeaderboard }: GameCompleteProps) {
  const timeTaken = gameState.endTime
    ? Math.floor((gameState.endTime - gameState.startTime) / 1000)
    : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  const getScoreGrade = (score: number) => {
    if (score >= 900) return { grade: 'S', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    if (score >= 700) return { grade: 'A', color: 'text-green-500', bg: 'bg-green-50' };
    if (score >= 500) return { grade: 'B', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (score >= 300) return { grade: 'C', color: 'text-purple-500', bg: 'bg-purple-50' };
    return { grade: 'D', color: 'text-gray-500', bg: 'bg-gray-50' };
  };

  const scoreGrade = getScoreGrade(gameState.score || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-sky-50 to-blue-50 py-10 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/70">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 text-center">
            <Trophy className="w-16 h-16 text-white mx-auto mb-4 animate-bounce" />
            <h1 className="text-white mb-2">목표 달성!</h1>
            <p className="text-white/90">
              축하합니다! 목표 문서에 도달했습니다.
            </p>
          </div>

          {/* Score */}
          <div className="p-8 text-center border-b border-gray-100 bg-white/60 backdrop-blur-sm">
            <div className="inline-block">
              <div className="text-gray-600 mb-2">최종 점수</div>
              <div className={`text-6xl ${scoreGrade.color} mb-2`}>
                {gameState.score}
              </div>
              <div className={`inline-block px-6 py-2 rounded-full ${scoreGrade.bg} ${scoreGrade.color} text-2xl`}>
                {scoreGrade.grade} 등급
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl shadow-sm">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-gray-600 mb-1">소요 시간</div>
              <div className="text-blue-900">{formatTime(timeTaken)}</div>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl shadow-sm">
              <Footprints className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-gray-600 mb-1">이동 횟수</div>
              <div className="text-purple-900">{gameState.moves}회</div>
            </div>
          </div>

          {/* Path Summary */}
          <div className="p-8 border-t border-gray-100 bg-gray-50">
            <h3 className="text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              경로 요약
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <span>시작:</span>
                <span className="text-gray-900">
                  {mockWikiDocuments[gameState.startDocId]?.title}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>목표:</span>
                <span className="text-gray-900">
                  {mockWikiDocuments[gameState.goalDocId]?.title}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>경유지:</span>
                <span className="text-gray-900">
                  {gameState.path.length - 2}개 문서
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-8 flex flex-col gap-3 bg-white/70 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={onRestart} size="lg" className="flex-1 gap-2 shadow-md">
                <Play className="w-5 h-5" />
                새 게임 시작
              </Button>
              <Button
                onClick={onReturnHome}
                size="lg"
                variant="outline"
                className="flex-1 gap-2 border-slate-200 shadow-sm"
              >
                메인 화면으로
              </Button>
            </div>
            <Button
              onClick={onShowLeaderboard}
              variant="ghost"
              className="w-full gap-2 text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50"
            >
              <Trophy className="w-5 h-5" />
              리더보드 보기
            </Button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>💡 더 적은 이동과 빠른 시간으로 더 높은 점수를 획득하세요!</p>
        </div>
      </div>
    </div>
  );
}
