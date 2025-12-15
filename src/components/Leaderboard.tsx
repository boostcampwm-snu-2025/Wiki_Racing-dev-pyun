import { useState, useEffect, useRef } from 'react';
import type { LeaderboardEntry } from '../types/wikirace';
import { Trophy, Eye, Clock, Footprints } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { PathReplay } from './PathReplay';
import { mockWikiDocuments } from '../data/mockWikiData';
import initialLeaderboardData from '../data/leaderboard.json';

interface LeaderboardProps {
  currentRun?: {
    path: string[];
    startDocId: string | null;
    goalDocId: string | null;
    score?: number;
    moves?: number;
    time?: number;
    nickname?: string;
    branches?: {
      id: string;
      parentId?: string;
      parentIndex: number;
      nodes: string[];
      color: string;
    }[];
    pathRefs?: { branchId: string; index: number }[];
  };
}

// localStorage 키
const LEADERBOARD_STORAGE_KEY = 'wikirace_leaderboard';

// localStorage에서 리더보드 데이터 로드
const loadLeaderboard = (): LeaderboardEntry[] => {
  try {
    const stored = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load leaderboard from localStorage:', error);
  }
  // localStorage에 데이터가 없으면 초기 데이터 사용
  return initialLeaderboardData as LeaderboardEntry[];
};

// localStorage에 리더보드 데이터 저장
const saveLeaderboard = (data: LeaderboardEntry[]): void => {
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save leaderboard to localStorage:', error);
  }
};

// 초기 리더보드 데이터 로드 함수 export (다른 컴포넌트에서 사용)
export const getMockLeaderboard = (): LeaderboardEntry[] => loadLeaderboard();

// 초기 리더보드 데이터 (export for backwards compatibility)
export const mockLeaderboard: LeaderboardEntry[] = loadLeaderboard();

// 초기 mock 데이터 (삭제 예정, 호환성 유지)
const _deprecatedMockData: LeaderboardEntry[] = [
  {
    rank: 1,
    nickname: '위키마스터',
    startDoc: '대한민국',
    goalDoc: 'K-POP',
    difficulty: '보통',
    score: 920,
    moves: 4,
    time: 32,
    path: ['doc-1', 'doc-5', 'doc-14', 'doc-27'],
    branches: [
      {
        id: 'main',
        parentIndex: 0,
        nodes: ['doc-1', 'doc-5', 'doc-14', 'doc-27'],
        color: '#6366f1'
      }
    ],
    pathRefs: [
      { branchId: 'main', index: 0 },
      { branchId: 'main', index: 1 },
      { branchId: 'main', index: 2 },
      { branchId: 'main', index: 3 }
    ]
  },
  {
    rank: 2,
    nickname: '링크헌터',
    startDoc: '대한민국',
    goalDoc: '세종대왕',
    difficulty: '쉬움',
    score: 850,
    moves: 8,
    time: 45,
    path: ['doc-1', 'doc-3', 'doc-7', 'doc-3', 'doc-10', 'doc-9'],
    branches: [
      {
        id: 'main',
        parentIndex: 0,
        nodes: ['doc-1', 'doc-3', 'doc-10', 'doc-9'],
        color: '#6366f1'
      },
      {
        id: 'branch-1',
        parentId: 'main',
        parentIndex: 1,
        nodes: ['doc-7'],
        color: '#ec4899'
      }
    ],
    pathRefs: [
      { branchId: 'main', index: 0 },
      { branchId: 'main', index: 1 },
      { branchId: 'branch-1', index: 0 },
      { branchId: 'main', index: 1 },
      { branchId: 'main', index: 2 },
      { branchId: 'main', index: 3 }
    ]
  },
  {
    rank: 3,
    nickname: '탐험가',
    startDoc: '서울',
    goalDoc: '음악',
    difficulty: '보통',
    score: 780,
    moves: 12,
    time: 58,
    path: ['doc-2', 'doc-7', 'doc-17', 'doc-7', 'doc-15', 'doc-7', 'doc-2', 'doc-9', 'doc-14', 'doc-27'],
    branches: [
      {
        id: 'main',
        parentIndex: 0,
        nodes: ['doc-2', 'doc-7', 'doc-9', 'doc-14', 'doc-27'],
        color: '#6366f1'
      },
      {
        id: 'branch-1',
        parentId: 'main',
        parentIndex: 1,
        nodes: ['doc-17'],
        color: '#ec4899'
      },
      {
        id: 'branch-2',
        parentId: 'main',
        parentIndex: 1,
        nodes: ['doc-15'],
        color: '#10b981'
      }
    ],
    pathRefs: [
      { branchId: 'main', index: 0 },
      { branchId: 'main', index: 1 },
      { branchId: 'branch-1', index: 0 },
      { branchId: 'main', index: 1 },
      { branchId: 'branch-2', index: 0 },
      { branchId: 'main', index: 1 },
      { branchId: 'main', index: 0 },
      { branchId: 'main', index: 2 },
      { branchId: 'main', index: 3 },
      { branchId: 'main', index: 4 }
    ]
  },
  {
    rank: 4,
    nickname: '경로탐색자',
    startDoc: '대한민국',
    goalDoc: '과학',
    difficulty: '어려움',
    score: 720,
    moves: 15,
    time: 72,
    path: ['doc-1', 'doc-2', 'doc-8', 'doc-2', 'doc-12', 'doc-2', 'doc-1', 'doc-5', 'doc-19', 'doc-5', 'doc-1', 'doc-33', 'doc-47'],
    branches: [
      {
        id: 'main',
        parentIndex: 0,
        nodes: ['doc-1', 'doc-2', 'doc-33', 'doc-47'],
        color: '#6366f1'
      },
      {
        id: 'branch-1',
        parentId: 'main',
        parentIndex: 1,
        nodes: ['doc-8'],
        color: '#ec4899'
      },
      {
        id: 'branch-2',
        parentId: 'main',
        parentIndex: 1,
        nodes: ['doc-12'],
        color: '#10b981'
      },
      {
        id: 'branch-3',
        parentId: 'main',
        parentIndex: 0,
        nodes: ['doc-5', 'doc-19'],
        color: '#f59e0b'
      }
    ],
    pathRefs: [
      { branchId: 'main', index: 0 },
      { branchId: 'main', index: 1 },
      { branchId: 'branch-1', index: 0 },
      { branchId: 'main', index: 1 },
      { branchId: 'branch-2', index: 0 },
      { branchId: 'main', index: 1 },
      { branchId: 'main', index: 0 },
      { branchId: 'branch-3', index: 0 },
      { branchId: 'branch-3', index: 1 },
      { branchId: 'branch-3', index: 0 },
      { branchId: 'main', index: 0 },
      { branchId: 'main', index: 2 },
      { branchId: 'main', index: 3 }
    ]
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

export function Leaderboard({ currentRun }: LeaderboardProps) {
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);
  const [showReplay, setShowReplay] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(loadLeaderboard());
  const savedEntriesRef = useRef<Set<string>>(new Set());

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

  // 난이도 자동 계산 함수
  const calculateDifficulty = (moves: number, score: number): string => {
    // 점수가 높고 이동 횟수가 적으면 쉬움
    if (score >= 800 && moves <= 5) return '쉬움';
    // 점수가 낮거나 이동 횟수가 많으면 어려움
    if (score < 600 || moves >= 13) return '어려움';
    // 그 외는 보통
    return '보통';
  };

  const entries: LeaderboardEntry[] = (() => {
    if (!currentRun || currentRun.path.length === 0) return leaderboardData;

    const startTitle = currentRun.startDocId ? mockWikiDocuments[currentRun.startDocId]?.title : undefined;
    const goalTitle = currentRun.goalDocId ? mockWikiDocuments[currentRun.goalDocId]?.title : undefined;

    const moves = currentRun.moves ?? Math.max(currentRun.path.length - 1, 0);
    const score = currentRun.score ?? 0;

    // 이미 leaderboardData에 같은 엔트리가 있는지 확인
    const alreadySaved = currentRun.nickname && leaderboardData.some(
      entry => entry.nickname === currentRun.nickname &&
               entry.score === score &&
               entry.moves === moves
    );

    // 이미 저장된 경우 leaderboardData만 반환 (isCurrentUser 마킹만 추가)
    if (alreadySaved) {
      return leaderboardData.map((entry, index) => ({
        ...entry,
        rank: index + 1,
        isCurrentUser: entry.nickname === currentRun.nickname &&
                       entry.score === score &&
                       entry.moves === moves ? true : undefined
      }));
    }

    const currentEntry: LeaderboardEntry = {
      rank: 0, // 임시 순위, 아래에서 재계산
      nickname: currentRun.nickname ?? '내 경로',
      startDoc: startTitle ?? '시작',
      goalDoc: goalTitle ?? '목표',
      difficulty: calculateDifficulty(moves, score),
      score,
      moves,
      time: currentRun.time ?? 0,
      path: currentRun.path,
      branches: currentRun.branches,
      pathRefs: currentRun.pathRefs,
      isCurrentUser: true
    };

    // 모든 엔트리를 점수 기준으로 정렬하고 순위 재계산
    const allEntries = [currentEntry, ...leaderboardData];
    allEntries.sort((a, b) => b.score - a.score);

    // 순위 재부여
    return allEntries.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  })();

  // 사용자가 닉네임을 입력했을 때 리더보드 업데이트
  useEffect(() => {
    if (currentRun && currentRun.nickname && currentRun.score) {
      const moves = currentRun.moves ?? Math.max(currentRun.path.length - 1, 0);

      // 고유 키 생성 (닉네임-점수-이동횟수)
      const entryKey = `${currentRun.nickname}-${currentRun.score}-${moves}`;

      // 이미 저장한 적이 있는지 확인
      if (savedEntriesRef.current.has(entryKey)) {
        return;
      }

      // 이미 저장된 엔트리인지 확인 (닉네임, 점수, 이동횟수가 모두 같으면 중복으로 간주)
      const isDuplicate = leaderboardData.some(
        entry => entry.nickname === currentRun.nickname &&
                 entry.score === currentRun.score &&
                 entry.moves === moves
      );

      // 중복이면 저장하지 않음
      if (isDuplicate) {
        savedEntriesRef.current.add(entryKey);
        return;
      }

      const startTitle = currentRun.startDocId ? mockWikiDocuments[currentRun.startDocId]?.title : undefined;
      const goalTitle = currentRun.goalDocId ? mockWikiDocuments[currentRun.goalDocId]?.title : undefined;
      const score = currentRun.score;

      const newEntry: LeaderboardEntry = {
        rank: 0,
        nickname: currentRun.nickname,
        startDoc: startTitle ?? '시작',
        goalDoc: goalTitle ?? '목표',
        difficulty: calculateDifficulty(moves, score),
        score,
        moves,
        time: currentRun.time ?? 0,
        path: currentRun.path,
        branches: currentRun.branches,
        pathRefs: currentRun.pathRefs,
      };

      // 기존 데이터와 합쳐서 정렬
      const updatedData = [...leaderboardData, newEntry];
      updatedData.sort((a, b) => b.score - a.score);

      // 상위 10개만 유지
      const top10 = updatedData.slice(0, 10).map((entry, index) => ({
        ...entry,
        rank: index + 1,
        isCurrentUser: entry.nickname === currentRun.nickname ? true : undefined
      }));

      // localStorage에 저장
      saveLeaderboard(top10);
      setLeaderboardData(top10);

      // 저장했다고 표시
      savedEntriesRef.current.add(entryKey);
    }
  }, [currentRun?.nickname, currentRun?.score]);

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
                {entries.map((entry) => (
                  <tr
                    key={`${entry.rank}-${entry.nickname}`}
                    className={`hover:bg-gray-50 transition-colors ${entry.isCurrentUser ? 'bg-indigo-50/40' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {entry.isCurrentUser ? (
                          <div className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] flex items-center justify-center">
                            내
                          </div>
                        ) : (
                          getRankIcon(entry.rank)
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-gray-900 ${entry.isCurrentUser ? 'font-semibold' : ''}`}>{entry.nickname}</div>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-x-hidden">
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
