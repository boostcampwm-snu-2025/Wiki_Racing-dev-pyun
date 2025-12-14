import type { LeaderboardEntry } from '../types/wikirace';
import { mockWikiDocuments } from '../data/mockWikiData';
import { ScrollArea } from './ui/scroll-area';

interface PathReplayProps {
  entry: LeaderboardEntry;
}

export function PathReplay({ entry }: PathReplayProps) {
  const nodeHeight = 96;
  const columnWidth = 220;
  const branchColor = '#6366f1'; // indigo-500

  // branches가 있으면 git 스타일, 없으면 단순 선형
  const hasBranches = entry.branches && entry.branches.length > 0;
  const branchCount = hasBranches ? entry.branches.length : 1;

  // 난이도 자동 계산 (Leaderboard와 동일한 로직)
  const calculateDifficulty = (moves: number, score: number): string => {
    if (score >= 800 && moves <= 5) return '쉬움';
    if (score < 600 || moves >= 13) return '어려움';
    return '보통';
  };

  const actualDifficulty = entry.difficulty === '현재 플레이' || !entry.difficulty
    ? calculateDifficulty(entry.moves, entry.score)
    : entry.difficulty;

  const nodePositions: {
    key: string;
    branchId: string;
    nodeIndex: number;
    docId: string;
    row: number;
    x: number;
    y: number;
  }[] = [];

  if (hasBranches) {
    // Git graph 스타일: PathHistory와 동일한 로직
    const branchStartRows = new Map<string, number>();

    const calculateBranchStartRow = (branchId: string): number => {
      if (branchStartRows.has(branchId)) {
        return branchStartRows.get(branchId)!;
      }

      const branch = entry.branches!.find(b => b.id === branchId);
      if (!branch) return 0;

      if (!branch.parentId) {
        branchStartRows.set(branchId, 0);
        return 0;
      }

      const parentStartRow = calculateBranchStartRow(branch.parentId);
      const startRow = parentStartRow + branch.parentIndex;
      branchStartRows.set(branchId, startRow);
      return startRow;
    };

    entry.branches.forEach(branch => calculateBranchStartRow(branch.id));

    entry.branches.forEach((branch, branchIdx) => {
      const startRow = branchStartRows.get(branch.id) || 0;

      branch.nodes.forEach((docId, nodeIndex) => {
        const row = startRow + nodeIndex;
        const x = branchIdx * columnWidth + columnWidth / 2;
        const y = row * nodeHeight + nodeHeight / 2;

        nodePositions.push({
          key: `${branch.id}-${nodeIndex}`,
          branchId: branch.id,
          nodeIndex,
          docId,
          row,
          x,
          y,
        });
      });
    });
  } else {
    // 단순 선형 경로
    entry.path.forEach((docId, index) => {
      nodePositions.push({
        key: `node-${index}`,
        branchId: 'main',
        nodeIndex: index,
        docId,
        row: index,
        x: columnWidth / 2,
        y: index * nodeHeight + nodeHeight / 2,
      });
    });
  }

  const positionMap = Object.fromEntries(nodePositions.map(pos => [pos.key, pos]));
  const maxRow = nodePositions.length > 0 ? Math.max(0, ...nodePositions.map(pos => pos.row)) : 0;
  const activePathKeys = new Set(
    (entry.pathRefs || []).map(ref => `${ref.branchId}-${ref.index}`)
  );
  const startDocId = entry.path[0];
  const goalDocId = entry.path[entry.path.length - 1];

  return (
    <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
      {/* 커스텀 스크롤바 스타일 */}
      <style>{`
        .path-replay-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .path-replay-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .path-replay-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .path-replay-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
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
            <div className="text-green-900">{actualDifficulty}</div>
          </div>
        </div>

        {/* Git Branch Style Path Visualization */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-8 mb-6">
          <h3 className="text-gray-800 mb-6 text-center">경로 마인드맵</h3>

          {/* 양방향 스크롤 가능 영역 - 고정된 크기 */}
          <div
            className="overflow-auto border border-gray-200 rounded-lg bg-white"
            style={{
              height: '500px',
              width: '100%',
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 #f1f5f9'
            }}
          >
            <div
              className="relative"
              style={{
                width: `${branchCount * columnWidth + 40}px`,
                height: `${(maxRow + 1) * nodeHeight + 40}px`,
                minWidth: '700px',
              }}
            >
            {/* SVG for connecting lines */}
            <svg
              className="absolute inset-0"
              width={branchCount * columnWidth + 40}
              height={(maxRow + 1) * nodeHeight + 40}
            >
              {/* 브랜치 내부 연결선 */}
              {hasBranches && entry.branches!.map(branch => {
                return branch.nodes.map((_, idx) => {
                  if (idx === 0) return null;
                  const fromKey = `${branch.id}-${idx - 1}`;
                  const toKey = `${branch.id}-${idx}`;
                  const fromPos = positionMap[fromKey];
                  const toPos = positionMap[toKey];
                  if (!fromPos || !toPos) return null;
                  return (
                    <line
                      key={`${branch.id}-line-${idx}`}
                      x1={fromPos.x + 20}
                      y1={fromPos.y + 20}
                      x2={toPos.x + 20}
                      y2={toPos.y + 20}
                      stroke={branch.color}
                      strokeWidth={2}
                      strokeLinecap="round"
                      opacity={0.9}
                    />
                  );
                });
              })}

              {/* 브랜치 분기 연결선 */}
              {hasBranches && entry.branches!.map(branch => {
                if (!branch.parentId) return null;
                const parentKey = `${branch.parentId}-${branch.parentIndex}`;
                const childKey = `${branch.id}-0`;
                const parentPos = positionMap[parentKey];
                const childPos = positionMap[childKey];
                if (!parentPos || !childPos) return null;

                const midY = (parentPos.y + childPos.y) / 2 + 20;
                return (
                  <path
                    key={`${branch.id}-fork`}
                    d={`M${parentPos.x + 20},${parentPos.y + 20} C ${parentPos.x + 80},${midY} ${childPos.x - 40},${midY} ${childPos.x + 20},${childPos.y + 20}`}
                    fill="none"
                    stroke={branch.color}
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* 단순 선형 경로의 연결선 */}
              {!hasBranches && entry.path.map((_, idx) => {
                if (idx === 0) return null;
                const fromPos = nodePositions[idx - 1];
                const toPos = nodePositions[idx];
                return (
                  <line
                    key={`line-${idx}`}
                    x1={fromPos.x + 20}
                    y1={fromPos.y + 20}
                    x2={toPos.x + 20}
                    y2={toPos.y + 20}
                    stroke={branchColor}
                    strokeWidth={2}
                    strokeLinecap="round"
                    opacity={0.9}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodePositions.map((pos) => {
              const doc = mockWikiDocuments[pos.docId];
              const isStart = pos.docId === startDocId;
              const isGoal = pos.docId === goalDocId;
              const isInPath = activePathKeys.has(pos.key);
              const badgeLabel = isStart ? '시작' : isGoal ? '목표' : isInPath ? '경로' : '';
              const nodeBranchColor = hasBranches
                ? entry.branches!.find(b => b.id === pos.branchId)?.color || branchColor
                : branchColor;

              return (
                <div
                  key={pos.key}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-[180px] rounded-xl border shadow-sm bg-white transition-all ${
                    isInPath ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200'
                  }`}
                  style={{
                    left: pos.x + 20,
                    top: pos.y + 20,
                  }}
                >
                  <div className="flex items-start gap-2 p-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
                      style={{ backgroundColor: nodeBranchColor }}
                    >
                      {pos.nodeIndex + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700 font-medium">
                        {doc?.title || '알 수 없음'}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{pos.docId}</div>
                    </div>
                  </div>
                  {badgeLabel && (
                    <div className="px-3 pb-3 text-[11px] text-indigo-700 font-semibold">
                      {badgeLabel}
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        </div>

        {/* Path Analysis */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-gray-800 mb-4">경로 상세 분석</h3>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {entry.path.map((docId, index) => {
              const doc = mockWikiDocuments[docId];
              const isStart = index === 0;
              const isGoal = index === entry.path.length - 1;

              return (
                <div key={`path-${index}-${docId}`} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded flex items-center justify-center text-white text-xs font-semibold mt-1 flex-shrink-0 ${
                    isStart ? 'bg-green-500' : isGoal ? 'bg-red-500' : 'bg-indigo-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm ${isStart || isGoal ? 'font-semibold' : ''} ${
                      isStart ? 'text-green-700' : isGoal ? 'text-red-700' : 'text-gray-700'
                    }`}>
                      {isStart ? '🚀 시작 문서' : isGoal ? '🎯 목표 문서' : '📄 중간 문서'}
                    </div>
                    <div className="text-gray-900 font-medium">
                      {doc?.title || '알 수 없음'}
                    </div>
                    <div className="text-xs text-gray-500">{docId}</div>
                  </div>
                  {index < entry.path.length - 1 && (
                    <div className="text-gray-400 text-xl flex-shrink-0">↓</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-gray-700 mb-2">💡 전략 분석</div>
            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• 총 이동 횟수: {entry.moves}회</li>
              <li>• 실제 경로 길이: {entry.path.length}개 문서</li>
              <li>• 평균 문서당 시간: {entry.moves > 0 ? Math.round(entry.time / entry.moves) : 0}초</li>
              <li>• 효율성: {entry.score >= 700 ? '매우 높음 ⭐⭐⭐' : entry.score >= 500 ? '높음 ⭐⭐' : '보통 ⭐'}</li>
              {hasBranches && (
                <>
                  <li>• 브랜치 수: {entry.branches.length}개 (탐색 시도 포함)</li>
                  <li>• 전략 유형: 다양한 경로 탐색 후 최적 경로 선택</li>
                </>
              )}
              {!hasBranches && (
                <li>• 전략 유형: 직선 경로 (단일 경로 탐색)</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
