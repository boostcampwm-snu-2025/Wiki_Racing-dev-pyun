import { useState, useEffect } from 'react';
import type { GameState, WikiDocument } from '../types/wikirace';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { mockWikiDocuments } from '../data/mockWikiData';

interface GameHeaderProps {
  gameState: GameState & { allowBacktracking?: boolean };
  startDoc: WikiDocument;
  currentDoc: WikiDocument;
  goalDoc: WikiDocument;
  onBack: () => void;
  onJumpToNode: (nodeId: string) => void;
  isLoading?: boolean;
}

export function GameHeader({ gameState, startDoc, currentDoc, goalDoc, onBack, onJumpToNode, isLoading = false }: GameHeaderProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - gameState.startTime!) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const allowBacktracking = gameState.allowBacktracking ?? true;
  const canGoBack = gameState.path.length > 1 && allowBacktracking;

  // 로딩 상태 렌더링
  if (isLoading) {
    return (
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  // Breadcrumb 형태로 경로 표시 - 최근 3개 노드 표시
  const renderBreadcrumb = () => {
    const items = [];

    // 전체 경로: [시작, ...중간노드들..., 현재]
    // 현재 노드를 제외한 모든 노드
    const pathWithoutCurrent = gameState.path.slice(0, -1);
    // 최근 3개 (현재 직전 3개)
    const recentNodes = pathWithoutCurrent.slice(-3);
    // 오래된 노드들 (최근 3개를 제외한 나머지)
    const olderNodes = pathWithoutCurrent.slice(0, -3);

    // 1. Start (시작 문서)
    items.push(
      <span key="start" className="text-gray-700 font-medium px-2 py-1 bg-gray-100 rounded">
        {startDoc.title}
      </span>
    );

    items.push(
      <span key="arrow-1" className="text-gray-400 mx-2">→</span>
    );

    // 2. 오래된 노드들이 있으면 ... 표시
    if (olderNodes.length > 0) {
      items.push(
        <span key="dots-old" className="text-gray-400">...</span>
      );
      items.push(
        <span key="arrow-dots" className="text-gray-400 mx-2">→</span>
      );
    }

    // 3. before 버튼 (오래된 노드들이 있을 때만 표시)
    if (olderNodes.length > 0) {
      items.push(
        <button
          key="before-popup"
          onClick={() => setShowHistoryPopup(true)}
          className="text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer text-gray-700 transition-colors"
        >
          before
        </button>
      );
      items.push(
        <span key="arrow-before" className="text-gray-400 mx-2">→</span>
      );
      items.push(
        <span key="dots-recent" className="text-gray-400">...</span>
      );
      items.push(
        <span key="arrow-dots-2" className="text-gray-400 mx-2">→</span>
      );
    }

    // 4. 최근 3개 노드 표시
    recentNodes.forEach((docId, index) => {
      const doc = mockWikiDocuments[docId];
      const isStart = docId === gameState.startDocId;

      // 시작 노드는 이미 표시했으므로 건너뜀
      if (isStart && olderNodes.length === 0) return;

      items.push(
        <span key={`recent-${index}`} className="text-gray-600 text-sm px-2 py-1">
          {doc?.title || 'unknown'}
        </span>
      );
      items.push(
        <span key={`arrow-recent-${index}`} className="text-gray-400 mx-2">→</span>
      );
    });

    // 5. NOW (현재 문서)
    items.push(
      <span key="now" className="text-red-600 font-bold px-2 py-1 bg-red-50 rounded">
        {currentDoc.title}
      </span>
    );

    items.push(
      <span key="arrow-goal" className="text-gray-400 mx-2">→</span>
    );

    items.push(
      <span key="dots-goal" className="text-gray-400">...</span>
    );

    items.push(
      <span key="arrow-goal-2" className="text-gray-400 mx-2">→</span>
    );

    // 6. Goal
    items.push(
      <span key="goal" className="text-green-600 font-bold px-2 py-1 bg-green-50 rounded">
        {goalDoc.title}
      </span>
    );

    return items;
  };

  return (
    <div className="bg-white border-b border-gray-200 relative">
      {/* Breadcrumb 경로 */}
      <div className="px-6 py-3 flex items-center overflow-x-auto">
        {renderBreadcrumb()}
      </div>

      {/* 게임 정보 */}
      <div className="px-6 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>시간: {formatTime(elapsedTime)}</span>
          <span>이동: {gameState.moves}회</span>
        </div>
      </div>

      {/* 히스토리 팝업 */}
      {showHistoryPopup && (
        <>
          {/* 오버레이 - 흐릿한 배경 */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 transition-opacity"
            onClick={() => setShowHistoryPopup(false)}
          />

          {/* 팝업 */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 p-4 max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">방문 기록</h3>
              <button
                onClick={() => setShowHistoryPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {gameState.path.map((docId, index) => {
                const doc = mockWikiDocuments[docId];
                const isStart = docId === gameState.startDocId;
                const isGoal = docId === gameState.goalDocId;
                const isCurrent = index === gameState.path.length - 1;

                return (
                  <div key={`history-${index}`} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (!allowBacktracking) return;
                        onJumpToNode(docId);
                        setShowHistoryPopup(false);
                      }}
                      disabled={!allowBacktracking || isCurrent}
                      className={`text-sm px-2 py-1 rounded transition-colors ${
                        isStart
                          ? 'bg-gray-100 text-gray-700 font-medium'
                          : isCurrent
                          ? 'bg-red-50 text-red-600 font-bold'
                          : isGoal
                          ? 'bg-green-50 text-green-600 font-bold'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      } ${
                        !allowBacktracking || isCurrent
                          ? 'cursor-not-allowed opacity-70'
                          : 'cursor-pointer'
                      }`}
                    >
                      {doc?.title || 'unknown'}
                    </button>
                    {index < gameState.path.length - 1 && (
                      <span className="text-gray-400 mx-1">→</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
