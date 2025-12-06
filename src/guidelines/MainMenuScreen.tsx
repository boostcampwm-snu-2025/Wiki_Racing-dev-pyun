import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Frame 1: 메인 게임 화면 (WIKIRACING)
 * 사용자가 게임을 시작하고, 설정을 변경하며, 리더보드로 이동할 수 있는 초기 화면입니다.
 */
const MainMenuScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      {/* 우측 상단 리더보드 버튼 */}
      <div className="absolute top-4 right-4">
        <Link to="/leaderboard" className="px-4 py-2 text-white bg-gray-800 rounded">
          Leaderboard
        </Link>
      </div>

      <h1 className="text-5xl font-bold mb-8">WIKIRACING</h1>

      <Link to="/play" className="px-8 py-4 text-2xl text-white bg-red-500 rounded-lg hover:bg-red-600">
        Play
      </Link>

      {/* 하단 메뉴: 난이도 선택, 역링크 허용, 보관함, 도움말 */}
      <div className="absolute bottom-10 flex flex-col items-center space-y-4">
        <div>{/* TODO: 난이도 선택 컴포넌트 (쉬운/랜덤) */}</div>
        <div>{/* TODO: 역링크 허용 체크박스 */}</div>
        <div className="flex space-x-4">{/* TODO: 보관함 / 도움말 버튼 */}</div>
      </div>
    </div>
  );
};

export default MainMenuScreen;