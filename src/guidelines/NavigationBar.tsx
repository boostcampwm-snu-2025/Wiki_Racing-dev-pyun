import React from 'react';

/**
 * 게임 플레이 화면의 상단 경로 바 (Breadcrumb)
 */
const NavigationBar = () => {
  return (
    <header className="flex items-center p-4 bg-white border-b">
      {/* TODO: Start → ... → NOW → ... → GOAL 형태의 경로 표시 */}
      <p>Start → ... → <span className="text-red-500">NOW</span> → ... → GOAL</p>
    </header>
  );
};

export default NavigationBar;