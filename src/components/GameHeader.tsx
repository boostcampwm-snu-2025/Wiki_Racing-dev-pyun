import { useState, useEffect } from 'react';
import type { GameState, WikiDocument } from '../types/wikirace';
import { mockWikiDocuments } from '../data/mockWikiData';
import { Button } from './ui/button';
import { ArrowLeft, Flag, Target, Clock } from 'lucide-react';

interface GameHeaderProps {
  gameState: GameState;
  currentDoc: WikiDocument;
  goalDoc: WikiDocument;
  onBack: () => void;
}

export function GameHeader({ gameState, currentDoc, goalDoc, onBack }: GameHeaderProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canGoBack = gameState.path.length > 1;

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-gray-900">위키레이싱</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
            <div className="text-gray-600">
              이동: {gameState.moves}회
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            disabled={!canGoBack}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>

          <div className="flex-1 flex items-center gap-3 bg-gradient-to-r from-purple-50 to-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded border border-purple-200">
              <Flag className="w-4 h-4 text-purple-500" />
              <span className="text-gray-700">{mockWikiDocuments[gameState.startDocId]?.title}</span>
            </div>

            <div className="flex-1 border-t-2 border-dashed border-gray-300" />

            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded border-2 border-green-500">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">{goalDoc.title}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
        <div className="text-gray-700">
          <span className="text-blue-600">현재 문서:</span> {currentDoc.title}
        </div>
      </div>
    </div>
  );
}
