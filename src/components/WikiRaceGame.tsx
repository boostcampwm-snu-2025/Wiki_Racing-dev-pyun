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
  const { startNewGame, navigateTo, goBack, status } = gameState;
  
  const [visualNodes, setVisualNodes] = useState<VisualNode[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    if (status === 'playing' || status === 'finished') {
      updateVisualNodes();
    }
  }, [gameState.currentDocId, status]);

  const handleStartGame = () => {
    setShowLeaderboard(false);
    startNewGame();
  };

  const updateVisualNodes = () => {
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
        <Leaderboard />
      </div>
    );
  }

  if (status === 'idle') {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-2xl mx-auto p-8 text-center space-y-6">
          <h1 className="text-gray-900">위키레이싱</h1>
          <p className="text-gray-600">
            시작 문서에서 목표 문서까지 링크만을 이용하여 도달하세요!
          </p>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
            <h2 className="text-gray-800">게임 규칙</h2>
            <ul className="text-gray-600 space-y-2 text-left">
              <li>✓ 문서 내의 링크만 클릭 가능</li>
              <li>✓ 뒤로가기는 이동 횟수에 포함됨</li>
              <li>✓ 적은 이동으로 빠르게 도달할수록 높은 점수</li>
              <li>✓ 최적 경로를 찾아보세요!</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={handleStartGame} size="lg" className="gap-2">
              <Play className="w-5 h-5" />
              게임 시작
            </Button>
            <Button 
              onClick={() => setShowLeaderboard(true)} 
              size="lg" 
              variant="outline"
              className="gap-2"
            >
              <Trophy className="w-5 h-5" />
              리더보드
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'finished') {
    return <GameComplete gameState={gameState} onRestart={handleStartGame} />;
  }

  const currentDoc = mockWikiDocuments[gameState.currentDocId!];
  const goalDoc = mockWikiDocuments[gameState.goalDocId!];

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <GameHeader 
        gameState={gameState}
        currentDoc={currentDoc}
        goalDoc={goalDoc}
        onBack={goBack}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <WikiNodeTree 
            nodes={visualNodes}
            onNodeClick={navigateTo}
          />
        </div>

        <PathHistory
          gameState={gameState}
          onNodeClick={() => {
            // Optional: Allow clicking on history to see that state
          }}
        />
      </div>
    </div>
  );
}
