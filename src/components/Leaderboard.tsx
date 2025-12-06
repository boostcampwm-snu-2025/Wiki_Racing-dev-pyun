import { useState } from 'react';
import type { LeaderboardEntry } from '../types/wikirace';
import { Trophy, Eye, Clock, Footprints } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { PathReplay } from './PathReplay';

// Mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    nickname: '위키마스터',
    startDoc: '대한민국',
    goalDoc: 'K-POP',
    difficulty: '보통',
    score: 920,
    moves: 4,
    time: 32,
    path: ['doc-1', 'doc-5', 'doc-14', 'doc-27']
  },
  {
    rank: 2,
    nickname: '링크헌터',
    startDoc: '대한민국',
    goalDoc: '세종대왕',
    difficulty: '쉬움',
    score: 850,
    moves: 5,
    time: 45,
    path: ['doc-1', 'doc-3', 'doc-10', 'doc-9']
  },
  {
    rank: 3,
    nickname: '탐험가',
    startDoc: '서울',
    goalDoc: '음악',
    difficulty: '보통',
    score: 780,
    moves: 7,
    time: 58,
    path: ['doc-2', 'doc-7', 'doc-17', 'doc-9', 'doc-10', 'doc-3', 'doc-14', 'doc-27', 'doc-40']
  },
  {
    rank: 4,
    nickname: '경로탐색자',
    startDoc: '대한민국',
    goalDoc: '과학',
    difficulty: '어려움',
    score: 720,
    moves: 8,
    time: 72,
    path: ['doc-1', 'doc-2', 'doc-8', 'doc-19', 'doc-33', 'doc-47']
  },
  {
    rank: 5,
    nickname: '속도광',
    startDoc: '한글',
    goalDoc: '부산',
    difficulty: '어려움',
    score: 680,
    moves: 9,
    time: 65,
    path: ['doc-3', 'doc-5', 'doc-1', 'doc-4', 'doc-12', 'doc-24', 'doc-37', 'doc-51', 'doc-2', 'doc-67']
  },
  {
    rank: 6,
    nickname: '지식인',
    startDoc: '서울',
    goalDoc: '철학',
    difficulty: '보통',
    score: 640,
    moves: 10,
    time: 88,
    path: ['doc-2', 'doc-7', 'doc-17', 'doc-30', 'doc-44']
  },
  {
    rank: 7,
    nickname: '노련한탐험가',
    startDoc: '대한민국',
    goalDoc: '항구',
    difficulty: '보통',
    score: 590,
    moves: 11,
    time: 95,
    path: ['doc-1', 'doc-4', 'doc-12', 'doc-23', 'doc-36', 'doc-50', 'doc-60', 'doc-66', 'doc-1', 'doc-39', 'doc-53', 'doc-62']
  },
  {
    rank: 8,
    nickname: '초보모험가',
    startDoc: '김치',
    goalDoc: '대학',
    difficulty: '쉬움',
    score: 550,
    moves: 12,
    time: 105,
    path: ['doc-4', 'doc-12', 'doc-24', 'doc-37', 'doc-51', 'doc-2', 'doc-35']
  },
  {
    rank: 9,
    nickname: '꾸준러',
    startDoc: '한강',
    goalDoc: '전통 악기',
    difficulty: '어려움',
    score: 480,
    moves: 14,
    time: 128,
    path: ['doc-6', 'doc-15', 'doc-28', 'doc-2', 'doc-7', 'doc-17', 'doc-9', 'doc-20', 'doc-1', 'doc-5', 'doc-14', 'doc-27', 'doc-40', 'doc-54', 'doc-63']
  },
  {
    rank: 10,
    nickname: '도전자',
    startDoc: '경복궁',
    goalDoc: '병원',
    difficulty: '보통',
    score: 420,
    moves: 15,
    time: 145,
    path: ['doc-7', 'doc-17', 'doc-9', 'doc-20', 'doc-1', 'doc-2', 'doc-8', 'doc-6', 'doc-15', 'doc-28', 'doc-42', 'doc-55', 'doc-59', 'doc-49', 'doc-35', 'doc-61']
  }
];

export function Leaderboard() {
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);
  const [showReplay, setShowReplay] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <Trophy className={`w-5 h-5 ${getRankColor(rank)}`} />;
    return <div className="w-5 h-5 flex items-center justify-center text-gray-500">{rank}</div>;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '쉬움': return 'bg-green-100 text-green-700';
      case '보통': return 'bg-yellow-100 text-yellow-700';
      case '어려움': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-gray-900 mb-2">🏆 Top 10 플레이어</h2>
            <p className="text-gray-600">최고 점수를 기록한 플레이어들의 경로를 확인해보세요!</p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">순위</th>
                  <th className="px-6 py-3 text-left text-gray-700">닉네임</th>
                  <th className="px-6 py-3 text-left text-gray-700">경로</th>
                  <th className="px-6 py-3 text-left text-gray-700">난이도</th>
                  <th className="px-6 py-3 text-left text-gray-700">점수</th>
                  <th className="px-6 py-3 text-left text-gray-700">통계</th>
                  <th className="px-6 py-3 text-left text-gray-700">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockLeaderboard.map((entry) => (
                  <tr key={entry.rank} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(entry.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{entry.nickname}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 text-sm">
                        <div>{entry.startDoc}</div>
                        <div className="text-gray-400">↓</div>
                        <div>{entry.goalDoc}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(entry.difficulty)}`}>
                        {entry.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`${getRankColor(entry.rank)}`}>
                        {entry.score}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <Footprints className="w-3 h-3" />
                          {entry.moves}회
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(entry.time)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedEntry(entry);
                          setShowReplay(true);
                        }}
                        className="gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        경로 보기
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollArea>

      <Dialog open={showReplay} onOpenChange={setShowReplay}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedEntry?.nickname}님의 경로 - {selectedEntry?.score}점
            </DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <PathReplay entry={selectedEntry} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
