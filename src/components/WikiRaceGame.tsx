import { useState } from 'react';
import type { GameState, VisualNode } from '../types/wikirace';
import { mockWikiDocuments, getRandomScenario } from '../data/mockWikiData';
import { WikiNodeTree } from './WikiNodeTree';
import { GameHeader } from './GameHeader';
import { PathHistory } from './PathHistory';
import { GameComplete } from './GameComplete';
import { Leaderboard } from './Leaderboard';
import { Button } from './ui/button';
import { Play, Trophy } from 'lucide-react';

export function WikiRaceGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [visualNodes, setVisualNodes] = useState<VisualNode[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const startNewGame = () => {
    const scenario = getRandomScenario();
    const newGameState: GameState = {
      startDocId: scenario.start,
      goalDocId: scenario.goal,
      currentDocId: scenario.start,
      path: [scenario.start],
      moves: 0,
      startTime: Date.now(),
      isComplete: false
    };
    setGameState(newGameState);
    setShowLeaderboard(false);
    updateVisualNodes(newGameState);
  };

  const updateVisualNodes = (state: GameState) => {
    const currentDoc = mockWikiDocuments[state.currentDocId];
    if (!currentDoc) return;

    const nodes: VisualNode[] = [];
    
    // Add current node (center)
    nodes.push({
      id: currentDoc.id,
      title: currentDoc.title,
      x: 0,
      y: 0,
      depth: 0,
      isInPath: true,
      isStart: currentDoc.id === state.startDocId,
      isGoal: currentDoc.id === state.goalDocId,
      isCurrent: true
    });

    // Add linked documents (children)
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
          isInPath: state.path.includes(linkedDoc.id),
          isStart: linkedDoc.id === state.startDocId,
          isGoal: linkedDoc.id === state.goalDocId,
          isCurrent: false
        });
      }
    });

    setVisualNodes(nodes);
  };

  const handleNodeClick = (nodeId: string) => {
    if (!gameState || gameState.isComplete) return;
    
    const currentDoc = mockWikiDocuments[gameState.currentDocId];
    if (!currentDoc.links.includes(nodeId)) return; // Can only click linked documents

    const newPath = [...gameState.path, nodeId];
    const newGameState: GameState = {
      ...gameState,
      currentDocId: nodeId,
      path: newPath,
      moves: gameState.moves + 1
    };

    // Check if goal reached
    if (nodeId === gameState.goalDocId) {
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - gameState.startTime) / 1000);
      const score = Math.max(1000 - (newGameState.moves * 50) - timeTaken, 100);
      
      newGameState.endTime = endTime;
      newGameState.isComplete = true;
      newGameState.score = score;
    }

    setGameState(newGameState);
    updateVisualNodes(newGameState);
  };

  const handleBack = () => {
    if (!gameState || gameState.path.length <= 1) return;

    const newPath = gameState.path.slice(0, -1);
    const newCurrentId = newPath[newPath.length - 1];
    
    const newGameState: GameState = {
      ...gameState,
      currentDocId: newCurrentId,
      path: newPath,
      moves: gameState.moves + 1
    };

    setGameState(newGameState);
    updateVisualNodes(newGameState);
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

  if (!gameState) {
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
            <Button onClick={startNewGame} size="lg" className="gap-2">
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

  if (gameState.isComplete) {
    return <GameComplete gameState={gameState} onRestart={startNewGame} />;
  }

  const currentDoc = mockWikiDocuments[gameState.currentDocId];
  const goalDoc = mockWikiDocuments[gameState.goalDocId];

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <GameHeader 
        gameState={gameState}
        currentDoc={currentDoc}
        goalDoc={goalDoc}
        onBack={handleBack}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main visualization area */}
        <div className="flex-1 relative">
          <WikiNodeTree 
            nodes={visualNodes}
            onNodeClick={handleNodeClick}
          />
        </div>

        {/* Path history sidebar */}
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
