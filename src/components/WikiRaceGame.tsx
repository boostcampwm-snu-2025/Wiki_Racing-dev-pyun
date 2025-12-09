import { useState, useEffect } from 'react';
import type { VisualNode } from '../types/wikirace';
import { mockWikiDocuments } from '../data/mockWikiData';
import { useGameStore } from '../gameStore';
import { WikiNodeTree } from './WikiNodeTree';
import { GameHeader } from './GameHeader';
import { PathHistory } from './PathHistory';
import { GameComplete } from './GameComplete';
import { Leaderboard } from './Leaderboard';
import { Button } from './ui/button';
import { Play, Trophy } from 'lucide-react';

export function WikiRaceGame() {
  const gameState = useGameStore();
  const {
    startNewGame,
    navigateTo,
    goBack,
    jumpToNode,
    branchFromHistory,
    status,
    allowBacktracking,
    gameMode,
    setAllowBacktracking,
    setGameMode,
    returnToMenu
  } = gameState;

  const [visualNodes, setVisualNodes] = useState<VisualNode[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showPathHistory, setShowPathHistory] = useState(false);
  const [isLoadingNodes, setIsLoadingNodes] = useState(false);

  const leaderboardEntry = gameState.path.length
    ? {
        path: gameState.path,
        startDocId: gameState.startDocId,
        goalDocId: gameState.goalDocId,
        score: gameState.score,
        moves: gameState.moves,
        time:
          gameState.status === 'finished' && gameState.endTime && gameState.startTime
            ? Math.floor((gameState.endTime - gameState.startTime) / 1000)
            : gameState.startTime
              ? Math.floor((Date.now() - gameState.startTime) / 1000)
              : 0,
        nickname: '내 플레이'
      }
    : undefined;

  useEffect(() => {
    if (status === 'playing' || status === 'finished') {
      const { currentDocId, startDocId, goalDocId, path } = gameState;
      if (!currentDocId) return;

      const currentDoc = mockWikiDocuments[currentDocId];
      if (!currentDoc) return;

      const nodes: VisualNode[] = [];

      nodes.push({
        id: currentDoc.id,
        title: currentDoc.title,
        x: 0,
        y: 0,
        depth: 0,
        isInPath: true,
        isStart: currentDoc.id === startDocId,
        isGoal: currentDoc.id === goalDocId,
        isCurrent: true
      });

      const angleStep = (Math.PI * 2) / currentDoc.links.length;
      currentDoc.links.forEach((linkId, index) => {
        const linkedDoc = mockWikiDocuments[linkId];
        if (linkedDoc) {
          const angle = angleStep * index - Math.PI / 2;
          const distance = 250;

          nodes.push({
            id: linkedDoc.id,
            title: linkedDoc.title,
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            depth: 1,
            isInPath: path.includes(linkedDoc.id),
            isStart: linkedDoc.id === startDocId,
            isGoal: linkedDoc.id === goalDocId,
            isCurrent: false
          });
        }
      });

      setVisualNodes(nodes);
    }
  }, [gameState, status]);

  const handleStartGame = () => {
    setShowLeaderboard(false);
    startNewGame();
  };

  const handleReturnHome = () => {
    setShowLeaderboard(false);
    returnToMenu();
  };

  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
  };

  const handleNodeClick = async (nodeId: string) => {
    setIsLoadingNodes(true);
    // 로딩 UI를 보여주기 위한 짧은 지연
    await new Promise(resolve => setTimeout(resolve, 300));
    navigateTo(nodeId);
    setIsLoadingNodes(false);
  };

  if (showLeaderboard) {
    return (
      <div className="w-full h-screen flex flex-col bg-gray-50">
        <div className="bg-white border-b p-4 flex items-center justify-between shadow-sm">
          <h1 className="text-gray-900">위키레이싱 - 리더보드</h1>
          <Button onClick={() => setShowLeaderboard(false)} variant="outline">
            게임으로 돌아가기
          </Button>
        </div>
        <Leaderboard currentRun={leaderboardEntry} />
      </div>
    );
  }

  if (status === 'idle') {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        {/* Leaderboard 버튼 - 우측 상단 */}
        <div className="absolute top-4 right-4">
          <Button
            onClick={() => setShowLeaderboard(true)}
            variant="outline"
            className="bg-gray-800 text-white hover:bg-gray-700 border-gray-800"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboard
          </Button>
        </div>

        {/* 중앙 컨텐츠 - Figma 디자인 */}
        <div className="max-w-md mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold text-gray-900">WIKIRACING</h1>

          {/* Play 버튼 - 빨간색 */}
          <Button
            onClick={handleStartGame}
            size="lg"
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-xl rounded-lg"
          >
            Play
          </Button>

          {/* 하단 옵션들 */}
          <div className="space-y-4 mt-12">
            {/* 역링크 허용 토글 */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-gray-600">역링크 허용</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={allowBacktracking}
                  onChange={(e) => setAllowBacktracking(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
              </label>
              <span className="text-xs text-gray-500">
                {allowBacktracking ? '뒤로가기가 허용됩니다.' : '뒤로가기를 허용하지 않습니다.'}
              </span>
            </div>

            {/* 난이도 선택 */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setGameMode('easy')}
                className={`px-4 py-2 text-sm rounded transition-all ${
                  gameMode === 'easy'
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                연습모드
              </button>
              <button
                onClick={() => setGameMode('challenge')}
                className={`px-4 py-2 text-sm rounded transition-all ${
                  gameMode === 'challenge'
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                도전모드
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'finished') {
    return (
      <GameComplete
        gameState={gameState}
        onRestart={handleStartGame}
        onReturnHome={handleReturnHome}
        onShowLeaderboard={handleShowLeaderboard}
      />
    );
  }

  const startDoc = mockWikiDocuments[gameState.startDocId!];
  const currentDoc = mockWikiDocuments[gameState.currentDocId!];
  const goalDoc = mockWikiDocuments[gameState.goalDocId!];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-4">
        <div className="bg-white/95 border border-gray-200 shadow-xl rounded-2xl overflow-hidden backdrop-blur">
          <GameHeader
            gameState={gameState}
            startDoc={startDoc}
            currentDoc={currentDoc}
            goalDoc={goalDoc}
            onBack={goBack}
            onJumpToNode={jumpToNode}
            onBranchFromHistory={branchFromHistory}
          />

          <div className="flex flex-col xl:flex-row min-h-[620px] overflow-hidden">
            <div className="flex-1 relative p-6 bg-gradient-to-br from-white via-slate-50 to-indigo-50 min-h-[480px]">
              <div className="absolute inset-6 rounded-2xl border border-dashed border-indigo-100 pointer-events-none" aria-hidden />
              <WikiNodeTree
                nodes={visualNodes}
                onNodeClick={handleNodeClick}
                isLoading={isLoadingNodes}
              />
            </div>

            {showPathHistory && (
              <div className="w-full xl:w-[420px] shrink-0 border-t xl:border-t-0 xl:border-l bg-white">
                <PathHistory
                  gameState={gameState}
                  onNodeClick={branchFromHistory}
                  onToggle={() => setShowPathHistory(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {!showPathHistory && (
        <div className="fixed bottom-6 right-6 z-30 drop-shadow-lg">
          <button
            onClick={() => setShowPathHistory(true)}
            className="px-5 py-3 text-sm font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-full shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
            aria-label="방문 기록 목록 보기"
          >
            목록보기
          </button>
        </div>
      )}
    </div>
  );
}
