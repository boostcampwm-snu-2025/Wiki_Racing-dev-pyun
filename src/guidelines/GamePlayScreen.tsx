import React from 'react';
import NavigationBar from "./NavigationBar";
import GitBranchTree from './GitBranchTree';

/**
 * Frame 2: 게임 플레이 화면 (노드 트리)
 * 게임의 핵심 화면으로, 문서 이동 경로, 현재 문서의 링크, 전체 방문 기록을 시각화합니다.
 */
const GamePlayScreen = () => {
  return (
    <div className="flex flex-col h-screen">
      <NavigationBar />
      <div className="flex flex-1">
        {/* 중앙 노드 시각화 영역 */}
        <main className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="text-center">{/* TODO: 중앙 노드(링크) 시각화 컴포넌트 */}</div>
        </main>
        {/* 우측 Git Branch 패널 */}
        <GitBranchTree />
      </div>
    </div>
  );
};

export default GamePlayScreen;