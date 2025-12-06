import React from 'react';
import GitBranchTree from './GitBranchTree';

/**
 * Frame 3: 리더보드 화면
 * 게임 랭킹을 표시하고, 각 플레이어의 게임 경로를 확인할 수 있는 화면입니다.
 */
const LeaderboardScreen = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Leaderboard</h1>
      <p className="text-gray-500 mb-6">Subheading</p>

      {/* TODO: 아코디언 UI 컴포넌트로 랭킹 목록 구현 */}
      <div className="border rounded-lg p-4">
        <p>Accordion Item 1 (Player)</p>
        {/* 확장 시 아래 GitBranchTree 컴포넌트 렌더링 */}
        <GitBranchTree />
      </div>
    </div>
  );
};

export default LeaderboardScreen;